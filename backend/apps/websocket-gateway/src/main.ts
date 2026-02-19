import { NestFactory } from '@nestjs/core';
import { WsModule } from './ws.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisIoAdapter } from './redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(WsModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('WEBSOCKET_GATEWAY_PORT') || 3006;
  const logger = new Logger('WebSocketGateway');

  // Redis adapter is optional in local development.
  const redisIoAdapter = new RedisIoAdapter(app);
  try {
    await redisIoAdapter.connectToRedis();
    app.useWebSocketAdapter(redisIoAdapter);
    logger.log('Redis adapter connected');
  } catch {
    logger.warn('Redis unavailable. Falling back to in-memory socket adapter.');
  }

  await app.listen(port);
  logger.log(`WebSocket Gateway running on port ${port}`);
}
bootstrap();
