import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('ApiGateway');
  
  // Security & Performance
  app.use(helmet());
  app.use(compression());
  
  // Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.API_GATEWAY_PORT || 3001;
  await app.listen(port);
  logger.log(`API Gateway running on port ${port}`);
}
bootstrap();
