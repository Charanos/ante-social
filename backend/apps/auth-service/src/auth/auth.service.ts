import { Injectable, ConflictException, UnauthorizedException, BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { User, UserDocument, Wallet, WalletDocument } from '@app/database';
import { RegisterDto, LoginDto, UserRole, UserTier, JwtPayload, MIN_AGE_YEARS } from '@app/common';

import { ClientKafka } from '@nestjs/microservices';
import { UserCreatedEvent } from '@app/kafka';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    private jwtService: JwtService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async register(registerDto: RegisterDto) {
    // Age validation (18+)
    const dob = new Date(registerDto.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    if (age < MIN_AGE_YEARS) {
      throw new BadRequestException(`You must be at least ${MIN_AGE_YEARS} years old to register`);
    }

    // Check if user exists
    const existing = await this.userModel.findOne({
      $or: [{ email: registerDto.email }, { username: registerDto.username }],
    });

    if (existing) {
      throw new ConflictException('Email or Username already taken');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create User
    const user = new this.userModel({
      ...registerDto,
      passwordHash,
      tier: UserTier.NOVICE,
      role: UserRole.USER,
      reputationScore: 100,
      integrityWeight: 0.85,
      emailVerificationToken,
      emailVerified: false,
    });

    const savedUser = await user.save();

    // Create Wallet
    const wallet = new this.walletModel({
      userId: savedUser._id,
      balanceUsd: 0,
      balanceKsh: 0,
    });
    await wallet.save();

    // Emit Kafka Event
    this.kafkaClient.emit(
      'user.created',
      new UserCreatedEvent({
        userId: savedUser._id.toString(),
        email: savedUser.email,
        username: savedUser.username,
        tier: UserTier.NOVICE,
        verificationToken: emailVerificationToken,
      }),
    );

    return this.generateToken(savedUser);
  }

  async validateUser(email: string, pass: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async validateUserById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId);
  }

  async login(user: UserDocument) {
    // Check if user is banned
    if (user.isBanned) {
      throw new UnauthorizedException('Account has been suspended');
    }

    // Check 2FA requirement
    if (user.twoFactorEnabled) {
      return {
        requires_2fa: true,
        userId: user._id.toString(),
        message: 'Please provide your 2FA code to complete login',
      };
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    return this.generateToken(user);
  }

  // ─── Email Verification ────────────────────────────
  async verifyEmail(token: string) {
    const user = await this.userModel.findOne({ emailVerificationToken: token });
    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    return { success: true, message: 'Email verified successfully' };
  }

  // ─── Forgot Password ──────────────────────────────
  async forgotPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // Don't reveal whether the email exists
      return { success: true, message: 'If the email exists, a reset link has been sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 min
    await user.save();

    // Emit notification for password reset email
    this.kafkaClient.emit('notification.dispatch', {
      userId: user._id.toString(),
      type: 'password_reset',
      title: 'Password Reset Request',
      message: `Your password reset token: ${resetToken}`,
      channels: ['email'],
    });

    return { success: true, message: 'If the email exists, a reset link has been sent' };
  }

  // ─── Reset Password ───────────────────────────────
  async resetPassword(token: string, newPassword: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.userModel.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return { success: true, message: 'Password reset successfully' };
  }

  // ─── Token Generation ─────────────────────────────
  private generateToken(user: UserDocument) {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
      tier: user.tier,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        tier: user.tier,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    };
  }
}
