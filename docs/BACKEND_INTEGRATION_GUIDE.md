# BACKEND_INTEGRATION_GUIDE.md

**PROPRIETARY & CONFIDENTIAL — ANTE SOCIAL**
**Version 1.0 | February 2026**

---

## 1. Technology Stack

### Runtime & Framework

| Layer          | Technology                          | Version | Purpose                                               |
| :------------- | :---------------------------------- | :------ | :---------------------------------------------------- |
| **Runtime**    | Node.js                             | 20 LTS  | Server runtime                                        |
| **Framework**  | NestJS                              | 10.x    | Microservices framework with DI, guards, interceptors |
| **Language**   | TypeScript                          | 5.x     | Type safety across all services                       |
| **ORM**        | Mongoose                            | 8.x     | MongoDB ODM with schema validation                    |
| **Validation** | class-validator + class-transformer | Latest  | DTO validation and transformation                     |
| **API Docs**   | Swagger (via @nestjs/swagger)       | Latest  | Auto-generated API documentation                      |

### Data Layer

| Technology           | Purpose                                 | Configuration                                       |
| :------------------- | :-------------------------------------- | :-------------------------------------------------- |
| **MongoDB 7.0**      | Primary database                        | Atlas M10+ (replica set: 1 primary, 2 secondary)    |
| **Redis 7.2**        | Cache, sessions, rate limiting, pub/sub | ElastiCache or Redis Cloud                          |
| **Apache Kafka 3.6** | Event streaming, async processing       | 3-broker cluster via Confluent Cloud or self-hosted |

### External APIs

| API                          | Provider         | Purpose                                           | Environment          |
| :--------------------------- | :--------------- | :------------------------------------------------ | :------------------- |
| **Daraja API**               | Safaricom        | M-Pesa STK Push, C2B, B2C payments                | Sandbox → Production |
| **NOWPayments**              | NOWPayments      | Crypto deposits (USDT, BTC, ETH)                  | Sandbox → Production |
| **SendGrid**                 | Twilio           | Transactional email (verification, notifications) | —                    |
| **Firebase Cloud Messaging** | Google           | Push notifications (mobile + web)                 | —                    |
| **Exchange Rate API**        | ExchangeRate-API | USD/KSH live rates                                | —                    |

### Real-Time

| Technology        | Purpose                                   | Protocol      |
| :---------------- | :---------------------------------------- | :------------ |
| **Socket.IO**     | WebSocket server (via @nestjs/websockets) | WSS (TLS)     |
| **Redis Adapter** | WebSocket horizontal scaling              | Redis Pub/Sub |

### DevOps & Infrastructure

| Tool                        | Purpose                                                  |
| :-------------------------- | :------------------------------------------------------- |
| **Docker + Docker Compose** | Local development, service containerization              |
| **GitHub Actions**          | CI/CD pipeline                                           |
| **Terraform**               | Infrastructure as Code (optional for cloud provisioning) |
| **Sentry**                  | Error tracking and performance monitoring                |
| **Grafana + Prometheus**    | Metrics dashboards                                       |
| **Nginx**                   | Reverse proxy + load balancer                            |

---

## 2. Microservices Architecture

### Service Topology

```
┌─────────────────────────────────────────────────────────────────────┐
│                         NGINX REVERSE PROXY                         │
│                    (SSL termination, rate limiting)                  │
└────────┬───────────────┬────────────────┬──────────────┬────────────┘
         │               │                │              │
         ▼               ▼                ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌────────────┐ ┌────────────────┐
│  API GATEWAY │ │  AUTH        │ │ WEBSOCKET  │ │ ADMIN          │
│  SERVICE     │ │  SERVICE     │ │ GATEWAY    │ │ SERVICE        │
│  :3001       │ │  :3002       │ │ :3006      │ │ :3007          │
│              │ │              │ │            │ │                │
│ • Routing    │ │ • Register   │ │ • Socket.IO│ │ • User mgmt    │
│ • Validation │ │ • Login      │ │ • Redis    │ │ • Market mgmt  │
│ • Rate limit │ │ • JWT issue  │ │   adapter  │ │ • Compliance   │
│ • CORS       │ │ • 2FA (TOTP) │ │ • Room     │ │ • Withdrawals  │
│ • Logging    │ │ • Sessions   │ │   mgmt     │ │ • Analytics    │
└──────┬───────┘ └──────────────┘ └────────────┘ └────────────────┘
       │
       ├──────────────────┬──────────────────┬──────────────────┐
       ▼                  ▼                  ▼                  ▼
┌──────────────┐ ┌──────────────┐ ┌────────────────┐ ┌──────────────┐
│  MARKET      │ │  WALLET      │ │ NOTIFICATION   │ │ REPUTATION   │
│  ENGINE      │ │  SERVICE     │ │ SERVICE        │ │ ENGINE       │
│  :3003       │ │  :3004       │ │ :3005          │ │ :3008        │
│              │ │              │ │                │ │              │
│ • CRUD       │ │ • Balances   │ │ • FCM push     │ │ • Score calc │
│ • Settlement │ │ • M-Pesa     │ │ • Email        │ │ • Integrity  │
│ • 5 types    │ │   (Daraja)   │ │ • In-app       │ │   weighting  │
│ • Groups     │ │ • Crypto     │ │ • WebSocket    │ │ • Decay      │
│ • Audit log  │ │ • Limits     │ │   broadcast    │ │ • Anti-Sybil │
│              │ │ • KYC gate   │ │                │ │              │
└──────────────┘ └──────────────┘ └────────────────┘ └──────────────┘
       │                  │                │                  │
       └──────────────────┴────────┬───────┴──────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────┐
                    │     KAFKA CLUSTER        │
                    │  (Event Bus)             │
                    │                          │
                    │  Topics:                 │
                    │  • market.events         │
                    │  • bet.placements        │
                    │  • wallet.transactions   │
                    │  • user.activity         │
                    │  • notification.dispatch │
                    │  • compliance.flags      │
                    └──────────┬───────────────┘
                               │
                    ┌──────────┴───────────────┐
                    │                          │
              ┌─────┴────┐              ┌─────┴────┐
              │ MongoDB  │              │  Redis   │
              │ Atlas    │              │  Cluster │
              └──────────┘              └──────────┘
```

### Service Communication Patterns

| Pattern           | Use Case                                                     | Technology                          |
| :---------------- | :----------------------------------------------------------- | :---------------------------------- |
| **Sync HTTP**     | API Gateway → individual services                            | REST via Axios/Fetch                |
| **Async Events**  | Cross-service side effects (notifications, audit, analytics) | Kafka topics                        |
| **Pub/Sub**       | Real-time client updates (pool changes, settlements)         | Redis Pub/Sub → Socket.IO           |
| **Request/Reply** | Service-to-service queries (wallet balance check)            | NestJS microservice transport (TCP) |

---

## 3. Project Structure

```
ante-social-backend/
├── docker-compose.yml              # All services + Kafka + MongoDB + Redis
├── docker-compose.prod.yml         # Production overrides
├── .env.example                    # Environment template
├── package.json                    # Monorepo root (nx or turborepo)
├── turbo.json                      # Turborepo config
│
├── libs/                           # Shared libraries
│   ├── common/                     # Shared DTOs, interfaces, constants
│   │   ├── src/
│   │   │   ├── dto/                # Shared request/response DTOs
│   │   │   ├── interfaces/         # Shared TypeScript interfaces
│   │   │   ├── constants/          # Enums, market types, tiers
│   │   │   ├── decorators/         # Custom decorators (@CurrentUser, @Roles)
│   │   │   ├── guards/             # AuthGuard, RolesGuard, RateLimitGuard
│   │   │   ├── filters/            # Global exception filters
│   │   │   └── pipes/              # Validation pipes
│   │   └── package.json
│   │
│   ├── database/                   # Mongoose schemas and repositories
│   │   ├── src/
│   │   │   ├── schemas/            # Mongoose schema definitions
│   │   │   │   ├── user.schema.ts
│   │   │   │   ├── wallet.schema.ts
│   │   │   │   ├── market.schema.ts
│   │   │   │   ├── market-bet.schema.ts
│   │   │   │   ├── group.schema.ts
│   │   │   │   ├── group-bet.schema.ts
│   │   │   │   ├── transaction.schema.ts
│   │   │   │   ├── notification.schema.ts
│   │   │   │   ├── activity-log.schema.ts
│   │   │   │   ├── compliance-flag.schema.ts
│   │   │   │   ├── daily-limit.schema.ts
│   │   │   │   └── exchange-rate.schema.ts
│   │   │   └── repositories/       # Data access layer
│   │   └── package.json
│   │
│   └── kafka/                      # Kafka producer/consumer wrappers
│       ├── src/
│       │   ├── kafka.module.ts
│       │   ├── kafka.producer.ts
│       │   ├── kafka.consumer.ts
│       │   └── events/             # Event type definitions (Avro-like)
│       │       ├── bet-placed.event.ts
│       │       ├── market-settled.event.ts
│       │       ├── wallet-transaction.event.ts
│       │       └── user-activity.event.ts
│       └── package.json
│
├── apps/                           # Microservices
│   ├── api-gateway/                # Port 3001
│   │   ├── src/
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── middleware/
│   │   │   │   ├── rate-limit.middleware.ts
│   │   │   │   └── cors.middleware.ts
│   │   │   └── proxy/              # Route proxying to services
│   │   └── Dockerfile
│   │
│   ├── auth-service/               # Port 3002
│   │   ├── src/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── local.strategy.ts
│   │   │   ├── two-factor/
│   │   │   │   ├── two-factor.controller.ts
│   │   │   │   └── two-factor.service.ts
│   │   │   └── dto/
│   │   │       ├── register.dto.ts
│   │   │       ├── login.dto.ts
│   │   │       └── verify-2fa.dto.ts
│   │   └── Dockerfile
│   │
│   ├── market-engine/              # Port 3003
│   │   ├── src/
│   │   │   ├── market.module.ts
│   │   │   ├── controllers/
│   │   │   │   ├── market.controller.ts
│   │   │   │   ├── prediction.controller.ts
│   │   │   │   └── group.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── market.service.ts
│   │   │   │   ├── prediction.service.ts
│   │   │   │   └── group.service.ts
│   │   │   ├── settlement/
│   │   │   │   ├── settlement.dispatcher.ts
│   │   │   │   ├── consensus.settlement.ts
│   │   │   │   ├── reflex.settlement.ts
│   │   │   │   ├── ladder.settlement.ts
│   │   │   │   ├── prisoner-dilemma.settlement.ts
│   │   │   │   ├── syndicate.settlement.ts
│   │   │   │   ├── winner-takes-all.settlement.ts
│   │   │   │   └── odd-one-out.settlement.ts
│   │   │   └── schedulers/
│   │   │       └── market-close.scheduler.ts
│   │   └── Dockerfile
│   │
│   ├── wallet-service/             # Port 3004
│   │   ├── src/
│   │   │   ├── wallet.module.ts
│   │   │   ├── wallet.controller.ts
│   │   │   ├── wallet.service.ts
│   │   │   ├── payment-providers/
│   │   │   │   ├── daraja/
│   │   │   │   │   ├── daraja.module.ts
│   │   │   │   │   ├── daraja.service.ts     # M-Pesa STK Push, C2B, B2C
│   │   │   │   │   ├── daraja.callback.ts    # Webhook handler
│   │   │   │   │   └── daraja.types.ts       # Daraja API types
│   │   │   │   └── crypto/
│   │   │   │       ├── nowpayments.service.ts
│   │   │   │       └── nowpayments.callback.ts
│   │   │   ├── daily-limit/
│   │   │   │   └── daily-limit.service.ts
│   │   │   └── kyc/
│   │   │       └── kyc.service.ts
│   │   └── Dockerfile
│   │
│   ├── notification-service/       # Port 3005
│   │   ├── src/
│   │   │   ├── notification.module.ts
│   │   │   ├── notification.controller.ts
│   │   │   ├── notification.service.ts
│   │   │   ├── channels/
│   │   │   │   ├── fcm.service.ts            # Firebase push
│   │   │   │   ├── email.service.ts          # SendGrid
│   │   │   │   └── in-app.service.ts         # DB + WebSocket
│   │   │   └── consumers/
│   │   │       └── notification.consumer.ts  # Kafka consumer
│   │   └── Dockerfile
│   │
│   ├── websocket-gateway/          # Port 3006
│   │   ├── src/
│   │   │   ├── ws.module.ts
│   │   │   ├── ws.gateway.ts                 # Socket.IO gateway
│   │   │   ├── ws.auth.guard.ts              # JWT auth on handshake
│   │   │   ├── rooms/
│   │   │   │   ├── market.room.ts            # market:{id} rooms
│   │   │   │   ├── group.room.ts             # group:{id} rooms
│   │   │   │   └── user.room.ts              # user:{id} private rooms
│   │   │   └── consumers/
│   │   │       └── ws-broadcast.consumer.ts  # Kafka → WebSocket bridge
│   │   └── Dockerfile
│   │
│   ├── admin-service/              # Port 3007
│   │   ├── src/
│   │   │   ├── admin.module.ts
│   │   │   ├── admin.controller.ts
│   │   │   ├── compliance/
│   │   │   │   ├── compliance.service.ts
│   │   │   │   └── compliance.consumer.ts    # Kafka consumer for flags
│   │   │   ├── analytics/
│   │   │   │   └── analytics.service.ts
│   │   │   └── withdrawal/
│   │   │       └── withdrawal.service.ts
│   │   └── Dockerfile
│   │
│   └── reputation-engine/          # Port 3008
│       ├── src/
│       │   ├── reputation.module.ts
│       │   ├── reputation.service.ts
│       │   ├── integrity-weight.service.ts
│       │   ├── decay.scheduler.ts            # Weekly decay cron
│       │   └── consumers/
│       │       └── reputation.consumer.ts    # Kafka consumer
│       └── Dockerfile
```

---

## 4. Kafka Event Architecture

### 4.1 Topic Definitions

| Topic                   | Partitions | Retention | Key        | Producers          | Consumers                                       |
| :---------------------- | :--------- | :-------- | :--------- | :----------------- | :---------------------------------------------- |
| `market.events`         | 6          | 30 days   | `marketId` | Market Engine      | Notification, WebSocket, Reputation, Admin      |
| `bet.placements`        | 12         | 30 days   | `userId`   | Market Engine      | Notification, Reputation, Compliance, WebSocket |
| `wallet.transactions`   | 6          | 90 days   | `userId`   | Wallet Service     | Notification, Compliance, Admin                 |
| `user.activity`         | 6          | 14 days   | `userId`   | Auth, all services | Reputation, Analytics                           |
| `notification.dispatch` | 6          | 7 days    | `userId`   | Any service        | Notification Service                            |
| `compliance.flags`      | 3          | 365 days  | `userId`   | Compliance, Wallet | Admin, Notification                             |

### 4.2 Event Schemas

```typescript
// bet.placements
interface BetPlacedEvent {
  eventId: string; // UUID
  eventType: "BET_PLACED";
  timestamp: string; // ISO 8601
  payload: {
    predictionId: string;
    marketId: string;
    userId: string;
    marketType:
      | "consensus"
      | "reflex"
      | "ladder"
      | "prisoner_dilemma"
      | "syndicate";
    stake: number;
    currency: "USD" | "KSH";
    integrityWeight: number;
    // Option details hidden from event (privacy)
  };
}

// market.events
interface MarketSettledEvent {
  eventId: string;
  eventType: "MARKET_SETTLED";
  timestamp: string;
  payload: {
    marketId: string;
    marketType: string;
    totalPool: number;
    platformFee: number;
    prizePool: number;
    winnerCount: number;
    participantCount: number;
    winningOption: string; // Option text (post-settlement, public)
  };
}

// wallet.transactions
interface WalletTransactionEvent {
  eventId: string;
  eventType:
    | "DEPOSIT_COMPLETED"
    | "WITHDRAWAL_REQUESTED"
    | "WITHDRAWAL_COMPLETED"
    | "BET_DEBIT"
    | "PAYOUT_CREDIT"
    | "REFUND";
  timestamp: string;
  payload: {
    transactionId: string;
    userId: string;
    amount: number;
    currency: "USD" | "KSH";
    method?: "mpesa" | "crypto" | "internal";
    newBalance: number;
  };
}

// notification.dispatch
interface NotificationDispatchEvent {
  eventId: string;
  eventType: "SEND_NOTIFICATION";
  timestamp: string;
  payload: {
    userId: string;
    channels: ("push" | "email" | "in_app" | "websocket")[];
    title: string;
    message: string;
    icon?: string;
    actionUrl?: string;
    data?: Record<string, any>;
  };
}
```

### 4.3 Consumer Groups

| Group ID           | Service              | Topics Consumed                                                                   | Purpose                      |
| :----------------- | :------------------- | :-------------------------------------------------------------------------------- | :--------------------------- |
| `cg-notifications` | Notification Service | `notification.dispatch`, `market.events`, `bet.placements`, `wallet.transactions` | Deliver alerts               |
| `cg-websocket`     | WebSocket Gateway    | `market.events`, `bet.placements`, `wallet.transactions`                          | Real-time broadcast          |
| `cg-reputation`    | Reputation Engine    | `market.events`, `bet.placements`, `user.activity`                                | Score recalculation          |
| `cg-compliance`    | Admin Service        | `wallet.transactions`, `bet.placements`, `compliance.flags`                       | Suspicious pattern detection |
| `cg-analytics`     | Admin Service        | All topics                                                                        | Aggregate metrics            |

### 4.4 Data Flow: Bet Placement → Settlement

```
USER places prediction
  │
  ├─→ API Gateway validates JWT, rate-checks
  ├─→ Forwards to Market Engine
  │
  │ MARKET ENGINE:
  ├─→ Validates market active, user eligible, no duplicate
  ├─→ TCP call to Wallet Service: "debit 50 USD from user X"
  │     └─→ Wallet Service: validates balance, daily limit
  │         └─→ Begins MongoDB transaction:
  │              1. Debit wallet
  │              2. Create transaction record
  │              3. Update daily limit
  │         └─→ Publishes WalletTransactionEvent to Kafka (wallet.transactions)
  │         └─→ Returns success to Market Engine
  │
  ├─→ Creates prediction record in DB
  ├─→ Updates market pool totals
  ├─→ Publishes BetPlacedEvent to Kafka (bet.placements)
  ├─→ Returns success response to user
  │
  │ KAFKA CONSUMERS (async, parallel):
  ├─→ cg-notifications: sends "Prediction confirmed" push + in-app
  ├─→ cg-websocket: broadcasts pool update to market:{id} room
  ├─→ cg-reputation: records activity for user
  └─→ cg-compliance: checks for suspicious patterns

--- TIME PASSES, MARKET CLOSES ---

MARKET CLOSE SCHEDULER fires
  │
  ├─→ Sets market status = "settling"
  ├─→ Fetches all predictions
  ├─→ Dispatches to type-specific settlement handler
  │     e.g., ConsensusSettlementService.settle(marketId)
  │
  │ SETTLEMENT HANDLER:
  ├─→ Calculates pool, fee, prize
  ├─→ Determines winners
  ├─→ For each winner:
  │     └─→ TCP call to Wallet Service: "credit payout"
  │           └─→ Creates payout transaction
  │           └─→ Publishes WalletTransactionEvent
  │
  ├─→ Updates market with results + status = "settled"
  ├─→ Publishes MarketSettledEvent to Kafka
  │
  │ KAFKA CONSUMERS:
  ├─→ cg-notifications: sends result notifications to all participants
  ├─→ cg-websocket: broadcasts settlement to market:{id} + user rooms
  ├─→ cg-reputation: recalculates scores for all participants
  └─→ cg-analytics: updates platform metrics
```

---

## 5. WebSocket Architecture

### 5.1 Connection & Authentication

```typescript
// Client connection (Next.js frontend)
import { io } from "socket.io-client";

const socket = io("wss://api.antesocial.com", {
  auth: {
    token: jwtToken, // From NextAuth session
  },
  transports: ["websocket"], // Skip polling fallback
});

// Server-side auth guard (WebSocket Gateway)
@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL },
  namespace: "/",
})
export class WsGateway implements OnGatewayConnection {
  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    const user = await this.jwtService.verify(token);
    if (!user) {
      client.disconnect();
      return;
    }
    // Auto-join user's private room
    client.join(`user:${user.id}`);
  }
}
```

### 5.2 Room Structure

| Room Pattern        | Who Joins                             | Events Received                                            |
| :------------------ | :------------------------------------ | :--------------------------------------------------------- |
| `user:{userId}`     | Auto-joined on connect                | Wallet updates, personal notifications, prediction results |
| `market:{marketId}` | Client subscribes when viewing market | Pool updates, new participants, settlement results         |
| `group:{groupId}`   | Client subscribes when viewing group  | Activity feed, new bets, winner declarations               |
| `leaderboard`       | Client subscribes on leaderboard page | Rank changes                                               |

### 5.3 Events (Server → Client)

```typescript
// Pool update (broadcast to market:{id} room)
socket.to(`market:${marketId}`).emit("market:pool_updated", {
  marketId,
  totalPool: 2500.0,
  participantCount: 48,
  updatedAt: new Date().toISOString(),
});

// Settlement result (broadcast to market:{id} room)
socket.to(`market:${marketId}`).emit("market:settled", {
  marketId,
  winningOption: { id: "opt-3", text: "Route 33" },
  totalPool: 2450.0,
  winnerCount: 28,
  participantCount: 47,
});

// Personal prediction result (to user:{id} room)
socket.to(`user:${userId}`).emit("prediction:result", {
  marketId,
  isWinner: true,
  payout: 165.5,
  profit: 115.5,
});

// Wallet balance update (to user:{id} room)
socket.to(`user:${userId}`).emit("wallet:updated", {
  balances: {
    USD: { available: 615.5, pending: 0 },
    KSH: { available: 0, pending: 0 },
  },
});

// New notification (to user:{id} room)
socket.to(`user:${userId}`).emit("notification:new", {
  id: "notif-uuid",
  type: "bet_won",
  title: "🎯 You won!",
  message: 'Your prediction on "Best Nairobi Route" was correct!',
  actionUrl: "/dashboard/markets/market-id",
  createdAt: new Date().toISOString(),
});

// Group activity (broadcast to group:{id} room)
socket.to(`group:${groupId}`).emit("group:activity", {
  type: "winner_declared",
  description: "@admin declared @riley as winner",
  userId: "admin-id",
  createdAt: new Date().toISOString(),
});
```

### 5.4 Events (Client → Server)

```typescript
// Subscribe to market updates
socket.emit("market:subscribe", { marketId: "market-uuid" });

// Unsubscribe from market
socket.emit("market:unsubscribe", { marketId: "market-uuid" });

// Subscribe to group feed
socket.emit("group:subscribe", { groupId: "group-uuid" });

// Typing indicator in group (future)
socket.emit("group:typing", { groupId: "group-uuid" });
```

### 5.5 Scaling with Redis Adapter

```typescript
// WebSocket Gateway main.ts
import { IoAdapter } from "@nestjs/platform-socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

export class RedisIoAdapter extends IoAdapter {
  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    this.adapterConstructor = createAdapter(pubClient, subClient);
  }
}
```

This allows **multiple WebSocket Gateway instances** behind a load balancer. Redis Pub/Sub ensures events are broadcast across all instances.

---

## 6. Daraja API Integration (M-Pesa)

### 6.1 Overview

Safaricom's Daraja API enables three M-Pesa integration patterns:

| API                                  | Direction             | Use Case                                      |
| :----------------------------------- | :-------------------- | :-------------------------------------------- |
| **STK Push (Lipa Na M-Pesa Online)** | Platform → User phone | Deposits: push payment prompt to user's phone |
| **C2B (Customer to Business)**       | User → Platform       | Deposits: user initiates from M-Pesa menu     |
| **B2C (Business to Customer)**       | Platform → User       | Withdrawals: send money to user's M-Pesa      |

### 6.2 STK Push (Primary Deposit Method)

```typescript
// daraja.service.ts
@Injectable()
export class DarajaService {
  private baseUrl =
    process.env.DARAJA_ENV === "production"
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";

  // Step 1: Get OAuth access token
  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${process.env.DARAJA_CONSUMER_KEY}:${process.env.DARAJA_CONSUMER_SECRET}`,
    ).toString("base64");

    const response = await axios.get(
      `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${auth}` } },
    );
    return response.data.access_token;
  }

  // Step 2: Initiate STK Push
  async initiateSTKPush(params: {
    phoneNumber: string; // 254XXXXXXXXX format
    amount: number;
    accountReference: string; // ANTE-{userId}
    transactionDesc: string;
  }): Promise<STKPushResponse> {
    const token = await this.getAccessToken();
    const timestamp = this.getTimestamp(); // Format: YYYYMMDDHHmmss
    const password = Buffer.from(
      `${process.env.DARAJA_SHORTCODE}${process.env.DARAJA_PASSKEY}${timestamp}`,
    ).toString("base64");

    const response = await axios.post(
      `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: process.env.DARAJA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: params.amount,
        PartyA: params.phoneNumber,
        PartyB: process.env.DARAJA_SHORTCODE,
        PhoneNumber: params.phoneNumber,
        CallBackURL: `${process.env.API_BASE_URL}/api/v1/wallet/mpesa/callback`,
        AccountReference: params.accountReference,
        TransactionDesc: params.transactionDesc,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return response.data;
  }

  // Step 3: Handle STK Push callback
  async handleSTKCallback(body: STKCallbackBody): Promise<void> {
    const { ResultCode, ResultDesc, CallbackMetadata } = body.Body.stkCallback;

    if (ResultCode !== 0) {
      // Payment failed or cancelled
      await this.transactionService.markFailed(
        body.Body.stkCallback.CheckoutRequestID,
        ResultDesc,
      );
      return;
    }

    // Extract payment details from metadata
    const metadata = this.parseCallbackMetadata(CallbackMetadata);
    // metadata = { Amount, MpesaReceiptNumber, TransactionDate, PhoneNumber }

    // Credit user wallet
    await this.walletService.creditDeposit({
      checkoutRequestId: body.Body.stkCallback.CheckoutRequestID,
      amount: metadata.Amount,
      mpesaReference: metadata.MpesaReceiptNumber,
      phoneNumber: metadata.PhoneNumber,
    });

    // Publish event
    await this.kafkaProducer.emit("wallet.transactions", {
      eventType: "DEPOSIT_COMPLETED",
      payload: {
        amount: metadata.Amount,
        currency: "KSH",
        method: "mpesa",
        reference: metadata.MpesaReceiptNumber,
      },
    });
  }
}
```

### 6.3 B2C (Withdrawal to M-Pesa)

```typescript
// B2C payment for withdrawals
async initiateB2C(params: {
  phoneNumber: string;
  amount: number;
  transactionId: string;
}): Promise<B2CResponse> {
  const token = await this.getAccessToken();

  const response = await axios.post(
    `${this.baseUrl}/mpesa/b2c/v3/paymentrequest`,
    {
      OriginatorConversationID: params.transactionId,
      InitiatorName: process.env.DARAJA_INITIATOR_NAME,
      SecurityCredential: this.getSecurityCredential(),
      CommandID: 'BusinessPayment',
      Amount: params.amount,
      PartyA: process.env.DARAJA_SHORTCODE,
      PartyB: params.phoneNumber,
      Remarks: 'Ante Social Withdrawal',
      QueueTimeOutURL: `${process.env.API_BASE_URL}/api/v1/wallet/mpesa/b2c-timeout`,
      ResultURL: `${process.env.API_BASE_URL}/api/v1/wallet/mpesa/b2c-result`,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
}
```

### 6.4 Daraja Environment Variables

```env
# M-Pesa / Daraja API
DARAJA_ENV=sandbox                              # sandbox | production
DARAJA_CONSUMER_KEY=your_consumer_key
DARAJA_CONSUMER_SECRET=your_consumer_secret
DARAJA_SHORTCODE=174379                         # Sandbox shortcode
DARAJA_PASSKEY=your_passkey
DARAJA_INITIATOR_NAME=your_initiator
DARAJA_INITIATOR_PASSWORD=your_initiator_password
DARAJA_SECURITY_CERT_PATH=./certs/SandboxCertificate.cer
```

### 6.5 Daraja Sandbox Testing

```
Sandbox credentials:
  Consumer Key:    from developer.safaricom.co.ke
  Consumer Secret: from developer.safaricom.co.ke
  Shortcode:       174379 (sandbox)
  Passkey:         provided in sandbox docs

Test phone numbers:
  254708374149 (always succeeds)
  254700000000 (always fails)
```

---

## 7. Docker Compose Setup

### 7.1 Development Environment

```yaml
# docker-compose.yml
version: "3.9"

services:
  # ─── DATA LAYER ───
  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: antesocial
    volumes:
      - mongodb_data:/data/db
      - ./scripts/mongo-init.js:/docker-entrypoint-initdb.d/init.js

  redis:
    image: redis:7.2-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  # ─── KAFKA ───
  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
      - "29092:29092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "false"

  kafka-init:
    image: confluentinc/cp-kafka:7.5.0
    depends_on:
      - kafka
    entrypoint: /bin/sh -c
    command: |
      "
      echo 'Waiting for Kafka...'
      cub kafka-ready -b kafka:29092 1 60
      echo 'Creating topics...'
      kafka-topics --create --if-not-exists --bootstrap-server kafka:29092 --partitions 6  --topic market.events
      kafka-topics --create --if-not-exists --bootstrap-server kafka:29092 --partitions 12 --topic bet.placements
      kafka-topics --create --if-not-exists --bootstrap-server kafka:29092 --partitions 6  --topic wallet.transactions
      kafka-topics --create --if-not-exists --bootstrap-server kafka:29092 --partitions 6  --topic user.activity
      kafka-topics --create --if-not-exists --bootstrap-server kafka:29092 --partitions 6  --topic notification.dispatch
      kafka-topics --create --if-not-exists --bootstrap-server kafka:29092 --partitions 3  --topic compliance.flags
      echo 'Topics created.'
      "

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    ports:
      - "8080:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:29092
    depends_on:
      - kafka

  # ─── MICROSERVICES ───
  api-gateway:
    build: ./apps/api-gateway
    ports:
      - "3001:3001"
    env_file: .env
    depends_on:
      - redis
      - auth-service
      - market-engine
      - wallet-service

  auth-service:
    build: ./apps/auth-service
    ports:
      - "3002:3002"
    env_file: .env
    depends_on:
      - mongodb
      - redis

  market-engine:
    build: ./apps/market-engine
    ports:
      - "3003:3003"
    env_file: .env
    depends_on:
      - mongodb
      - redis
      - kafka

  wallet-service:
    build: ./apps/wallet-service
    ports:
      - "3004:3004"
    env_file: .env
    depends_on:
      - mongodb
      - kafka

  notification-service:
    build: ./apps/notification-service
    ports:
      - "3005:3005"
    env_file: .env
    depends_on:
      - mongodb
      - redis
      - kafka

  websocket-gateway:
    build: ./apps/websocket-gateway
    ports:
      - "3006:3006"
    env_file: .env
    depends_on:
      - redis
      - kafka

  admin-service:
    build: ./apps/admin-service
    ports:
      - "3007:3007"
    env_file: .env
    depends_on:
      - mongodb
      - kafka

  reputation-engine:
    build: ./apps/reputation-engine
    ports:
      - "3008:3008"
    env_file: .env
    depends_on:
      - mongodb
      - kafka

volumes:
  mongodb_data:
  redis_data:
```

---

## 8. Environment Variables (.env.example)

```env
# ─── General ───
NODE_ENV=development
API_BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000

# ─── MongoDB ───
MONGODB_URI=mongodb://admin:password@localhost:27017/antesocial?authSource=admin

# ─── Redis ───
REDIS_URL=redis://localhost:6379

# ─── Kafka ───
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=antesocial
KAFKA_GROUP_ID_PREFIX=cg

# ─── JWT ───
JWT_SECRET=your-256-bit-secret
JWT_EXPIRATION=24h

# ─── M-Pesa / Daraja ───
DARAJA_ENV=sandbox
DARAJA_CONSUMER_KEY=
DARAJA_CONSUMER_SECRET=
DARAJA_SHORTCODE=174379
DARAJA_PASSKEY=
DARAJA_INITIATOR_NAME=
DARAJA_INITIATOR_PASSWORD=
DARAJA_SECURITY_CERT_PATH=./certs/SandboxCertificate.cer

# ─── Crypto Payments ───
NOWPAYMENTS_API_KEY=
NOWPAYMENTS_IPN_SECRET=
NOWPAYMENTS_ENV=sandbox

# ─── Email (SendGrid) ───
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=noreply@antesocial.com

# ─── Push Notifications (Firebase) ───
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# ─── Exchange Rate ───
EXCHANGE_RATE_API_KEY=

# ─── Sentry ───
SENTRY_DSN=

# ─── Service Ports ───
API_GATEWAY_PORT=3001
AUTH_SERVICE_PORT=3002
MARKET_ENGINE_PORT=3003
WALLET_SERVICE_PORT=3004
NOTIFICATION_SERVICE_PORT=3005
WEBSOCKET_GATEWAY_PORT=3006
ADMIN_SERVICE_PORT=3007
REPUTATION_ENGINE_PORT=3008
```

---

## 9. Execution Plan — Step-by-Step

### Phase 1: Foundation (Week 1)

```
Step 1.1: Initialize monorepo
  → npx -y create-nx-workspace@latest ante-social-backend --preset=nest --appName=api-gateway
  → Configure Turborepo or Nx for monorepo management
  → Create shared libs: common, database, kafka

Step 1.2: Setup Docker Compose
  → MongoDB + Redis + Kafka + Zookeeper + Kafka UI
  → docker compose up -d
  → Verify all services healthy

Step 1.3: Database schemas
  → Implement all Mongoose schemas in libs/database/
  → Run mongo-init.js to create indexes
  → Seed test data

Step 1.4: Kafka infrastructure
  → Implement KafkaModule in libs/kafka/
  → Define all event types
  → Create producer/consumer wrappers
  → Test with kafka-ui
```

### Phase 2: Auth & Wallet (Week 2)

```
Step 2.1: Auth Service
  → Register endpoint (email, password, phone)
  → Login endpoint (JWT issuance)
  → Email verification flow
  → 2FA setup + verify (TOTP via speakeasy)
  → Auth guards (JWT validation)
  → Role guards (@Roles decorator)

Step 2.2: Wallet Service
  → Balance read endpoint
  → Daraja STK Push integration (deposit)
  → Daraja B2C integration (withdrawal)
  → Daraja webhook handlers (callback URLs)
  → Daily limit enforcement
  → Transaction history endpoint
  → KYC stub (manual approval for beta)

Step 2.3: Connect Auth → Wallet
  → User registration auto-creates wallet (MongoDB transaction)
  → JWT includes user tier for limit enforcement
```

### Phase 3: Market Engine (Week 3-4)

```
Step 3.1: Market CRUD
  → Create market (admin only)
  → List markets with filters
  → Get single market detail
  → Market status management

Step 3.2: Prediction placement
  → Place prediction (validate market, balance, limits)
  → Edit prediction (within 5-min window)
  → Cancel prediction (within 5-min window)
  → Debit wallet via TCP call to Wallet Service

Step 3.3: Settlement handlers
  → Consensus settlement (weighted votes)
  → Reflex settlement (minority multiplier)
  → Ladder settlement (exact sequence match)
  → Prisoner's Dilemma settlement (payoff matrix)
  → Settlement dispatcher (type → handler mapping)

Step 3.4: Market close scheduler
  → NestJS @Cron for checking market closesAt
  → Auto-close and trigger settlement
  → Publish MarketSettledEvent to Kafka

Step 3.5: Group markets
  → Group CRUD + invite system
  → Winner Takes All flow (declare → confirm → settle)
  → Odd One Out settlement
  → Group activity feed
```

### Phase 4: Real-Time & Notifications (Week 5)

```
Step 4.1: WebSocket Gateway
  → Socket.IO server with JWT auth
  → Redis adapter for horizontal scaling
  → Room management (market, group, user)
  → Kafka consumer → WebSocket broadcast bridge

Step 4.2: Notification Service
  → In-app notification storage + API
  → Kafka consumer for notification.dispatch events
  → FCM push notification integration
  → SendGrid email integration
  → WebSocket broadcast for real-time alerts

Step 4.3: Reputation Engine
  → Score calculation on market settlement
  → Integrity weight assignment
  → Decay scheduler (weekly cron)
  → Kafka consumer for bet + settlement events
```

### Phase 5: Admin & Compliance (Week 6)

```
Step 5.1: Admin Service
  → Platform stats dashboard API
  → User management (search, tier updates)
  → Withdrawal approval queue
  → Market management (create, settle, cancel)

Step 5.2: Compliance monitoring
  → Kafka consumer for transaction patterns
  → Automated flagging rules (structuring, velocity, multi-account)
  → Account freeze/unfreeze endpoints
  → Compliance flag review API

Step 5.3: Analytics
  → DAU/MAU tracking
  → Revenue tracking (platform fees collected)
  → Market activity metrics
  → User growth metrics
```

### Phase 6: Frontend Integration (Week 7-8)

```
Step 6.1: Replace mock data
  → Create API client service (Axios instance with interceptors)
  → Replace mockData.ts imports with API calls
  → Replace localStorage membership with API calls
  → Connect NextAuth to Auth Service

Step 6.2: Real-time integration
  → Socket.IO client setup in React
  → Market page: subscribe to pool updates + settlement
  → Wallet: subscribe to balance changes
  → Notifications: subscribe to new alerts
  → Group pages: subscribe to activity feed

Step 6.3: Wallet flows
  → M-Pesa STK Push flow (deposit)
  → Withdrawal request flow
  → Transaction history from API
  → Status polling for pending deposits

Step 6.4: Error handling
  → Global error boundary for API failures
  → Toast notifications for transaction errors
  → Retry logic for network failures
  → Optimistic UI updates with rollback
```

### Phase 7: Testing & Launch (Week 9-10)

```
Step 7.1: Integration testing
  → End-to-end market lifecycle (create → predict → settle → payout)
  → Wallet flow (deposit → predict → win → withdraw)
  → Group flow (create → invite → bet → declare → confirm → settle)
  → Edge cases (ties, disputes, empty markets, concurrent predictions)

Step 7.2: Load testing
  → k6 or Artillery for API load tests
  → Target: 100 concurrent users, <500ms p95
  → Kafka consumer lag monitoring
  → WebSocket connection capacity test

Step 7.3: Security audit
  → OWASP ZAP scan
  → JWT token expiry verification
  → Rate limiting verification
  → Input validation coverage

Step 7.4: Beta deployment
  → Deploy to cloud (AWS/GCP/DigitalOcean)
  → Setup monitoring (Sentry + Grafana)
  → Configure production Daraja credentials
  → Enable M-Pesa production shortcode
  → First cohort invited
```

---

## 10. Quick Reference Commands

```bash
# Start all infrastructure locally
docker compose up -d

# View Kafka topics and messages
open http://localhost:8080  # Kafka UI

# Start individual service in dev mode
cd apps/auth-service && npm run start:dev

# Start all services
npx nx run-many --target=serve --all

# Run tests
npx nx run-many --target=test --all

# Generate new service
npx nx g @nx/nest:app service-name

# Generate new shared library
npx nx g @nx/nest:library library-name --directory=libs

# Seed database
npx ts-node scripts/seed.ts

# Create Kafka topics manually
docker exec -it kafka kafka-topics --create \
  --bootstrap-server localhost:9092 \
  --partitions 6 --topic market.events
```

---

**CONFIDENTIAL PROPERTY OF ANTE SOCIAL**
_Backend Integration Guide v1.0 | February 2026_
