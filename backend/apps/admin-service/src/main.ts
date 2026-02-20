import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('ADMIN_SERVICE_PORT') || 3007;
  const rpcPort =
    configService.get<number>('ADMIN_SERVICE_RPC_PORT') || 4007;
  const logger = new Logger('AdminService');

  // TCP Microservice for internal calls
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: rpcPort,
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
  logger.log(`Admin Service running on HTTP ${port}, RPC ${rpcPort}`);
}
bootstrap();
