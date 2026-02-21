import { Module, Global } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaTopicBootstrapService } from './topic-bootstrap.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          const brokers = (config.get<string>('KAFKA_BROKERS') || 'localhost:9092')
            .split(',')
            .map((broker) => broker.trim())
            .filter(Boolean);
          const serviceName = config.get<string>('SERVICE_NAME') || 'backend';
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: config.get<string>('KAFKA_CLIENT_ID') || `ante-social-${serviceName}`,
                brokers,
              },
              consumer: {
                groupId:
                  config.get<string>('KAFKA_CONSUMER_GROUP') ||
                  `ante-social-${serviceName}-consumer`,
                sessionTimeout: Number(config.get<string>('KAFKA_SESSION_TIMEOUT_MS') || 30000),
                heartbeatInterval: Number(
                  config.get<string>('KAFKA_HEARTBEAT_INTERVAL_MS') || 3000,
                ),
              },
            },
          };
        },
      },
    ]),
  ],
  providers: [KafkaTopicBootstrapService],
  exports: [ClientsModule],
})
export class KafkaModule {}
