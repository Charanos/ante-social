import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, Market, MarketDocument, Transaction, TransactionDocument } from '@app/database';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Market.name) private marketModel: Model<MarketDocument>,
    @InjectModel(Transaction.name) private txModel: Model<TransactionDocument>,
  ) {}

  async getDashboardStats() {
    const [totalUsers, activeMarkets, totalVolume] = await Promise.all([
      this.userModel.countDocuments(),
      this.marketModel.countDocuments({ status: 'active' }),
      this.txModel.aggregate([
        { $match: { type: 'bet_placed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).then(res => res[0]?.total || 0)
    ]);

    return { totalUsers, activeMarkets, totalVolume };
  }
}
