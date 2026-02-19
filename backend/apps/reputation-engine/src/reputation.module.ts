import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { ReputationService } from './reputation.service';
import { DecayScheduler } from './decay.scheduler';
import { ReputationConsumer } from './reputation.consumer';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
  ],
  controllers: [ReputationConsumer],
  providers: [ReputationService, DecayScheduler],
})
export class ReputationModule {}
