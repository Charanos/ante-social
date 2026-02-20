import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet, WalletDocument, Transaction, TransactionDocument, DailyLimit, DailyLimitDocument } from '@app/database';
import { DepositDto, WithdrawDto, TransferDto, TransactionType, TransactionStatus, DAILY_LIMITS, UserTier } from '@app/common';
import { ClientKafka } from '@nestjs/microservices';
import { WalletTransactionEvent } from '@app/kafka';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(DailyLimit.name) private dailyLimitModel: Model<DailyLimitDocument>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async createWallet(userId: string) {
    const existing = await this.walletModel.findOne({ userId });
    if (existing) return existing;

    const wallet = new this.walletModel({
      userId,
      balanceUsd: 0,
      balanceKsh: 0,
    });
    return wallet.save();
  }

  async getBalance(userId: string) {
    let wallet = await this.walletModel.findOne({ userId });
    if (!wallet) {
      wallet = await this.createWallet(userId);
    }
    if (!wallet) throw new NotFoundException('Wallet not found');
    return {
      balances: {
        USD: { available: wallet.balanceUsd, pending: wallet.pendingUsd || 0 },
        KSH: { available: wallet.balanceKsh, pending: wallet.pendingKsh || 0 },
      },
      totalDeposits: wallet.totalDeposits,
      totalWithdrawals: wallet.totalWithdrawals,
      totalWinnings: wallet.totalWinnings,
      totalLosses: wallet.totalLosses,
    };
  }

  async getTransactions(userId: string, limit = 20, offset = 0) {
    const transactions = await this.transactionModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
    
    const total = await this.transactionModel.countDocuments({ userId });
    return { data: transactions, meta: { total, limit, offset } };
  }

  // ─── Deposit Flow ──────────────────────────────────
  async initiateDeposit(userId: string, depositDto: DepositDto) {
    // Check daily limits
    await this.checkDailyLimit(userId, depositDto.amount, 'deposit');

    // Create pending transaction
    const tx = new this.transactionModel({
      userId,
      type: TransactionType.DEPOSIT,
      amount: depositDto.amount,
      currency: depositDto.currency,
      description: `${depositDto.currency} deposit`,
      status: TransactionStatus.PENDING,
    });
    await tx.save();

    return { transactionId: tx._id, status: 'pending', message: 'Deposit initiated' };
  }

  // ─── Withdrawal Flow ──────────────────────────────
  async initiateWithdrawal(userId: string, withdrawDto: WithdrawDto) {
    let wallet = await this.walletModel.findOne({ userId });
    if (!wallet) {
      wallet = await this.createWallet(userId);
    }
    if (!wallet) throw new NotFoundException('Wallet not found');

    const balance = withdrawDto.currency === 'USD' ? wallet.balanceUsd : wallet.balanceKsh;
    if (balance < withdrawDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Check daily limits
    await this.checkDailyLimit(userId, withdrawDto.amount, 'withdrawal');

    // Hold funds (move to pending)
    if (withdrawDto.currency === 'USD') {
      wallet.balanceUsd -= withdrawDto.amount;
      wallet.pendingUsd = (wallet.pendingUsd || 0) + withdrawDto.amount;
    } else {
      wallet.balanceKsh -= withdrawDto.amount;
      wallet.pendingKsh = (wallet.pendingKsh || 0) + withdrawDto.amount;
    }
    await wallet.save();

    // Create pending transaction
    const tx = new this.transactionModel({
      userId,
      type: TransactionType.WITHDRAWAL,
      amount: withdrawDto.amount,
      currency: withdrawDto.currency,
      description: `${withdrawDto.currency} withdrawal`,
      status: TransactionStatus.PENDING,
      metadata: {
        phoneNumber: withdrawDto.phoneNumber,
        cryptoAddress: withdrawDto.cryptoAddress,
      },
    });
    await tx.save();

    // Emit Kafka event
    this.kafkaClient.emit('wallet.transactions', new WalletTransactionEvent({
      userId,
      transactionId: tx._id.toString(),
      type: TransactionType.WITHDRAWAL,
      amount: withdrawDto.amount,
      currency: withdrawDto.currency,
      status: TransactionStatus.PENDING,
      description: `${withdrawDto.currency} withdrawal`,
    }));

    return { transactionId: tx._id, status: 'pending', message: 'Withdrawal request submitted for approval' };
  }

  // ─── Daily Limit Check ─────────────────────────────
  private async checkDailyLimit(userId: string, amount: number, type: 'deposit' | 'withdrawal') {
    const today = new Date().toISOString().split('T')[0];
    
    let dailyRecord = await this.dailyLimitModel.findOne({ userId, date: today });
    if (!dailyRecord) {
      dailyRecord = new this.dailyLimitModel({ userId, date: today });
      await dailyRecord.save();
    }

    // For now, use NOVICE limits. In production, look up user tier.
    const limits = DAILY_LIMITS[UserTier.NOVICE];
    const limitKey = type === 'deposit' ? 'deposit' : 'withdrawal';
    const usedKey = type === 'deposit' ? 'depositUsedUsd' : 'withdrawalUsedUsd';

    if (dailyRecord[usedKey] + amount > limits[limitKey]) {
      throw new BadRequestException(
        `Daily ${type} limit exceeded. Used: ${dailyRecord[usedKey]}, Limit: ${limits[limitKey]}`,
      );
    }

    // Update usage
    dailyRecord[usedKey] += amount;
    await dailyRecord.save();
  }

  // ─── Internal Balance Operations ────────────────────
  async creditBalance(userId: string, amount: number, currency: string, description: string, type: string) {
    let wallet = await this.walletModel.findOne({ userId });
    if (!wallet) {
      wallet = await this.createWallet(userId);
    }
    if (!wallet) throw new NotFoundException('Wallet not found');

    if (currency === 'USD') {
      wallet.balanceUsd += amount;
      wallet.totalDeposits += (type === TransactionType.DEPOSIT ? amount : 0);
      wallet.totalWinnings += (type === TransactionType.BET_PAYOUT ? amount : 0);
    } else {
      wallet.balanceKsh += amount;
    }
    await wallet.save();

    const tx = new this.transactionModel({
      userId,
      type,
      amount,
      currency,
      description,
      status: TransactionStatus.COMPLETED,
    });
    const savedTx = await tx.save();

    // Emit Kafka event
    this.kafkaClient.emit('wallet.transactions', new WalletTransactionEvent({
      userId,
      transactionId: savedTx._id.toString(),
      type,
      amount,
      currency,
      status: TransactionStatus.COMPLETED,
      description,
    }));

    return savedTx;
  }

  async debitBalance(userId: string, amount: number, currency: string, description: string, type: string) {
    let wallet = await this.walletModel.findOne({ userId });
    if (!wallet) {
      wallet = await this.createWallet(userId);
    }
    if (!wallet) throw new NotFoundException('Wallet not found');

    if (currency === 'USD') {
      if (wallet.balanceUsd < amount) throw new BadRequestException('Insufficient funds');
      wallet.balanceUsd -= amount;
      wallet.totalWithdrawals += (type === TransactionType.WITHDRAWAL ? amount : 0);
      wallet.totalLosses += (type === TransactionType.BET_PLACED ? amount : 0);
    } else {
      if (wallet.balanceKsh < amount) throw new BadRequestException('Insufficient funds');
      wallet.balanceKsh -= amount;
    }
    await wallet.save();

    const tx = new this.transactionModel({
      userId,
      type,
      amount,
      currency,
      description,
      status: TransactionStatus.COMPLETED,
    });
    const savedTx = await tx.save();

    // Emit Kafka event
    this.kafkaClient.emit('wallet.transactions', new WalletTransactionEvent({
      userId,
      transactionId: savedTx._id.toString(),
      type,
      amount,
      currency,
      status: TransactionStatus.COMPLETED,
      description,
    }));

    return savedTx;
  }

  // ─── Withdrawal Approval (called by Admin service) ─
  async approveWithdrawal(transactionId: string) {
    const tx = await this.transactionModel.findById(transactionId);
    if (!tx || tx.type !== TransactionType.WITHDRAWAL || tx.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Invalid withdrawal transaction');
    }

    tx.status = TransactionStatus.COMPLETED;
    await tx.save();

    // Release pending funds
    const wallet = await this.walletModel.findOne({ userId: tx.userId });
    if (wallet) {
      if (tx.currency === 'USD') {
        wallet.pendingUsd = Math.max(0, (wallet.pendingUsd || 0) - tx.amount);
        wallet.totalWithdrawals += tx.amount;
      } else {
        wallet.pendingKsh = Math.max(0, (wallet.pendingKsh || 0) - tx.amount);
      }
      await wallet.save();
    }

    return tx;
  }

  async rejectWithdrawal(transactionId: string) {
    const tx = await this.transactionModel.findById(transactionId);
    if (!tx || tx.type !== TransactionType.WITHDRAWAL || tx.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('Invalid withdrawal transaction');
    }

    tx.status = TransactionStatus.FAILED;
    await tx.save();

    // Refund pending funds back to available
    const wallet = await this.walletModel.findOne({ userId: tx.userId });
    if (wallet) {
      if (tx.currency === 'USD') {
        wallet.pendingUsd = Math.max(0, (wallet.pendingUsd || 0) - tx.amount);
        wallet.balanceUsd += tx.amount;
      } else {
        wallet.pendingKsh = Math.max(0, (wallet.pendingKsh || 0) - tx.amount);
        wallet.balanceKsh += tx.amount;
      }
      await wallet.save();
    }

    return tx;
  }
}
