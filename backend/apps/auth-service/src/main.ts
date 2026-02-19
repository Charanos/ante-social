import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { GlobalExceptionFilter } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('AUTH_SERVICE_PORT') || 3002;
  const logger = new Logger('AuthService');

  // Connect Microservice (TCP)
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: port,
    },
  });

  // Global Pipes & Filters for HTTP
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.startAllMicroservices();
  await app.listen(port);
  logger.log(`Auth Service running on port ${port}`);
}
bootstrap();
