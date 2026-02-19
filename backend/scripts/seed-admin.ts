import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { UserSchema } from '../libs/database/src/schemas/user.schema';
import { WalletSchema } from '../libs/database/src/schemas/wallet.schema';

dotenv.config({ path: '../.env' });

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;

async function seedAdmin() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI (or DATABASE_URL) is not defined in .env');
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);

  const UserModel = mongoose.model('User', UserSchema);
  const WalletModel = mongoose.model('Wallet', WalletSchema);

  const adminData = {
    fullName: 'Platform Administrator',
    username: process.env.SEED_ADMIN_USERNAME || 'admin',
    email: process.env.SEED_ADMIN_EMAIL || 'admin@antesocial.local',
    phone: process.env.SEED_ADMIN_PHONE || '+10000000000',
    dateOfBirth: new Date('1990-01-01'),
    password: process.env.SEED_ADMIN_PASSWORD || 'Password123!',
    role: 'admin',
    tier: 'high_roller',
    emailVerified: true,
    isVerified: true,
    reputationScore: 1000,
    integrityWeight: 1.0,
  };

  try {
    const existing = await UserModel.findOne({
      $or: [{ email: adminData.email }, { username: adminData.username }],
    });

    if (existing) {
      console.log(`User ${existing.username} already exists. Promoting to admin...`);
      existing.role = 'admin';
      existing.fullName = adminData.fullName;
      existing.phone = adminData.phone;
      existing.tier = 'high_roller';
      existing.isVerified = true;
      existing.emailVerified = true;
      await existing.save();

      const wallet = await WalletModel.findOne({ userId: existing._id });
      if (!wallet) {
        await WalletModel.create({
          userId: existing._id,
          balanceUsd: 10000,
          balanceKsh: 1000000,
        });
      }
      console.log('Admin user updated successfully.');
    } else {
      console.log('Creating new admin user...');
      const passwordHash = await bcrypt.hash(adminData.password, 12);

      const user = await UserModel.create({
        ...adminData,
        passwordHash,
      });

      await WalletModel.create({
        userId: user._id,
        balanceUsd: 10000,
        balanceKsh: 1000000,
      });

      console.log('Admin user created successfully.');
      console.log('Credentials:', {
        email: adminData.email,
        password: adminData.password,
      });
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
