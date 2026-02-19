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

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private readonly systemActorId = new Types.ObjectId('000000000000000000000000');

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
