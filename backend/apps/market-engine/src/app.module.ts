import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { ScheduleModule } from '@nestjs/schedule'; // For cron jobs
import { MarketModule } from './market/market.module';
import { GroupModule } from './group/group.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    MarketModule,
    GroupModule,
  ],
})
export class AppModule {}
