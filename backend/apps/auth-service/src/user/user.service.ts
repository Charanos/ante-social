import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument, ActivityLog, ActivityLogDocument } from '@app/database';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(ActivityLog.name) private activityLogModel: Model<ActivityLogDocument>,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-passwordHash -twoFactorSecret -backupCodes -emailVerificationToken -passwordResetToken -passwordResetExpires');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, updates: Partial<{
    fullName: string;
    phone: string;
    avatarUrl: string;
    preferredCurrency: string;
    timezone: string;
    notificationEmail: boolean;
    notificationPush: boolean;
  }>) {
    // Whitelist allowed fields
    const allowed: Record<string, any> = {};
    const allowedFields = ['fullName', 'phone', 'avatarUrl', 'preferredCurrency', 'timezone', 'notificationEmail', 'notificationPush'];
    for (const key of allowedFields) {
      if (updates[key as keyof typeof updates] !== undefined) {
        allowed[key] = updates[key as keyof typeof updates];
      }
    }

    const user = await this.userModel.findByIdAndUpdate(userId, allowed, { new: true })
      .select('-passwordHash -twoFactorSecret -backupCodes -emailVerificationToken -passwordResetToken -passwordResetExpires');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getPublicProfile(userId: string) {
    const user = await this.userModel.findById(userId)
      .select('username fullName avatarUrl tier role reputationScore signalAccuracy totalPositions positionsWon positionsLost activeDays followersCount followingCount groupMemberships isVerified createdAt');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getActivity(userId: string, limit = 20, offset = 0) {
    const activities = await this.activityLogModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    const total = await this.activityLogModel.countDocuments({ userId: new Types.ObjectId(userId) });
    return { data: activities, meta: { total, limit, offset } };
  }
}
