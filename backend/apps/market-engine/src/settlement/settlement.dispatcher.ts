import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ClientProxy, ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MarketDocument, MarketBet, MarketBetDocument } from '@app/database';
import { MarketType, MarketStatus, PLATFORM_FEE_RATE, REFLEX_MULTIPLIER_TIERS, KAFKA_TOPICS } from '@app/common';
import { MarketSettledEvent } from '@app/kafka';

@Injectable()
export class SettlementDispatcher {
  private readonly logger = new Logger(SettlementDispatcher.name);

  constructor(
    @InjectModel(MarketBet.name) private betModel: Model<MarketBetDocument>,
    @Inject('WALLET_SERVICE') private walletClient: ClientProxy,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  async dispatch(market: MarketDocument) {
    this.logger.log(`Dispatching settlement for market ${market._id} (${market.betType})`);
    
    switch (market.betType) {
      case MarketType.CONSENSUS:
        return this.handleConsensus(market);
      case MarketType.REFLEX:
        return this.handleReflex(market);
      case MarketType.LADDER:
        return this.handleLadder(market);
      case MarketType.PRISONER_DILEMMA:
        return this.handlePrisonerDilemma(market);
      default:
        this.logger.warn(`No handler for market type ${market.betType}`);
    }
  }

  // ─── Consensus ("The Crowd's Call") ─────────────────
  private async handleConsensus(market: MarketDocument) {
    const bets = await this.betModel.find({ marketId: market._id }).exec();
    if (bets.length === 0) return;

    const winningOutcomeId = market.winningOutcomeId;
    if (!winningOutcomeId) {
      this.logger.warn(`No winning outcome set for Consensus market ${market._id}`);
      return;
    }

    const totalPool = bets.reduce((sum, b) => sum + b.amountContributed, 0);
    const platformFee = totalPool * PLATFORM_FEE_RATE;
    const prizePool = totalPool - platformFee;

    const winners = bets.filter(b => b.selectedOutcomeId.toString() === winningOutcomeId.toString());
    const losers = bets.filter(b => b.selectedOutcomeId.toString() !== winningOutcomeId.toString());
    const winnerPool = winners.reduce((sum, b) => sum + b.amountContributed, 0);

    for (const winner of winners) {
      const share = (winner.amountContributed / winnerPool) * prizePool;
      winner.actualPayout = share;
      winner.isWinner = true;
      winner.payoutProcessed = true;
      await winner.save();
      await this.creditWinner(winner.userId.toString(), share, market.title);
    }

    for (const loser of losers) {
      loser.actualPayout = 0;
      loser.isWinner = false;
      loser.payoutProcessed = true;
      await loser.save();
    }

    this.emitSettledEvent(market, prizePool, platformFee, winners.length);
  }

  // ─── Reflex ("Against The Grain") ───────────────────
  private async handleReflex(market: MarketDocument) {
    const bets = await this.betModel.find({ marketId: market._id }).exec();
    if (bets.length === 0) return;

    const totalPool = bets.reduce((sum, b) => sum + b.amountContributed, 0);
    const platformFee = totalPool * PLATFORM_FEE_RATE;
    const prizePool = totalPool - platformFee;

    const outcomeGroups: Record<string, typeof bets> = {};
    for (const bet of bets) {
      const key = bet.selectedOutcomeId.toString();
      if (!outcomeGroups[key]) outcomeGroups[key] = [];
      outcomeGroups[key].push(bet);
    }

    const groups = Object.entries(outcomeGroups).sort((a, b) => a[1].length - b[1].length);
    const minorityKey = groups[0][0];
    const minorityBets = groups[0][1];
    const minorityPct = (minorityBets.length / bets.length) * 100;

    const tier = REFLEX_MULTIPLIER_TIERS.find(t => minorityPct <= t.maxPct);
    const multiplier = tier?.multiplier || 1.0;

    for (const winner of minorityBets) {
      const payout = winner.amountContributed * multiplier;
      winner.actualPayout = payout;
      winner.isWinner = true;
      winner.payoutProcessed = true;
      await winner.save();
      await this.creditWinner(winner.userId.toString(), payout, market.title);
    }

    const majorityBets = bets.filter(b => b.selectedOutcomeId.toString() !== minorityKey);
    for (const loser of majorityBets) {
      loser.actualPayout = 0;
      loser.isWinner = false;
      loser.payoutProcessed = true;
      await loser.save();
    }

    this.emitSettledEvent(market, prizePool, platformFee, minorityBets.length);
  }

  // ─── Ladder ("Conviction Climb") ────────────────────
  private async handleLadder(market: MarketDocument) {
    const bets = await this.betModel.find({ marketId: market._id }).exec();
    if (bets.length === 0) return;

    const winningOutcomeId = market.winningOutcomeId;
    if (!winningOutcomeId) return;

    const totalPool = bets.reduce((sum, b) => sum + b.amountContributed, 0);
    const platformFee = totalPool * PLATFORM_FEE_RATE;
    const prizePool = totalPool - platformFee;

    const winners = bets.filter(b => b.selectedOutcomeId.toString() === winningOutcomeId.toString());
    const losers = bets.filter(b => b.selectedOutcomeId.toString() !== winningOutcomeId.toString());

    winners.sort((a, b) => b.amountContributed - a.amountContributed);

    const ladderMultipliers = [1.5, 1.3, 1.1, 1.0];
    const winnerTotalStake = winners.reduce((s, w) => s + w.amountContributed, 0);
    
    for (let i = 0; i < winners.length; i++) {
      const percentile = i / winners.length;
      const multiplierIdx = Math.min(Math.floor(percentile * ladderMultipliers.length), ladderMultipliers.length - 1);
      const multiplier = ladderMultipliers[multiplierIdx];
      
      const basePayout = (winners[i].amountContributed / winnerTotalStake) * prizePool;
      const payout = basePayout * multiplier;

      winners[i].actualPayout = payout;
      winners[i].isWinner = true;
      winners[i].payoutProcessed = true;
      await winners[i].save();
      await this.creditWinner(winners[i].userId.toString(), payout, market.title);
    }

    for (const loser of losers) {
      loser.actualPayout = 0;
      loser.isWinner = false;
      loser.payoutProcessed = true;
      await loser.save();
    }

    this.emitSettledEvent(market, prizePool, platformFee, winners.length);
  }

  // ─── Prisoner's Dilemma ("Trust or Betray") ────────
  private async handlePrisonerDilemma(market: MarketDocument) {
    const bets = await this.betModel.find({ marketId: market._id }).exec();
    if (bets.length === 0) return;

    const totalPool = bets.reduce((sum, b) => sum + b.amountContributed, 0);
    const platformFee = totalPool * PLATFORM_FEE_RATE;
    const prizePool = totalPool - platformFee;

    const outcomes = market.outcomes || [];
    const cooperateId = (outcomes[0] as any)?._id?.toString();
    const defectId = (outcomes[1] as any)?._id?.toString();

    const cooperators = bets.filter(b => b.selectedOutcomeId.toString() === cooperateId);
    const defectors = bets.filter(b => b.selectedOutcomeId.toString() === defectId);

    if (defectors.length === 0) {
      const bonus = prizePool / cooperators.length;
      for (const coop of cooperators) {
        coop.actualPayout = coop.amountContributed + bonus * 0.1;
        coop.isWinner = true;
        coop.payoutProcessed = true;
        await coop.save();
        await this.creditWinner(coop.userId.toString(), coop.actualPayout, market.title);
      }
    } else if (cooperators.length === 0) {
      const returnRate = 0.7;
      for (const def of defectors) {
        const payout = def.amountContributed * returnRate;
        def.actualPayout = payout;
        def.isWinner = false;
        def.payoutProcessed = true;
        await def.save();
        await this.creditWinner(def.userId.toString(), payout, market.title);
      }
    } else {
      const defectorPayout = prizePool * 0.7 / defectors.length;
      const cooperatorPayout = prizePool * 0.3 / cooperators.length;

      for (const def of defectors) {
        def.actualPayout = defectorPayout;
        def.isWinner = true;
        def.payoutProcessed = true;
        await def.save();
        await this.creditWinner(def.userId.toString(), defectorPayout, market.title);
      }

      for (const coop of cooperators) {
        coop.actualPayout = cooperatorPayout;
        coop.isWinner = cooperatorPayout > coop.amountContributed;
        coop.payoutProcessed = true;
        await coop.save();
        await this.creditWinner(coop.userId.toString(), cooperatorPayout, market.title);
      }
    }

    this.emitSettledEvent(market, prizePool, platformFee, bets.length);
  }

  // ─── Helpers ────────────────────────────────────────
  private async creditWinner(userId: string, amount: number, marketTitle: string) {
    try {
      await lastValueFrom(
        this.walletClient.send('credit_balance', {
          userId,
          amount,
          currency: 'USD',
          description: `Payout from: ${marketTitle}`,
          type: 'bet_payout',
        })
      );
    } catch (e: any) {
      this.logger.error(`Failed to credit winner ${userId}: ${e.message}`);
    }
  }

  private emitSettledEvent(market: MarketDocument, prizePool: number, platformFee: number, winnerCount: number) {
    this.kafkaClient.emit(KAFKA_TOPICS.MARKET_EVENTS, new MarketSettledEvent({
      marketId: market._id.toString(),
      type: market.betType,
      winningOptionId: market.winningOutcomeId?.toString(),
      totalPool: market.totalPool || 0,
      platformFee,
      prizePool,
      winnerCount,
      settledAt: new Date().toISOString(),
    }));
  }
}
