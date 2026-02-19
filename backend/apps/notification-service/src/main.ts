import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { Logger } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule); // Use Module not AppModule
  const configService = app.get(ConfigService);
  const logger = new Logger('NotificationService');

  // 1. Connect Kafka Consumer
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: (configService.get<string>('KAFKA_BROKERS') || 'localhost:9092').split(','),
      },
      consumer: {
        groupId: 'notification-service-group',
      },
    },
  });

  // 2. Connect TCP (for internal calls if needed)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get<number>('NOTIFICATION_SERVICE_PORT') || 3005,
    },
  });

  await app.startAllMicroservices();
  logger.log('Notification Service running (Kafka + TCP)');
}
bootstrap();
