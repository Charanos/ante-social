import { Injectable, BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ClientProxy, ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { 
  Market, MarketDocument, 
  MarketBet, MarketBetDocument 
} from '@app/database';
import { MarketStatus, PlacePredictionDto, KAFKA_TOPICS } from '@app/common';
import { BetPlacedEvent, BetEditedEvent, BetCancelledEvent } from '@app/kafka';

@Injectable()
export class PredictionService {
  constructor(
    @InjectModel(Market.name) private marketModel: Model<MarketDocument>,
    @InjectModel(MarketBet.name) private betModel: Model<MarketBetDocument>,
    @Inject('WALLET_SERVICE') private walletClient: ClientProxy,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  async placePrediction(userId: string, dto: PlacePredictionDto) {
    // 1. Validate Market
    const market = await this.marketModel.findById(dto.marketId);
    if (!market) throw new NotFoundException('Market not found');
    
    if (market.status !== MarketStatus.ACTIVE) {
      throw new BadRequestException('Market is not active');
    }
    
    if (new Date() > market.closeTime) {
      throw new BadRequestException('Market is closed');
    }

    // 2. Debit Wallet (Synchronous TCP call)
    try {
      const debitResult = await lastValueFrom(
        this.walletClient.send('debit_balance', {
          userId,
          amount: dto.amount,
          currency: 'USD',
          description: `Bet on ${market.title}`,
          type: 'bet_placed'
        })
      );
      
      if (!debitResult.success) {
        throw new BadRequestException('Wallet debit failed');
      }
    } catch (e: any) {
      throw new BadRequestException(e.message || 'Insufficient funds');
    }

    // 3. Create Bet
    const bet = new this.betModel({
      marketId: new Types.ObjectId(dto.marketId),
      userId: new Types.ObjectId(userId),
      selectedOutcomeId: new Types.ObjectId(dto.outcomeId),
      amountContributed: dto.amount,
      editableUntil: new Date(Date.now() + 5 * 60 * 1000), // 5 min 
    });
    await bet.save();

    // 4. Update Market Stats
    await this.marketModel.findByIdAndUpdate(dto.marketId, {
      $inc: { 
        totalPool: dto.amount,
        participantCount: 1,
        'outcomes.$[elem].totalAmount': dto.amount,
        'outcomes.$[elem].participantCount': 1
      }
    }, {
      arrayFilters: [{ 'elem._id': new Types.ObjectId(dto.outcomeId) }]
    });

    // 5. Emit Event
    this.kafkaClient.emit(
      KAFKA_TOPICS.BET_PLACEMENTS,
      new BetPlacedEvent({
        betId: bet._id.toString(),
        marketId: dto.marketId,
        userId,
        amount: dto.amount,
        outcomeId: dto.outcomeId,
      }),
    );

    return bet;
  }

  // ─── Edit Prediction (5-min window) ────────────────
  async editPrediction(userId: string, predictionId: string, newOutcomeId: string) {
    const bet = await this.betModel.findById(predictionId);
    if (!bet) throw new NotFoundException('Prediction not found');
    
    if (bet.userId.toString() !== userId) {
      throw new BadRequestException('Not your prediction');
    }

    if (!bet.editableUntil || new Date() > bet.editableUntil) {
      throw new BadRequestException('Edit window has expired (5 minutes)');
    }

    const previousOptionId = bet.selectedOutcomeId.toString();
    bet.selectedOutcomeId = new Types.ObjectId(newOutcomeId);
    await bet.save();

    // Update market outcome stats (decrement old, increment new)
    const market = await this.marketModel.findById(bet.marketId);
    if (market) {
      await this.marketModel.findByIdAndUpdate(bet.marketId, {
        $inc: {
          'outcomes.$[old].totalAmount': -bet.amountContributed,
          'outcomes.$[old].participantCount': -1,
          'outcomes.$[new].totalAmount': bet.amountContributed,
          'outcomes.$[new].participantCount': 1,
        }
      }, {
        arrayFilters: [
          { 'old._id': new Types.ObjectId(previousOptionId) },
          { 'new._id': new Types.ObjectId(newOutcomeId) },
        ]
      });
    }

    this.kafkaClient.emit(KAFKA_TOPICS.BET_PLACEMENTS, new BetEditedEvent({
      betId: predictionId,
      marketId: bet.marketId.toString(),
      userId,
      previousOptionId,
      newOptionId: newOutcomeId,
      stake: bet.amountContributed,
      currency: 'USD',
      editedAt: new Date().toISOString(),
    }));

    return bet;
  }

  // ─── Cancel Prediction (5-min window) ──────────────
  async cancelPrediction(userId: string, predictionId: string) {
    const bet = await this.betModel.findById(predictionId);
    if (!bet) throw new NotFoundException('Prediction not found');
    
    if (bet.userId.toString() !== userId) {
      throw new BadRequestException('Not your prediction');
    }

    if (!bet.editableUntil || new Date() > bet.editableUntil) {
      throw new BadRequestException('Cancel window has expired (5 minutes)');
    }

    // Refund wallet
    try {
      await lastValueFrom(
        this.walletClient.send('credit_balance', {
          userId,
          amount: bet.amountContributed,
          currency: 'USD',
          description: 'Prediction cancelled - refund',
          type: 'refund',
        })
      );
    } catch (e: any) {
      throw new BadRequestException('Failed to process refund');
    }

    // Update market stats
    await this.marketModel.findByIdAndUpdate(bet.marketId, {
      $inc: {
        totalPool: -bet.amountContributed,
        participantCount: -1,
        'outcomes.$[elem].totalAmount': -bet.amountContributed,
        'outcomes.$[elem].participantCount': -1,
      }
    }, {
      arrayFilters: [{ 'elem._id': bet.selectedOutcomeId }]
    });

    // Mark bet as cancelled
    bet.isCancelled = true;
    await bet.save();

    this.kafkaClient.emit(KAFKA_TOPICS.BET_PLACEMENTS, new BetCancelledEvent({
      betId: predictionId,
      marketId: bet.marketId.toString(),
      userId,
      refundAmount: bet.amountContributed,
      currency: 'USD',
      cancelledAt: new Date().toISOString(),
    }));

    return { success: true, refundAmount: bet.amountContributed };
  }
}
