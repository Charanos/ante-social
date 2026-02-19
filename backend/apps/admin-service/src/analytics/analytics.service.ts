import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
  Market,
  MarketDocument,
  Transaction,
  TransactionDocument,
} from '@app/database';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Market.name) private marketModel: Model<MarketDocument>,
    @InjectModel(Transaction.name) private txModel: Model<TransactionDocument>,
  ) {}

  async getDashboardStats() {
    const [
      totalUsers,
      activeMarkets,
      flaggedMarkets,
      pendingSettlements,
      pendingWithdrawals,
      totalVolumeAgg,
      totalRevenueAgg,
      pendingPayouts,
      participantsAgg,
    ] = await Promise.all([
      this.userModel.countDocuments(),
      this.marketModel.countDocuments({ status: 'active', isDeleted: { $ne: true } }),
      this.marketModel.countDocuments({ isFlagged: true, isDeleted: { $ne: true } }),
      this.marketModel.countDocuments({
        status: { $in: ['closed', 'settling'] },
        isDeleted: { $ne: true },
      }),
      this.txModel.countDocuments({ type: 'withdrawal', status: 'pending' }),
      this.txModel
        .aggregate([{ $match: { type: 'bet_placed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }])
        .then((res) => res[0]?.total || 0),
      this.txModel
        .aggregate([{ $match: { type: 'platform_fee' } }, { $group: { _id: null, total: { $sum: '$amount' } } }])
        .then((res) => res[0]?.total || 0),
      this.txModel.countDocuments({ type: 'bet_payout', status: { $in: ['pending', 'processing'] } }),
      this.marketModel
        .aggregate([
          { $match: { isDeleted: { $ne: true } } },
          { $group: { _id: null, total: { $sum: '$participantCount' } } },
        ])
        .then((res) => res[0]?.total || 0),
    ]);

    return {
      totalUsers,
      activeMarkets,
      totalVolume: totalVolumeAgg,
      totalRevenue: totalRevenueAgg,
      participants: participantsAgg,
      pendingPayouts,
      pendingSettlements,
      pendingWithdrawals,
      flaggedMarkets,
    };
  }
}
