import { NestFactory } from '@nestjs/core';
import { ReputationModule } from './reputation.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('ReputationEngine');
  const port = parseInt(process.env.PORT || '3008', 10);

  const app = await NestFactory.create(ReputationModule);

  // Kafka microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'reputation-engine',
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: 'reputation-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
  logger.log(`Reputation Engine running on port ${port}`);
}
bootstrap();
