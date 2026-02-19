import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { DatabaseModule } from '@app/database';
import { KafkaModule } from '@app/kafka';
import { DarajaService } from '../payment-providers/daraja/daraja.service';
import { DarajaController } from '../payment-providers/daraja/daraja.controller';
import { NowPaymentsService } from '../payment-providers/nowpayments/nowpayments.service';
import { NowPaymentsController } from '../payment-providers/nowpayments/nowpayments.controller';

@Module({
  imports: [DatabaseModule, KafkaModule],
  controllers: [WalletController, DarajaController, NowPaymentsController],
  providers: [WalletService, DarajaService, NowPaymentsService],
  exports: [WalletService],
})
export class WalletModule {}
