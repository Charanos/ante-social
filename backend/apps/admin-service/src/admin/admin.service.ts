import {
  Injectable,
  NotFoundException,
  Inject,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  User,
  UserDocument,
  Wallet,
  WalletDocument,
  Market,
  MarketDocument,
  Transaction,
  TransactionDocument,
  ComplianceFlag,
  ComplianceFlagDocument,
  AuditLog,
  AuditLogDocument,
  FlagStatus,
  FlagReason,
} from '@app/database';
import { TransactionType, TransactionStatus, KAFKA_TOPICS } from '@app/common';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ComplianceFlagEvent } from '@app/kafka';

type MaintenanceTaskId =
  | 'integrity-check'
  | 'fix-threshold'
  | 'reconciliation'
  | 'health-check'
  | 'audit-chain'
  | 'backup';

type MaintenanceTaskDescriptor = {
  id: MaintenanceTaskId;
  title: string;
  description: string;
  destructive: boolean;
};

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private readonly systemActorId = new Types.ObjectId('000000000000000000000000');
  private readonly maintenanceTasks: MaintenanceTaskDescriptor[] = [
    {
      id: 'integrity-check',
      title: 'Data Integrity Check',
      description: 'Scan for market outcome and participant consistency anomalies.',
      destructive: false,
    },
    {
      id: 'fix-threshold',
      title: 'Fix Sub-Threshold Markets',
      description: 'Cancel settled markets that did not meet minimum participation.',
      destructive: true,
    },
    {
      id: 'reconciliation',
      title: 'Financial Reconciliation',
      description: 'Compare wallet balances with transaction ledger snapshots.',
      destructive: false,
    },
    {
      id: 'health-check',
      title: 'Data Health Check',
      description: 'Run combined integrity, audit-chain, and payment staleness checks.',
      destructive: false,
    },
    {
      id: 'audit-chain',
      title: 'Verify Audit Chain',
      description: 'Validate audit sequence continuity and timestamp ordering.',
      destructive: false,
    },
    {
      id: 'backup',
      title: 'Export Backup',
      description: 'Create a JSON snapshot of critical entities and admin logs.',
      destructive: false,
    },
  ];

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(Market.name) private marketModel: Model<MarketDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(ComplianceFlag.name) private complianceFlagModel: Model<ComplianceFlagDocument>,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    @Inject('WALLET_SERVICE') private readonly walletClient: ClientProxy,
  ) {}

  async getUsers(
    limit = 20,
    offset = 0,
    search?: string,
    role?: string,
    tier?: string,
  ) {
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 200);
    const safeOffset = Math.max(Number(offset) || 0, 0);

    const filter: Record<string, any> = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ email: regex }, { username: regex }, { fullName: regex }];
    }
    if (role) filter.role = role;
    if (tier) filter.tier = tier;

    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select('-passwordHash -twoFactorSecret -backupCodes')
        .sort({ createdAt: -1 })
        .skip(safeOffset)
        .limit(safeLimit)
        .exec(),
      this.userModel.countDocuments(filter),
    ]);

    return { data: users, meta: { total, limit: safeLimit, offset: safeOffset } };
  }

  async banUser(userId: string, reason?: string) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        isBanned: true,
        banReason: reason || 'Banned by admin',
      },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');

    await this.logAudit('BAN_USER', userId, { reason, entityType: 'user' });
    return user;
  }

  async unbanUser(userId: string) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { isBanned: false, banReason: undefined },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');

    await this.logAudit('UNBAN_USER', userId, { entityType: 'user' });
    return user;
  }

  async updateUserTier(userId: string, tier: string) {
    const user = await this.userModel.findByIdAndUpdate(userId, { tier }, { new: true });
    if (!user) throw new NotFoundException('User not found');

    await this.logAudit('TIER_UPDATE', userId, { newTier: tier, entityType: 'user' });
    return user;
  }

  async getComplianceFlags(status?: string, limit = 20, offset = 0) {
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 200);
    const safeOffset = Math.max(Number(offset) || 0, 0);
    const filter: Record<string, any> = {};
    if (status) filter.status = status;

    const [flags, total] = await Promise.all([
      this.complianceFlagModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(safeOffset)
        .limit(safeLimit)
        .populate('userId', 'username email')
        .exec(),
      this.complianceFlagModel.countDocuments(filter),
    ]);

    return { data: flags, meta: { total, limit: safeLimit, offset: safeOffset } };
  }

  async freezeAccount(userId: string, reason: string, adminId: string) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        isFlagged: true,
      },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');

    const flag = new this.complianceFlagModel({
      userId,
      reason: FlagReason.MANUAL_REPORT,
      status: FlagStatus.INVESTIGATING,
      description: reason,
      reviewedBy: adminId,
    });
    await flag.save();

    this.kafkaClient.emit(
      KAFKA_TOPICS.COMPLIANCE_FLAGS,
      new ComplianceFlagEvent({
        userId,
        flagId: flag._id.toString(),
        reason: FlagReason.MANUAL_REPORT,
        action: 'ACCOUNT_FROZEN',
        description: reason,
        triggeredBy: adminId,
      }),
    );

    await this.logAudit('FREEZE_ACCOUNT', userId, { reason, adminId, entityType: 'user' });
    return { success: true, flag };
  }

  async unfreezeAccount(userId: string, adminId: string) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        isFlagged: false,
      },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');

    await this.complianceFlagModel.updateMany(
      { userId, status: { $in: [FlagStatus.OPEN, FlagStatus.INVESTIGATING] } },
      { status: FlagStatus.RESOLVED, reviewedBy: adminId, resolvedAt: new Date() },
    );

    this.kafkaClient.emit(
      KAFKA_TOPICS.COMPLIANCE_FLAGS,
      new ComplianceFlagEvent({
        userId,
        flagId: '',
        reason: 'account_unfrozen',
        action: 'ACCOUNT_UNFROZEN',
        description: 'Account unfrozen by admin',
        triggeredBy: adminId,
      }),
    );

    await this.logAudit('UNFREEZE_ACCOUNT', userId, { adminId, entityType: 'user' });
    return { success: true };
  }

  async getPendingWithdrawals(limit = 20, offset = 0) {
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 200);
    const safeOffset = Math.max(Number(offset) || 0, 0);
    const filter = {
      type: TransactionType.WITHDRAWAL,
      status: TransactionStatus.PENDING,
    };

    const [withdrawals, total] = await Promise.all([
      this.transactionModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(safeOffset)
        .limit(safeLimit)
        .exec(),
      this.transactionModel.countDocuments(filter),
    ]);

    return { data: withdrawals, meta: { total, limit: safeLimit, offset: safeOffset } };
  }

  async approveWithdrawal(transactionId: string, adminId: string) {
    const rpcResult = await lastValueFrom(
      this.walletClient.send('approve_withdrawal', { transactionId }),
    );

    if (!rpcResult?.success) {
      throw new BadRequestException(rpcResult?.error || 'Failed to approve withdrawal');
    }

    const tx = rpcResult.data;
    const userId = tx?.userId?.toString?.() || '';
    await this.logAudit('APPROVE_WITHDRAWAL', userId, {
      transactionId,
      amount: tx?.amount,
      currency: tx?.currency,
      adminId,
      entityType: 'transaction',
    });
    return tx;
  }

  async rejectWithdrawal(transactionId: string, reason: string, adminId: string) {
    const rpcResult = await lastValueFrom(
      this.walletClient.send('reject_withdrawal', { transactionId }),
    );

    if (!rpcResult?.success) {
      throw new BadRequestException(rpcResult?.error || 'Failed to reject withdrawal');
    }

    const tx = rpcResult.data;
    const userId = tx?.userId?.toString?.() || '';
    await this.logAudit('REJECT_WITHDRAWAL', userId, {
      transactionId,
      reason,
      amount: tx?.amount,
      currency: tx?.currency,
      adminId,
      entityType: 'transaction',
    });
    return tx;
  }

  async getAuditLogs(limit = 20, offset = 0, action?: string) {
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 200);
    const safeOffset = Math.max(Number(offset) || 0, 0);

    const filter: Record<string, any> = {};
    if (action) filter.action = action;

    const [logs, total] = await Promise.all([
      this.auditLogModel
        .find(filter)
        .sort({ sequenceNumber: -1 })
        .skip(safeOffset)
        .limit(safeLimit)
        .lean()
        .exec(),
      this.auditLogModel.countDocuments(filter),
    ]);

    return { data: logs, meta: { total, limit: safeLimit, offset: safeOffset } };
  }

  async getMaintenanceTasks() {
    const latestRuns = await this.auditLogModel
      .find({ action: 'RUN_MAINTENANCE_TASK' })
      .sort({ sequenceNumber: -1 })
      .limit(250)
      .select('timestamp metadata')
      .lean()
      .exec();

    const runMap = new Map<string, { timestamp: Date; status: string }>();
    for (const run of latestRuns) {
      const metadata = (run?.metadata || {}) as Record<string, unknown>;
      const taskId = typeof metadata.taskId === 'string' ? metadata.taskId : '';
      if (!taskId || runMap.has(taskId)) continue;
      runMap.set(taskId, {
        timestamp: run.timestamp,
        status: typeof metadata.status === 'string' ? metadata.status : 'completed',
      });
    }

    return {
      data: this.maintenanceTasks.map((task) => ({
        ...task,
        lastRun: runMap.get(task.id) || null,
      })),
    };
  }

  async runMaintenanceTask(taskId: string, adminId: string) {
    if (!this.isMaintenanceTaskId(taskId)) {
      throw new BadRequestException('Unknown maintenance task');
    }

    let result: Record<string, unknown>;
    switch (taskId) {
      case 'integrity-check':
        result = await this.runIntegrityCheck();
        break;
      case 'fix-threshold':
        result = await this.runThresholdRepair();
        break;
      case 'reconciliation':
        result = await this.runFinancialReconciliation();
        break;
      case 'health-check':
        result = await this.runHealthCheck();
        break;
      case 'audit-chain':
        result = await this.runAuditChainCheck();
        break;
      case 'backup':
        result = await this.runBackupExport();
        break;
      default:
        throw new BadRequestException('Unknown maintenance task');
    }

    await this.logAudit('RUN_MAINTENANCE_TASK', adminId, {
      adminId,
      taskId,
      status: 'completed',
      resultSummary: this.summarizeMaintenanceResult(result),
      entityType: 'system',
    });

    return {
      success: true,
      taskId,
      executedAt: new Date().toISOString(),
      result,
    };
  }

  private async runIntegrityCheck() {
    const markets = await this.marketModel
      .find({ isDeleted: { $ne: true } })
      .select('_id title status minParticipants participantCount outcomes startTime closeTime')
      .lean()
      .exec();

    const participantMismatches: Array<{
      marketId: string;
      title: string;
      participantCount: number;
      outcomesParticipantCount: number;
    }> = [];

    let invalidOutcomeConfig = 0;
    let invalidTimeline = 0;

    for (const market of markets) {
      const outcomes = Array.isArray(market.outcomes) ? market.outcomes : [];
      const outcomesParticipantCount = outcomes.reduce((sum, outcome: any) => {
        const participantCount = Number(outcome?.participantCount || 0);
        return sum + (Number.isFinite(participantCount) ? participantCount : 0);
      }, 0);

      const participantCount = Number(market.participantCount || 0);
      if (participantCount !== outcomesParticipantCount) {
        participantMismatches.push({
          marketId: market._id.toString(),
          title: market.title,
          participantCount,
          outcomesParticipantCount,
        });
      }

      if (outcomes.length < 2) {
        invalidOutcomeConfig += 1;
      }

      if (
        market.startTime &&
        market.closeTime &&
        new Date(market.closeTime).getTime() <= new Date(market.startTime).getTime()
      ) {
        invalidTimeline += 1;
      }
    }

    return {
      scannedMarkets: markets.length,
      participantMismatchCount: participantMismatches.length,
      invalidOutcomeConfigCount: invalidOutcomeConfig,
      invalidTimelineCount: invalidTimeline,
      sampleMismatches: participantMismatches.slice(0, 25),
    };
  }

  private async runThresholdRepair() {
    const settledMarkets = await this.marketModel
      .find({
        isDeleted: { $ne: true },
        status: { $in: ['settled', 'settling'] },
      })
      .select('_id title status participantCount minParticipants')
      .lean()
      .exec();

    const invalidMarkets = settledMarkets.filter((market) => {
      const participantCount = Number(market.participantCount || 0);
      const minParticipants = Number(market.minParticipants || 2);
      return participantCount < minParticipants;
    });

    if (invalidMarkets.length === 0) {
      return {
        scannedSettledMarkets: settledMarkets.length,
        repairedMarkets: 0,
        repairedMarketIds: [] as string[],
      };
    }

    const repairIds = invalidMarkets.map((market) => market._id);
    const updateResult = await this.marketModel.updateMany(
      { _id: { $in: repairIds } },
      {
        $set: {
          status: 'cancelled',
          complianceHold: true,
          holdReason: 'Cancelled by maintenance: settled below min participant threshold',
          payoutProcessed: false,
          updatedAt: new Date(),
        },
        $unset: {
          winningOutcomeId: '',
        },
      },
    );

    return {
      scannedSettledMarkets: settledMarkets.length,
      repairedMarkets: updateResult.modifiedCount,
      repairedMarketIds: invalidMarkets.map((market) => market._id.toString()),
    };
  }

  private async runFinancialReconciliation() {
    const staleThreshold = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [walletTotalsRaw, transactionTotalsRaw, stalePendingTransactions] = await Promise.all([
      this.walletModel.aggregate([
        {
          $group: {
            _id: null,
            wallets: { $sum: 1 },
            balanceUsd: { $sum: '$balanceUsd' },
            balanceKsh: { $sum: '$balanceKsh' },
            pendingUsd: { $sum: '$pendingUsd' },
            pendingKsh: { $sum: '$pendingKsh' },
          },
        },
      ]),
      this.transactionModel.aggregate([
        { $match: { status: TransactionStatus.COMPLETED } },
        {
          $group: {
            _id: { currency: '$currency', type: '$type' },
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),
      this.transactionModel.countDocuments({
        status: { $in: [TransactionStatus.PENDING, TransactionStatus.PROCESSING] },
        createdAt: { $lt: staleThreshold },
      }),
    ]);

    const walletTotals = walletTotalsRaw[0] || {
      wallets: 0,
      balanceUsd: 0,
      balanceKsh: 0,
      pendingUsd: 0,
      pendingKsh: 0,
    };

    const ledgerByCurrency: Record<string, { credits: number; debits: number; net: number }> = {};
    const completedTransactionsByType: Record<string, { count: number; amount: number }> = {};

    for (const row of transactionTotalsRaw) {
      const currency = String(row?._id?.currency || 'USD');
      const type = String(row?._id?.type || 'unknown');
      const amount = Number(row?.totalAmount || 0);
      const count = Number(row?.count || 0);

      completedTransactionsByType[`${currency}:${type}`] = { count, amount };

      if (!ledgerByCurrency[currency]) {
        ledgerByCurrency[currency] = { credits: 0, debits: 0, net: 0 };
      }

      if (
        type === TransactionType.DEPOSIT ||
        type === TransactionType.BET_PAYOUT ||
        type === TransactionType.REFUND
      ) {
        ledgerByCurrency[currency].credits += amount;
      } else {
        ledgerByCurrency[currency].debits += amount;
      }
      ledgerByCurrency[currency].net =
        ledgerByCurrency[currency].credits - ledgerByCurrency[currency].debits;
    }

    return {
      walletTotals,
      ledgerByCurrency,
      completedTransactionsByType,
      stalePendingTransactions,
    };
  }

  private async runHealthCheck() {
    const [integrity, auditChain, openComplianceFlags, stalePendingTransactions] = await Promise.all([
      this.runIntegrityCheck(),
      this.runAuditChainCheck(),
      this.complianceFlagModel.countDocuments({
        status: { $in: [FlagStatus.OPEN, FlagStatus.INVESTIGATING] },
      }),
      this.transactionModel.countDocuments({
        status: { $in: [TransactionStatus.PENDING, TransactionStatus.PROCESSING] },
        createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
    ]);

    const isHealthy =
      integrity.participantMismatchCount === 0 &&
      integrity.invalidOutcomeConfigCount === 0 &&
      integrity.invalidTimelineCount === 0 &&
      auditChain.gapCount === 0 &&
      auditChain.outOfOrderTimestamps === 0 &&
      stalePendingTransactions === 0;

    return {
      isHealthy,
      openComplianceFlags,
      stalePendingTransactions,
      integrity,
      auditChain,
    };
  }

  private async runAuditChainCheck() {
    const logs = await this.auditLogModel
      .find()
      .sort({ sequenceNumber: 1 })
      .select('sequenceNumber timestamp')
      .limit(20000)
      .lean()
      .exec();

    if (logs.length === 0) {
      return {
        totalLogs: 0,
        firstSequence: null,
        lastSequence: null,
        gapCount: 0,
        outOfOrderTimestamps: 0,
        sampleGaps: [] as Array<{ expected: number; actual: number }>,
      };
    }

    const gaps: Array<{ expected: number; actual: number }> = [];
    let outOfOrderTimestamps = 0;

    for (let i = 1; i < logs.length; i += 1) {
      const previous = logs[i - 1];
      const current = logs[i];
      const expected = Number(previous.sequenceNumber || 0) + 1;
      const actual = Number(current.sequenceNumber || 0);
      if (actual !== expected) {
        gaps.push({ expected, actual });
      }

      const previousTs = new Date(previous.timestamp).getTime();
      const currentTs = new Date(current.timestamp).getTime();
      if (Number.isFinite(previousTs) && Number.isFinite(currentTs) && currentTs < previousTs) {
        outOfOrderTimestamps += 1;
      }
    }

    return {
      totalLogs: logs.length,
      firstSequence: logs[0].sequenceNumber,
      lastSequence: logs[logs.length - 1].sequenceNumber,
      gapCount: gaps.length,
      outOfOrderTimestamps,
      sampleGaps: gaps.slice(0, 25),
    };
  }

  private async runBackupExport() {
    const [users, wallets, markets, transactions, complianceFlags, auditLogs] = await Promise.all([
      this.userModel
        .find()
        .sort({ createdAt: -1 })
        .limit(250)
        .select(
          '_id email username fullName role tier reputationScore signalAccuracy isVerified isFlagged isBanned createdAt updatedAt',
        )
        .lean()
        .exec(),
      this.walletModel
        .find()
        .sort({ updatedAt: -1 })
        .limit(250)
        .select(
          '_id userId balanceUsd balanceKsh pendingUsd pendingKsh totalDeposits totalWithdrawals totalWinnings totalLosses totalVolume totalPnl version isFrozen createdAt updatedAt',
        )
        .lean()
        .exec(),
      this.marketModel
        .find({ isDeleted: { $ne: true } })
        .sort({ createdAt: -1 })
        .limit(300)
        .select(
          '_id title betType status buyInAmount participantCount totalPool minParticipants closeTime settlementTime payoutProcessed complianceHold holdReason createdAt updatedAt',
        )
        .lean()
        .exec(),
      this.transactionModel
        .find()
        .sort({ createdAt: -1 })
        .limit(500)
        .select(
          '_id userId walletId type amount currency status description externalTransactionId paymentProvider paymentMetadata createdAt updatedAt',
        )
        .lean()
        .exec(),
      this.complianceFlagModel
        .find()
        .sort({ createdAt: -1 })
        .limit(300)
        .select('_id userId reason status description reviewedBy createdAt updatedAt resolvedAt')
        .lean()
        .exec(),
      this.auditLogModel
        .find()
        .sort({ sequenceNumber: -1 })
        .limit(500)
        .select(
          '_id sequenceNumber timestamp eventType actorId actorType entityType entityId action metadata verificationStatus',
        )
        .lean()
        .exec(),
    ]);

    return {
      generatedAt: new Date().toISOString(),
      counts: {
        users: users.length,
        wallets: wallets.length,
        markets: markets.length,
        transactions: transactions.length,
        complianceFlags: complianceFlags.length,
        auditLogs: auditLogs.length,
      },
      data: {
        users,
        wallets,
        markets,
        transactions,
        complianceFlags,
        auditLogs,
      },
    };
  }

  private isMaintenanceTaskId(value: string): value is MaintenanceTaskId {
    return this.maintenanceTasks.some((task) => task.id === value);
  }

  private summarizeMaintenanceResult(result: Record<string, unknown>) {
    const summary: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(result)) {
      if (Array.isArray(value)) {
        summary[key] = value.length;
        continue;
      }
      if (value && typeof value === 'object') {
        continue;
      }
      summary[key] = value;
    }
    return summary;
  }

  private async logAudit(action: string, targetId: string, metadata: Record<string, any>) {
    const actorId = this.parseObjectId(metadata?.adminId) || this.systemActorId;
    const entityId = this.parseObjectId(targetId);
    const latest = await this.auditLogModel
      .findOne()
      .sort({ sequenceNumber: -1 })
      .select('sequenceNumber')
      .lean()
      .exec();

    const log = new this.auditLogModel({
      sequenceNumber: (latest?.sequenceNumber || 0) + 1,
      timestamp: new Date(),
      eventType: 'admin_action',
      actorId,
      actorType: metadata?.adminId ? 'admin' : 'system',
      entityType: metadata?.entityType || 'user',
      entityId,
      action,
      metadata,
      verificationStatus: 'unverified',
    });

    await log.save();
    this.logger.log(`Audit: ${action} on ${targetId}`);
  }

  private parseObjectId(value?: string) {
    if (!value || !Types.ObjectId.isValid(value)) {
      return undefined;
    }
    return new Types.ObjectId(value);
  }
}
