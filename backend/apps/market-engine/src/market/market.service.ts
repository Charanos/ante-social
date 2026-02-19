import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Market, MarketDocument } from '@app/database';
import { CreateMarketDto, MarketStatus, KAFKA_TOPICS } from '@app/common';
import { ClientKafka } from '@nestjs/microservices';
import { MarketCreatedEvent, MarketClosedEvent } from '@app/kafka';
import { SettlementDispatcher } from '../settlement/settlement.dispatcher';

@Injectable()
export class MarketService {
  constructor(
    @InjectModel(Market.name) private marketModel: Model<MarketDocument>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly settlementDispatcher: SettlementDispatcher,
  ) {}

  async create(createMarketDto: CreateMarketDto, userId: string) {
    const market = new this.marketModel({
      ...createMarketDto,
      createdBy: new Types.ObjectId(userId),
      status: createMarketDto.scheduledPublishTime ? MarketStatus.SCHEDULED : MarketStatus.ACTIVE,
    });
    const saved = await market.save();

    // Emit Kafka event
    this.kafkaClient.emit(KAFKA_TOPICS.MARKET_EVENTS, new MarketCreatedEvent({
      marketId: saved._id.toString(),
      type: saved.betType,
      title: saved.title,
      category: saved.tags?.[0] || '',
      createdBy: userId,
      opensAt: saved.startTime?.toISOString() || new Date().toISOString(),
      closesAt: saved.closeTime?.toISOString() || '',
    }));

    return saved;
  }

  async findAll(query: any) {
    const { status, type, tag, limit = 20, offset = 0 } = query;
    const filter: any = {};
    if (status) filter.status = status;
    if (type) filter.betType = type;
    if (tag) filter.tags = tag;

    const markets = await this.marketModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .exec();
      
    const total = await this.marketModel.countDocuments(filter);
    
    return { data: markets, meta: { total, limit, offset } };
  }

  async findOne(id: string) {
    const market = await this.marketModel.findById(id);
    if (!market) throw new NotFoundException('Market not found');
    return market;
  }

  async closeMarket(id: string) {
    const market = await this.marketModel.findById(id);
    if (!market) throw new NotFoundException('Market not found');
    
    if (market.status !== MarketStatus.ACTIVE) {
      throw new BadRequestException('Market is not active');
    }

    market.status = MarketStatus.CLOSED;
    market.closeTime = new Date();
    const saved = await market.save();

    // Emit Kafka event
    this.kafkaClient.emit(KAFKA_TOPICS.MARKET_EVENTS, new MarketClosedEvent({
      marketId: saved._id.toString(),
      type: saved.betType,
      totalPool: saved.totalPool || 0,
      participantCount: saved.participantCount || 0,
      closedAt: saved.closeTime.toISOString(),
    }));

    return saved;
  }

  async settleMarket(id: string, winningOptionId?: string) {
    const market = await this.marketModel.findById(id);
    if (!market) throw new NotFoundException('Market not found');

    if (market.status !== MarketStatus.CLOSED) {
      throw new BadRequestException('Market must be closed before settlement');
    }

    market.status = MarketStatus.SETTLING;
    if (winningOptionId) {
      market.winningOutcomeId = new Types.ObjectId(winningOptionId);
    }
    await market.save();

    // Run settlement
    await this.settlementDispatcher.dispatch(market);

    market.status = MarketStatus.SETTLED;
    market.settlementTime = new Date();
    await market.save();

    return market;
  }
}
