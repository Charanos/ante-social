import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
    email: string;
    username: string;
    fullName: string;
    phone: string;
    location: string;
    bio: string;
    avatarUrl: string;
    timezone: string;
    language: string;
    preferredCurrency: string;
    notificationEmail: boolean;
    notificationPush: boolean;
  }>) {
    // Whitelist allowed fields
    const allowed: Record<string, any> = {};
    const allowedFields = [
      'email',
      'username',
      'fullName',
      'phone',
      'location',
      'bio',
      'avatarUrl',
      'preferredCurrency',
      'timezone',
      'language',
      'notificationEmail',
      'notificationPush',
    ];
    for (const key of allowedFields) {
      if (updates[key as keyof typeof updates] !== undefined) {
        allowed[key] = updates[key as keyof typeof updates];
      }
    }

    if (typeof allowed.email === 'string') {
      const normalizedEmail = allowed.email.trim().toLowerCase();
      if (!normalizedEmail || !normalizedEmail.includes('@')) {
        throw new BadRequestException('Invalid email address');
      }
      const existing = await this.userModel.findOne({
        email: normalizedEmail,
        _id: { $ne: new Types.ObjectId(userId) },
      });
      if (existing) throw new ConflictException('Email already in use');
      allowed.email = normalizedEmail;
    }

    if (typeof allowed.username === 'string') {
      const normalizedUsername = allowed.username.trim();
      if (!normalizedUsername) throw new BadRequestException('Username is required');
      const existing = await this.userModel.findOne({
        username: normalizedUsername,
        _id: { $ne: new Types.ObjectId(userId) },
      });
      if (existing) throw new ConflictException('Username already in use');
      allowed.username = normalizedUsername;
    }

    for (const field of ['fullName', 'phone', 'location', 'bio', 'avatarUrl', 'timezone', 'language', 'preferredCurrency']) {
      if (typeof allowed[field] === 'string') {
        allowed[field] = allowed[field].trim();
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
