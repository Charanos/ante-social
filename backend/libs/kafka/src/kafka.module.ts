import { Module, Global } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: config.get<string>('KAFKA_CLIENT_ID'),
              brokers: (config.get<string>('KAFKA_BROKERS') || 'localhost:9092').split(','),
            },
            consumer: {
              groupId: 'ante-social-backend-consumer',
            },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
