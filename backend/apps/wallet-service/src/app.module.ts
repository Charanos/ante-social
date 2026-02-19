import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { WalletModule } from './wallet/wallet.module';
import { DarajaModule } from './payment-providers/daraja/daraja.module';
// import { NowPaymentsModule } from './payment-providers/crypto/nowpayments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    WalletModule,
    DarajaModule,
  ],
})
export class AppModule {}
