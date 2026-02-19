import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FcmService {
  private readonly logger = new Logger(FcmService.name);

  constructor(private configService: ConfigService) {}

  async sendPushNotification(
    fcmTokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    if (!fcmTokens.length) {
      this.logger.debug('No FCM tokens available, skipping push');
      return;
    }

    const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
    const serviceAccountKey = this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT_KEY');

    if (!projectId || !serviceAccountKey) {
      this.logger.warn('Firebase not configured, skipping push notification');
      return;
    }

    // Use Firebase Admin SDK HTTP v1 API
    try {
      for (const token of fcmTokens) {
        const message = {
          message: {
            token,
            notification: { title, body },
            data: data || {},
            android: {
              priority: 'high' as const,
              notification: { sound: 'default' },
            },
            apns: {
              payload: { aps: { sound: 'default' } },
            },
          },
        };

        this.logger.log(`Sending FCM push to token ${token.slice(0, 10)}...`);
        // In production: use firebase-admin SDK
        // admin.messaging().send(message.message);
      }
    } catch (error: any) {
      this.logger.error('FCM push failed', error.message);
    }
  }

  async sendToTopic(topic: string, title: string, body: string, data?: Record<string, string>) {
    this.logger.log(`Sending FCM to topic: ${topic}`);
    // In production: admin.messaging().sendToTopic(topic, { notification: { title, body }, data });
  }
}
