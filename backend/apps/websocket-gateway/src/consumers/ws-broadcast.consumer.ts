import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { WsGateway } from '../ws.gateway';

@Controller()
export class WsBroadcastConsumer {
  private readonly logger = new Logger(WsBroadcastConsumer.name);

  constructor(private readonly wsGateway: WsGateway) {}

  // ─── Market Events ──────────────────────────────────
  @EventPattern('market.events')
  handleMarketEvent(@Payload() data: any) {
    const payload = data.payload || data;
    const eventType = payload.eventType || payload.type;
    this.logger.log(`WS broadcast: market event ${eventType}`);

    if (payload.marketId) {
      this.wsGateway.broadcastToRoom(`market:${payload.marketId}`, 'market_update', {
        type: eventType,
        ...payload,
      });
    }

    // Broadcast to global leaderboard room on settlement
    if (eventType === 'MARKET_SETTLED') {
      this.wsGateway.broadcastToRoom('leaderboard', 'leaderboard_update', {
        type: 'market_settled',
        marketId: payload.marketId,
        winnerCount: payload.winnerCount,
      });
    }
  }

  // ─── Bet Placement Events ("live feed") ─────────────
  @EventPattern('bet.placements')
  handleBetPlacement(@Payload() data: any) {
    const payload = data.payload || data;
    this.logger.log(`WS broadcast: bet placed on market ${payload.marketId}`);

    // Broadcast to market room for live odds updates
    if (payload.marketId) {
      this.wsGateway.broadcastToRoom(`market:${payload.marketId}`, 'bet_placed', {
        marketId: payload.marketId,
        amount: payload.amount,
        outcomeId: payload.outcomeId,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // ─── Wallet Transactions (user-specific) ────────────
  @EventPattern('wallet.transactions')
  handleWalletTransaction(@Payload() data: any) {
    const payload = data.payload || data;
    this.logger.log(`WS broadcast: wallet tx for user ${payload.userId}`);

    if (payload.userId) {
      this.wsGateway.broadcastToUser(payload.userId, 'wallet_update', {
        type: payload.type,
        amount: payload.amount,
        currency: payload.currency,
        status: payload.status,
        description: payload.description,
      });
    }
  }

  // ─── Notification Dispatch (user-specific) ──────────
  @EventPattern('notification.dispatch')
  handleNotification(@Payload() data: any) {
    const payload = data.payload || data;
    this.logger.log(`WS broadcast: notification for user ${payload.userId}`);

    if (payload.userId) {
      this.wsGateway.broadcastToUser(payload.userId, 'notification', {
        title: payload.title,
        message: payload.message,
        type: payload.type,
        actionUrl: payload.actionUrl,
      });
    }
  }
}
