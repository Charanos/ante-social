import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('WALLET_SERVICE_PORT') || 3004;
  const rpcPort =
    configService.get<number>('WALLET_RPC_PORT') || 4004;
  const logger = new Logger('WalletService');

  // Connect TCP Microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: rpcPort,
    },
  });

  // Start HTTP and Microservice
  await app.startAllMicroservices();
  await app.listen(port);
  logger.log(`Wallet Service running on HTTP ${port}, RPC ${rpcPort}`);
}
bootstrap();
