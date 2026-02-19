import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { RequestLoggingMiddleware } from './middleware/request-logging.middleware';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [RequestLoggingMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Request Logging (applies to all routes)
    consumer
      .apply(RequestLoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    // Auth Service Proxy
    consumer
      .apply(
        createProxyMiddleware({
          target: process.env.AUTH_SERVICE_URL || 'http://localhost:3002',
          changeOrigin: true,
          pathRewrite: {
            '^/api/v1/auth': '/auth',
            '^/api/v1/user': '/user',
            '^/api/v1/users': '/users',
          },
        }),
      )
      .forRoutes(
        { path: 'api/v1/auth*', method: RequestMethod.ALL },
        { path: 'api/v1/user*', method: RequestMethod.ALL },
        { path: 'api/v1/users*', method: RequestMethod.ALL },
      );

    // Market Engine Proxy
    consumer
      .apply(
        createProxyMiddleware({
          target: process.env.MARKET_SERVICE_URL || 'http://localhost:3003',
          changeOrigin: true,
          pathRewrite: {
            '^/api/v1/markets': '/markets',
            '^/api/v1/predictions': '/predictions',
            '^/api/v1/groups': '/groups',
          },
        }),
      )
      .forRoutes(
        { path: 'api/v1/markets*', method: RequestMethod.ALL },
        { path: 'api/v1/predictions*', method: RequestMethod.ALL },
        { path: 'api/v1/groups*', method: RequestMethod.ALL },
      );

    // Wallet Service Proxy
    consumer
      .apply(
        createProxyMiddleware({
          target: process.env.WALLET_SERVICE_URL || 'http://localhost:3004',
          changeOrigin: true,
          pathRewrite: { '^/api/v1/wallet': '/wallet' },
        }),
      )
      .forRoutes({ path: 'api/v1/wallet*', method: RequestMethod.ALL });

    // Notification Service Proxy
    consumer
      .apply(
        createProxyMiddleware({
          target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
          changeOrigin: true,
          pathRewrite: { '^/api/v1/notifications': '/notifications' },
        }),
      )
      .forRoutes({ path: 'api/v1/notifications*', method: RequestMethod.ALL });

    // Admin Service Proxy
    consumer
      .apply(
        createProxyMiddleware({
          target: process.env.ADMIN_SERVICE_URL || 'http://localhost:3007',
          changeOrigin: true,
          pathRewrite: { '^/api/v1/admin': '/admin' },
        }),
      )
      .forRoutes({ path: 'api/v1/admin*', method: RequestMethod.ALL });
  }
}
