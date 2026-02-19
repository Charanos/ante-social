import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { NotificationConsumer } from './consumers/notification.consumer';
import { NotificationController } from './notification.controller';
import { EmailService } from './channels/email.service';
import { InAppService } from './channels/in-app.service';
import { FcmService } from './channels/fcm.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
  ],
  controllers: [NotificationConsumer, NotificationController],
  providers: [EmailService, InAppService, FcmService],
})
export class NotificationModule {}
