import { NestFactory } from '@nestjs/core';
import { ReputationModule } from './reputation.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('ReputationEngine');
  const port = parseInt(process.env.REPUTATION_ENGINE_PORT || process.env.PORT || '3008', 10);
  const kafkaBrokers =
    process.env.KAFKA_BROKERS?.split(',').map((broker) => broker.trim()).filter(Boolean) ||
    [process.env.KAFKA_BROKER || 'localhost:9092'];
  const enableKafkaConsumer =
    process.env.ENABLE_REPUTATION_KAFKA !== undefined
      ? process.env.ENABLE_REPUTATION_KAFKA === 'true'
      : process.env.NODE_ENV === 'production';

  const app = await NestFactory.create(ReputationModule);

  if (enableKafkaConsumer) {
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'reputation-engine',
          brokers: kafkaBrokers,
        },
        consumer: {
          groupId: 'reputation-consumer',
        },
      },
    });

    await app.startAllMicroservices();
  } else {
    logger.warn('Kafka consumer disabled for local development (ENABLE_REPUTATION_KAFKA=false).');
  }

  await app.listen(port);
  logger.log(`Reputation Engine running on port ${port}`);
}
bootstrap();
