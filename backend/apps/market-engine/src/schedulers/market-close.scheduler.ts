import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Market, MarketDocument } from '@app/database';
import { MarketStatus } from '@app/common';

@Injectable()
export class MarketCloseScheduler {
  private readonly logger = new Logger(MarketCloseScheduler.name);

  constructor(
    @InjectModel(Market.name) private marketModel: Model<MarketDocument>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkClosingMarkets() {
    const now = new Date();
    
    const result = await this.marketModel.updateMany(
      {
        status: MarketStatus.ACTIVE,
        closeTime: { $lte: now },
      },
      {
        $set: { status: MarketStatus.CLOSED }, // 'settling' might be better if we trigger settlement strictly
      }
    );

    if (result.modifiedCount > 0) {
      this.logger.log(`Closed ${result.modifiedCount} markets automatically.`);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async publishScheduledMarkets() {
    const now = new Date();
    
    const result = await this.marketModel.updateMany(
      {
        status: MarketStatus.SCHEDULED,
        scheduledPublishTime: { $lte: now },
      },
      {
        $set: { status: MarketStatus.ACTIVE },
      }
    );

    if (result.modifiedCount > 0) {
      this.logger.log(`Published ${result.modifiedCount} scheduled markets.`);
    }
  }
}
