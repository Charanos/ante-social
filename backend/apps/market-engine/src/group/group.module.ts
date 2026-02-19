import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { DatabaseModule, Group, GroupSchema, GroupBet, GroupBetSchema, User, UserSchema } from '@app/database';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: GroupBet.name, schema: GroupBetSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ClientsModule.registerAsync([
      {
        name: 'WALLET_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('WALLET_SERVICE_HOST'),
            port: configService.get('WALLET_SERVICE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'KAFKA_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'group-service',
              brokers: [configService.get('KAFKA_BROKER') || 'localhost:9092'],
            },
            consumer: {
              groupId: 'group-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
