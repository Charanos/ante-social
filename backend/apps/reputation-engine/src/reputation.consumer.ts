import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReputationService } from './reputation.service';

@Controller()
export class ReputationConsumer {
  private readonly logger = new Logger(ReputationConsumer.name);

  constructor(private readonly reputationService: ReputationService) {}

  @EventPattern('market.events')
  async handleMarketSettled(@Payload() data: any) {
    const payload = data.payload || data;
    
    if (payload.eventType === 'MARKET_SETTLED' || data.type === 'MARKET_SETTLED') {
      this.logger.log(`Market settled: ${payload.marketId}. Recalculating participant scores.`);
      // In production: look up all bets for this market and recalculate scores
    }
  }

  @EventPattern('bet.placements')
  async handleBetPlaced(@Payload() data: any) {
    const payload = data.payload || data;
    const userId = payload.userId;

    if (userId) {
      this.logger.log(`Bet placed by ${userId}. Updating integrity weight.`);
      await this.reputationService.calculateIntegrityWeight(userId);
    }
  }

  @EventPattern('user.created')
  async handleUserCreated(@Payload() data: any) {
    const payload = data.payload || data;
    this.logger.log(`New user ${payload.userId}. Setting cold-start reputation.`);
    // Cold start score is already set in AuthService (100, integrityWeight: 0.85)
  }
}
