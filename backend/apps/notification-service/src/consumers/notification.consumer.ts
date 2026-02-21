import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailService } from '../channels/email.service';
import { InAppService } from '../channels/in-app.service';
import { FcmService } from '../channels/fcm.service';
import { User, UserDocument } from '@app/database';
import { UserCreatedEvent, BetPlacedEvent, MarketSettledEvent, WalletTransactionEvent, NotificationDispatchEvent } from '@app/kafka';

@Controller()
export class NotificationConsumer {
  private readonly logger = new Logger(NotificationConsumer.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
    private readonly inAppService: InAppService,
    private readonly fcmService: FcmService,
  ) {}

  @EventPattern('user.created')
  async handleUserCreated(@Payload() data: UserCreatedEvent) {
    this.logger.log(`Processing user.created for ${data.payload.userId}`);
    
    await this.emailService.sendWelcomeEmail(data.payload.email, data.payload.username);

    await this.inAppService.create(
      data.payload.userId,
      'Welcome!',
      'Thanks for joining Ante Social. Complete your profile to earn reputation.',
      'welcome'
    );
  }

  @EventPattern('bet.placed')
  async handleBetPlaced(@Payload() data: any) {
    this.logger.log(`Processing bet.placed for ${data.userId || data.payload?.userId}`);
    const userId = data.userId || data.payload?.userId;
    const amount = data.amount || data.payload?.amount;
    
    await this.inAppService.create(
      userId,
      'Prediction Placed',
      `You placed a prediction of $${amount}`,
      'bet_placed'
    );
  }

  @EventPattern('market.events')
  async handleMarketEvent(@Payload() data: any) {
    const eventType = data.eventType || data.type;
    this.logger.log(`Processing market event: ${eventType}`);

    if (eventType === 'MARKET_SETTLED') {
      // Notify all participants of settlement
      this.logger.log(`Market ${data.payload?.marketId} settled`);
    }
  }

  @EventPattern('wallet.transactions')
  async handleWalletTransaction(@Payload() data: any) {
    const payload = data.payload || data;
    this.logger.log(`Processing wallet transaction for ${payload.userId}`);

    if (payload.type === 'deposit' && payload.status === 'completed') {
      await this.inAppService.create(
        payload.userId,
        'Deposit Confirmed',
        `Your deposit of ${payload.currency} ${payload.amount} has been confirmed.`,
        'deposit_confirmed'
      );
    } else if (payload.type === 'withdrawal' && payload.status === 'completed') {
      await this.inAppService.create(
        payload.userId,
        'Withdrawal Processed',
        `Your withdrawal of ${payload.currency} ${payload.amount} has been processed.`,
        'withdrawal_processed'
      );
    }
  }

  @EventPattern('notification.dispatch')
  async handleDispatch(@Payload() data: any) {
    const payload = data.payload || data;
    this.logger.log(`Processing notification dispatch for ${payload.userId}`);

    const channels: string[] = payload.channels || ['in_app'];
    const user = payload.userId
      ? await this.userModel
          .findById(payload.userId)
          .select('email notificationEmail notificationPush fcmTokens')
          .lean()
          .exec()
      : null;

    if (channels.includes('in_app')) {
      await this.inAppService.create(
        payload.userId,
        payload.title,
        payload.message,
        payload.type || 'system'
      );
    }

    if (channels.includes('email') && payload.email && user?.notificationEmail !== false) {
      await this.emailService.sendNotificationEmail(
        payload.email,
        payload.title || 'Notification',
        payload.message || '',
      );
    }

    if (channels.includes('push') && user?.notificationPush !== false) {
      // Route to FCM
      await this.fcmService.sendPushNotification(
        (user?.fcmTokens || []) as string[],
        payload.title,
        payload.message,
        { type: payload.type, actionUrl: payload.actionUrl || '' }
      );
    }
  }
}
