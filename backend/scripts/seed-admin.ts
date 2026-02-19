import { NestFactory } from '@nestjs/core';
import { AppModule } from '../apps/auth-service/src/app.module'; // Import Auth Service Module to access DB
import { User, UserSchema } from '../libs/database/src/schemas/user.schema';
import { Wallet, WalletSchema } from '../libs/database/src/schemas/wallet.schema';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { UserRole, UserTier } from '../libs/common/src/constants';

// Load env from root ante-social folder
dotenv.config({ path: '../.env' });

async function seedAdmin() {
  // Direct Mongoose Connection to avoid robust NestJS app bootstrap overhead
  const mongoose = await import('mongoose');
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in .env');
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.DATABASE_URL);

  const UserModel = mongoose.model('User', UserSchema);
  const WalletModel = mongoose.model('Wallet', WalletSchema);

  const adminData = {
    fullName: 'Dennis Munge',
    username: 'Charanos',
    email: 'dennismunge@960gmail.com',
    phone: '074885157',
    dateOfBirth: new Date('1999-10-10'),
    password: 'Password123!', // Temporary password
    role: 'admin',
    tier: 'high_roller',
    emailVerified: true,
    isVerified: true, // KYC verified
    reputationScore: 1000,
    integrityWeight: 1.0,
  };

  try {
    const existing = await UserModel.findOne({
      $or: [{ email: adminData.email }, { username: adminData.username }],
    });

    if (existing) {
      console.log(`User ${existing.username} already exists. Updating role to admin...`);
      existing.role = 'admin';
      existing.fullName = adminData.fullName;
      existing.phone = adminData.phone;
      existing.isVerified = true;
      existing.emailVerified = true;
      await existing.save();
      console.log('Admin user updated successfully.');
    } else {
      console.log('Creating new admin user...');
      const passwordHash = await bcrypt.hash(adminData.password, 12);
      
      const user = new UserModel({
        ...adminData,
        passwordHash,
      });
      const savedUser = await user.save();
      
      // Create Wallet
      const wallet = new WalletModel({
        userId: savedUser._id,
        balanceUsd: 10000, // Seed with some funds
        balanceKsh: 100000,
      });
      await wallet.save();

      console.log('Admin user created successfully.');
      console.log('Credentials:', {
        email: adminData.email,
        password: adminData.password,
      });
    }

  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
    process.exit(0);
  }
}

seedAdmin();
