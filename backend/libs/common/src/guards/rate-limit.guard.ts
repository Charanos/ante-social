import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RATE_LIMIT_KEY, RateLimitOptions } from '../decorators/rate-limit.decorator';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { RATE_LIMITS } from '../constants';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name);
  private redis: Redis;

  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    // Initialize Redis client for rate limiting with URL-first config.
    const redisUrl =
      this.configService.get<string>('REDIS_URL') ||
      this.configService.get<string>('REDIS_URI');

    if (redisUrl) {
      this.redis = new Redis(redisUrl, {
        lazyConnect: true,
      });
      return;
    }

    const redisHost = this.configService.get<string>('REDIS_HOST') || 'localhost';
    const redisPort = this.configService.get<number>('REDIS_PORT') || 6379;
    const redisUsername = this.configService.get<string>('REDIS_USERNAME');
    const redisPassword = this.configService.get<string>('REDIS_PASSWORD');
    const redisTls = this.configService.get<string>('REDIS_TLS') === 'true';

    this.redis = new Redis({
      host: redisHost,
      port: Number(redisPort),
      username: redisUsername || undefined,
      password: redisPassword || undefined,
      tls: redisTls ? {} : undefined,
      lazyConnect: true,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType<string>() !== 'http') {
      return true;
    }

    const configuredRateLimit = this.reflector.getAllAndOverride<RateLimitOptions>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const rateLimit: RateLimitOptions = configuredRateLimit ?? {
      ttl: this.configService.get<number>('DEFAULT_RATE_LIMIT_TTL') || RATE_LIMITS.api.ttl,
      limit: this.configService.get<number>('DEFAULT_RATE_LIMIT_LIMIT') || RATE_LIMITS.api.limit,
    };

    const request = context.switchToHttp().getRequest();
    const forwardedIp = request.headers?.['x-forwarded-for'] as string | undefined;
    const ip = forwardedIp?.split(',')?.[0]?.trim() || request.ip || request.connection.remoteAddress;
    const userId = request.user?.userId || request.user?.id || request.user?._id;
    const subject = userId ? `user:${userId}` : `ip:${ip}`;
    const key = `ratelimit:${subject}:${context.getClass().name}:${context.getHandler().name}`;

    try {
      if (this.redis.status !== 'ready') {
        await this.redis.connect();
      }

      const current = await this.redis.incr(key);
      
      if (current === 1) {
        await this.redis.expire(key, rateLimit.ttl);
      }

      if (current > rateLimit.limit) {
        this.logger.warn(`Rate limit exceeded for ${subject} on ${key}`);
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: 'Too many requests, please try again later.',
            retryAfter: await this.redis.ttl(key),
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Rate limit error: ${errorMessage}`);
      // Fail open if Redis is down
      return true;
    }
  }
}
