import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('MARKET_ENGINE_PORT') || 3003;
  const rpcPort =
    configService.get<number>('MARKET_ENGINE_RPC_PORT') || 4003;
  const logger = new Logger('MarketEngine');

  // Connect TCP Microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: rpcPort,
    },
  });

  // Global Pipes & Filters
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.startAllMicroservices();
  await app.listen(port);
  logger.log(`Market Engine running on HTTP ${port}, RPC ${rpcPort}`);
}
bootstrap();
