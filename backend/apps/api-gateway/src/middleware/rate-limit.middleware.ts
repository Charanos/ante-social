import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RateLimitMiddleware.name);
  private readonly redis: Redis;
  private readonly ttlSeconds: number;
  private readonly maxRequests: number;

  constructor(private readonly configService: ConfigService) {
    this.ttlSeconds = Number(this.configService.get<string>('API_GATEWAY_RATE_LIMIT_TTL') || 60);
    this.maxRequests = Number(this.configService.get<string>('API_GATEWAY_RATE_LIMIT_LIMIT') || 180);

    const redisUrl =
      this.configService.get<string>('REDIS_URL') ||
      this.configService.get<string>('REDIS_URI');
    if (redisUrl) {
      this.redis = new Redis(redisUrl, { lazyConnect: true });
      return;
    }

    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST') || 'localhost',
      port: Number(this.configService.get<string>('REDIS_PORT') || 6379),
      username: this.configService.get<string>('REDIS_USERNAME') || undefined,
      password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
      lazyConnect: true,
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (this.redis.status !== 'ready') {
        await this.redis.connect();
      }

      const forwardedFor = req.headers['x-forwarded-for'];
      const ip = Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : typeof forwardedFor === 'string'
          ? forwardedFor.split(',')[0].trim()
          : req.ip;
      const route = `${req.method}:${req.baseUrl || req.path || 'unknown'}`;
      const key = `gateway-ratelimit:${ip}:${route}`;
      const current = await this.redis.incr(key);

      if (current === 1) {
        await this.redis.expire(key, this.ttlSeconds);
      }

      if (current > this.maxRequests) {
        const retryAfter = await this.redis.ttl(key);
        res.setHeader('Retry-After', Math.max(retryAfter, 1));
        res.status(429).json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again shortly.',
            retryAfter: Math.max(retryAfter, 1),
          },
        });
        return;
      }

      next();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Gateway rate limiter unavailable. Failing open. ${message}`);
      next();
    }
  }
}
