import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, Transaction, TransactionDocument, ComplianceFlag, ComplianceFlagDocument, AuditLog, AuditLogDocument, FlagStatus, FlagReason } from '@app/database';
import { TransactionType, TransactionStatus, KAFKA_TOPICS } from '@app/common';
import { ClientKafka } from '@nestjs/microservices';
import { ComplianceFlagEvent } from '@app/kafka';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(ComplianceFlag.name) private complianceFlagModel: Model<ComplianceFlagDocument>,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  // ─── User Management ──────────────────────────────
  async getUsers(limit = 20, offset = 0) {
    const users = await this.userModel.find()
      .select('-passwordHash -twoFactorSecret -backupCodes')
      .skip(offset)
      .limit(limit)
      .exec();
    const total = await this.userModel.countDocuments();
    return { data: users, meta: { total, limit, offset } };
  }

  async banUser(userId: string, reason?: string) {
    const user = await this.userModel.findByIdAndUpdate(userId, {
      isBanned: true,
      banReason: reason || 'Banned by admin',
    }, { new: true });
    if (!user) throw new NotFoundException('User not found');

    await this.logAudit('BAN_USER', userId, { reason });
    return user;
  }

  async updateUserTier(userId: string, tier: string) {
    const user = await this.userModel.findByIdAndUpdate(userId, { tier }, { new: true });
    if (!user) throw new NotFoundException('User not found');

    await this.logAudit('TIER_UPDATE', userId, { newTier: tier });
    return user;
  }

  // ─── Compliance ────────────────────────────────────
  async getComplianceFlags(status?: string, limit = 20, offset = 0) {
    const filter: any = {};
    if (status) filter.status = status;

    const flags = await this.complianceFlagModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate('userId', 'username email')
      .exec();

    const total = await this.complianceFlagModel.countDocuments(filter);
    return { data: flags, meta: { total, limit, offset } };
  }

  async freezeAccount(userId: string, reason: string, adminId: string) {
    const user = await this.userModel.findByIdAndUpdate(userId, {
      isFlagged: true,
    }, { new: true });
    if (!user) throw new NotFoundException('User not found');

    const flag = new this.complianceFlagModel({
      userId,
      reason: FlagReason.MANUAL_REPORT,
      status: FlagStatus.INVESTIGATING,
      description: reason,
      reviewedBy: adminId,
    });
    await flag.save();

    this.kafkaClient.emit(KAFKA_TOPICS.COMPLIANCE_FLAGS, new ComplianceFlagEvent({
      userId,
      flagId: flag._id.toString(),
      reason: FlagReason.MANUAL_REPORT,
      action: 'ACCOUNT_FROZEN',
      description: reason,
      triggeredBy: adminId,
    }));

    await this.logAudit('FREEZE_ACCOUNT', userId, { reason, adminId });
    return { success: true, flag };
  }

  async unfreezeAccount(userId: string, adminId: string) {
    const user = await this.userModel.findByIdAndUpdate(userId, {
      isFlagged: false,
    }, { new: true });
    if (!user) throw new NotFoundException('User not found');

    // Resolve open flags
    await this.complianceFlagModel.updateMany(
      { userId, status: { $in: [FlagStatus.OPEN, FlagStatus.INVESTIGATING] } },
      { status: FlagStatus.RESOLVED, reviewedBy: adminId, resolvedAt: new Date() },
    );

    this.kafkaClient.emit(KAFKA_TOPICS.COMPLIANCE_FLAGS, new ComplianceFlagEvent({
      userId,
      flagId: '',
      reason: 'account_unfrozen',
      action: 'ACCOUNT_UNFROZEN',
      description: 'Account unfrozen by admin',
      triggeredBy: adminId,
    }));

    await this.logAudit('UNFREEZE_ACCOUNT', userId, { adminId });
    return { success: true };
  }

  // ─── Withdrawal Approval ──────────────────────────
  async getPendingWithdrawals(limit = 20, offset = 0) {
    const withdrawals = await this.transactionModel
      .find({ type: TransactionType.WITHDRAWAL, status: TransactionStatus.PENDING })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    const total = await this.transactionModel.countDocuments({
      type: TransactionType.WITHDRAWAL,
      status: TransactionStatus.PENDING,
    });

    return { data: withdrawals, meta: { total, limit, offset } };
  }

  async approveWithdrawal(transactionId: string, adminId: string) {
    const tx = await this.transactionModel.findById(transactionId);
    if (!tx) throw new NotFoundException('Transaction not found');

    tx.status = TransactionStatus.COMPLETED;
    await tx.save();

    await this.logAudit('APPROVE_WITHDRAWAL', tx.userId.toString(), {
      transactionId,
      amount: tx.amount,
      currency: tx.currency,
      adminId,
    });

    return tx;
  }

  async rejectWithdrawal(transactionId: string, reason: string, adminId: string) {
    const tx = await this.transactionModel.findById(transactionId);
    if (!tx) throw new NotFoundException('Transaction not found');

    tx.status = TransactionStatus.FAILED;
    await tx.save();

    await this.logAudit('REJECT_WITHDRAWAL', tx.userId.toString(), {
      transactionId,
      reason,
      amount: tx.amount,
      currency: tx.currency,
      adminId,
    });

    return tx;
  }

  // ─── Audit Logging ────────────────────────────────
  private async logAudit(action: string, targetId: string, metadata: any) {
    const log = new this.auditLogModel({
      action,
      targetId,
      metadata,
    });
    await log.save();
    this.logger.log(`Audit: ${action} on ${targetId}`);
  }
}
