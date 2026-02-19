# SYSTEM_ARCHITECTURE.md

**PROPRIETARY & CONFIDENTIAL — ANTE SOCIAL**
**Version 2.0 | February 2026**

---

## 1. High-Level Architecture

Ante Social uses a **microservices architecture** built on **NestJS** with **Kafka** for event-driven communication, **Socket.IO** for real-time WebSocket delivery, **MongoDB** for persistence, and **Redis** for caching, sessions, and WebSocket scaling.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                   │
│   Next.js 14+ (App Router) · React 18 · Socket.IO Client                │
│   TailwindCSS · Framer Motion · @dnd-kit · NextAuth.js                   │
└──────────┬──────────────────────┬──────────────────────┬─────────────────┘
           │ HTTPS                │ WSS                  │ OAuth/JWT
           ▼                     ▼                      ▼
┌────────────────────┐  ┌──────────────────┐  ┌──────────────────────────┐
│   NGINX REVERSE    │  │  WEBSOCKET       │  │  AUTH SERVICE            │
│   PROXY            │  │  GATEWAY :3006   │  │  :3002                   │
│                    │  │                  │  │                          │
│ • SSL termination  │  │ • Socket.IO      │  │ • Register / Login       │
│ • Rate limiting    │  │ • JWT auth on    │  │ • JWT (RS256)            │
│ • Load balancing   │  │   handshake      │  │ • 2FA (TOTP + backup)    │
│ • CORS             │  │ • Redis adapter  │  │ • Email/phone verify     │
│ • Sticky sessions  │  │   (scaling)      │  │ • Password reset         │
│   (WebSocket)      │  │ • Room mgmt     │  │                          │
└────────┬───────────┘  └──────┬───────────┘  └──────────────────────────┘
         │                     │
         ▼                     │ Kafka → WS bridge
┌────────────────────┐         │
│   API GATEWAY      │         │
│   :3001             │         │
│                    │         │
│ • Request routing  │         │
│ • JWT validation   │         │
│ • Input validation │         │
│ • Request logging  │         │
└────────┬───────────┘         │
         │                     │
    ┌────┴────────┬────────────┼───────────┬──────────────┐
    ▼             ▼            │           ▼              ▼
┌──────────┐ ┌──────────┐     │    ┌────────────┐ ┌────────────┐
│ MARKET   │ │ WALLET   │     │    │ NOTIFIC.   │ │ REPUTATION │
│ ENGINE   │ │ SERVICE  │     │    │ SERVICE    │ │ ENGINE     │
│ :3003    │ │ :3004    │     │    │ :3005      │ │ :3008      │
│          │ │          │     │    │            │ │            │
│ • CRUD   │ │ • Balance│     │    │ • FCM push │ │ • Score    │
│ • 5 mkt  │ │ • Daraja │     │    │ • SendGrid │ │   calc     │
│   types  │ │   M-Pesa │     │    │ • In-app   │ │ • Integrity│
│ • Groups │ │ • Crypto │     │    │ • WS push  │ │   weight   │
│ • Settle │ │ • Limits │     │    │            │ │ • Decay    │
│ • Audit  │ │ • KYC    │     │    │            │ │ • Anti-    │
│          │ │          │     │    │            │ │   Sybil    │
└────┬─────┘ └────┬─────┘     │    └─────┬──────┘ └─────┬──────┘
     │            │           │          │              │
     └────────────┴───────────┴──────────┴──────────────┘
                              │
                              ▼
               ┌──────────────────────────────┐
               │     APACHE KAFKA 3.6         │
               │     (Event Bus)              │
               │                              │
               │  market.events               │
               │  bet.placements              │
               │  wallet.transactions         │
               │  user.activity               │
               │  notification.dispatch       │
               │  compliance.flags            │
               └───────────┬──────────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────────┐
        │ MongoDB  │ │  Redis   │ │ ADMIN        │
        │ 7.0      │ │  7.2     │ │ SERVICE      │
        │          │ │          │ │ :3007        │
        │ • Users  │ │ • Session│ │              │
        │ • Markets│ │ • Cache  │ │ • User mgmt  │
        │ • Bets   │ │ • Rate   │ │ • Compliance │
        │ • Wallets│ │   limits │ │ • Withdrawals│
        │ • Groups │ │ • WS     │ │ • Analytics  │
        │ • Audit  │ │   adapter│ │              │
        └──────────┘ └──────────┘ └──────────────┘
```

---

## 2. Technology Stack

### Runtime & Framework

| Component     | Technology     | Purpose                                                           |
| :------------ | :------------- | :---------------------------------------------------------------- |
| **Runtime**   | Node.js 20 LTS | Server runtime for all services                                   |
| **Framework** | NestJS 10.x    | Microservices framework with DI, guards, interceptors, scheduling |
| **Language**  | TypeScript 5.x | Type safety across entire monorepo                                |
| **ORM**       | Mongoose 8.x   | MongoDB ODM with schema validation                                |
| **Monorepo**  | Turborepo / Nx | Build orchestration, shared libraries, parallel execution         |

### Data Layer

| Technology       | Version | Purpose                                                          |
| :--------------- | :------ | :--------------------------------------------------------------- |
| **MongoDB**      | 7.0     | Primary database (Atlas M10+ with replica set)                   |
| **Redis**        | 7.2     | Sessions, rate limiting, caching, WebSocket adapter, leaderboard |
| **Apache Kafka** | 3.6     | Async event streaming between microservices                      |

### External APIs

| API                          | Purpose                                           | Integration              |
| :--------------------------- | :------------------------------------------------ | :----------------------- |
| **Safaricom Daraja**         | M-Pesa deposits (STK Push) + withdrawals (B2C)    | REST + webhook callbacks |
| **NOWPayments**              | Crypto deposits (USDT-TRC20, BTC, ETH)            | REST + IPN callbacks     |
| **SendGrid**                 | Transactional email (verification, notifications) | Email API                |
| **Firebase Cloud Messaging** | Push notifications (mobile + web)                 | Admin SDK                |
| **ExchangeRate-API**         | Live USD/KSH rates                                | Periodic polling         |

### Real-Time Stack

| Technology            | Purpose                                                  |
| :-------------------- | :------------------------------------------------------- |
| **Socket.IO**         | WebSocket server (@nestjs/websockets)                    |
| **Redis Adapter**     | WebSocket horizontal scaling across instances            |
| **Kafka → WS Bridge** | Consumer translates Kafka events to Socket.IO broadcasts |

---

## 3. Microservices (8 Services)

| #   | Service                  | Port | Responsibilities                                                       |
| :-- | :----------------------- | :--- | :--------------------------------------------------------------------- |
| 1   | **API Gateway**          | 3001 | Routing, JWT validation, rate limiting, request logging                |
| 2   | **Auth Service**         | 3002 | Registration, login, JWT issuance, 2FA, email/phone verification       |
| 3   | **Market Engine**        | 3003 | Market CRUD, prediction placement, settlement (5 types), groups, audit |
| 4   | **Wallet Service**       | 3004 | Balances, Daraja M-Pesa (STK Push + B2C), crypto, daily limits, KYC    |
| 5   | **Notification Service** | 3005 | FCM push, SendGrid email, in-app notifications, Kafka consumer         |
| 6   | **WebSocket Gateway**    | 3006 | Socket.IO server, room management, Kafka → WS bridge                   |
| 7   | **Admin Service**        | 3007 | User management, compliance flags, withdrawal approval, analytics      |
| 8   | **Reputation Engine**    | 3008 | Score calculation, integrity weighting, decay, anti-Sybil              |

### Communication Patterns

| Pattern          | Technology                    | Use Case                                                      |
| :--------------- | :---------------------------- | :------------------------------------------------------------ |
| **Sync HTTP**    | REST / Axios                  | Gateway → Services, Frontend → Gateway                        |
| **Sync TCP**     | NestJS Microservice Transport | Market Engine → Wallet Service (balance check, debit/credit)  |
| **Async Events** | Kafka                         | Cross-service side effects (notifications, audit, reputation) |
| **Pub/Sub**      | Redis → Socket.IO             | Real-time client broadcasts                                   |

---

## 4. Kafka Event Architecture

### Topics

| Topic                   | Partitions | Producers          | Consumers                                       | Events                                                                  |
| :---------------------- | :--------- | :----------------- | :---------------------------------------------- | :---------------------------------------------------------------------- |
| `market.events`         | 6          | Market Engine      | Notification, WebSocket, Reputation, Admin      | `MARKET_CREATED`, `MARKET_CLOSED`, `MARKET_SETTLED`, `MARKET_CANCELLED` |
| `bet.placements`        | 12         | Market Engine      | Notification, WebSocket, Reputation, Compliance | `BET_PLACED`, `BET_EDITED`, `BET_CANCELLED`                             |
| `wallet.transactions`   | 6          | Wallet Service     | Notification, Compliance, Admin                 | `DEPOSIT_COMPLETED`, `WITHDRAWAL_REQUESTED`, `PAYOUT_CREDIT`, `REFUND`  |
| `user.activity`         | 6          | All services       | Reputation, Analytics                           | `USER_REGISTERED`, `USER_LOGIN`, `PROFILE_UPDATED`                      |
| `notification.dispatch` | 6          | Any service        | Notification Service                            | `SEND_NOTIFICATION` (with channel routing)                              |
| `compliance.flags`      | 3          | Compliance, Wallet | Admin, Notification                             | `ACCOUNT_FLAGGED`, `ACCOUNT_FROZEN`, `ACCOUNT_UNFROZEN`                 |

### Consumer Groups

| Group ID           | Service              | Purpose                                  |
| :----------------- | :------------------- | :--------------------------------------- |
| `cg-notifications` | Notification Service | Deliver push/email/in-app alerts         |
| `cg-websocket`     | WebSocket Gateway    | Real-time broadcast to connected clients |
| `cg-reputation`    | Reputation Engine    | Score recalculation                      |
| `cg-compliance`    | Admin Service        | Suspicious pattern detection             |
| `cg-analytics`     | Admin Service        | Aggregate platform metrics               |

---

## 5. WebSocket Architecture

### Connection Flow

```
Client connects → WSS + JWT auth on handshake → Auto-join user:{userId} room
  ├─→ Client subscribes to market:{marketId} (when viewing market page)
  ├─→ Client subscribes to group:{groupId} (when viewing group page)
  └─→ Client subscribes to leaderboard (when viewing leaderboard)
```

### Server → Client Events

| Event                 | Room          | Trigger                                      |
| :-------------------- | :------------ | :------------------------------------------- |
| `market:pool_updated` | `market:{id}` | New prediction placed                        |
| `market:settled`      | `market:{id}` | Market settlement complete                   |
| `prediction:result`   | `user:{id}`   | User's personal prediction result            |
| `wallet:updated`      | `user:{id}`   | Balance change (deposit, payout, debit)      |
| `notification:new`    | `user:{id}`   | New notification                             |
| `group:activity`      | `group:{id}`  | Group bet placed, winner declared, confirmed |

### Scaling

- **Redis Adapter**: All WebSocket Gateway instances share room state via Redis Pub/Sub
- **Sticky Sessions**: Nginx configured with `ip_hash` or Socket.IO client reconnection
- **Kafka → WS Bridge**: Dedicated Kafka consumer translates events to Socket.IO broadcasts

---

## 6. M-Pesa Integration (Daraja API)

### Deposit Flow (STK Push)

```
User clicks "Deposit" → Frontend sends POST /api/v1/wallet/deposit
  ↓
Wallet Service calls Daraja STK Push API
  → Safaricom pushes payment prompt to user's phone
  → User enters M-Pesa PIN on their phone
  ↓
Safaricom sends callback to /api/v1/wallet/mpesa/callback
  ↓
Wallet Service:
  1. Validates callback authenticity
  2. Credits user wallet (MongoDB transaction)
  3. Creates transaction record
  4. Publishes WalletTransactionEvent to Kafka
  ↓
Kafka consumers:
  → Notification Service: sends "Deposit confirmed" push
  → WebSocket Gateway: broadcasts wallet:updated to user:{id}
  → Compliance: checks for structuring patterns
```

### Withdrawal Flow (B2C)

```
User requests withdrawal → Admin reviews → Admin approves
  ↓
Admin Service calls Wallet Service → initiates Daraja B2C
  → Safaricom sends money to user's M-Pesa
  → Callback to /api/v1/wallet/mpesa/b2c-result
  ↓
Wallet Service:
  1. Marks withdrawal as completed
  2. Publishes WalletTransactionEvent
  → User receives M-Pesa SMS confirmation
```

### Environment Configuration

- **Sandbox**: `https://sandbox.safaricom.co.ke` (test with phone 254708374149)
- **Production**: `https://api.safaricom.co.ke` (requires approved shortcode)

Full implementation code in `BACKEND_INTEGRATION_GUIDE.md` §6.

---

## 7. Authentication Architecture

```
┌─────────────────────────────────────────────────┐
│              Auth Service (:3002)                │
│                                                  │
│  Registration:                                   │
│    → Validate inputs + age ≥ 18                  │
│    → Hash password (bcrypt, 12 rounds)           │
│    → Create user + wallet (atomic transaction)   │
│    → Send verification email (via Kafka)         │
│                                                  │
│  Login:                                          │
│    → Verify credentials                          │
│    → Check 2FA requirement                       │
│    → Issue JWT (RS256, 24h expiry)               │
│    → Set HTTP-only Secure cookie                 │
│                                                  │
│  JWT Payload:                                    │
│    { userId, role, username, tier }               │
│                                                  │
│  2FA:                                            │
│    → TOTP setup (speakeasy library)              │
│    → QR code generation                          │
│    → 10 backup codes (hashed after display)      │
│    → Required for: withdrawals, tier changes     │
│                                                  │
│  Rate Limits (via Redis):                        │
│    → Login: 5 attempts/min (IP-based lockout)    │
│    → Register: 3 accounts/IP/day                 │
│                                                  │
│  RBAC Roles:                                     │
│    admin → group_admin → moderator → user         │
└─────────────────────────────────────────────────┘
```

---

## 8. Data Flow Diagrams

### 8.1 Prediction Placement (Sync + Async)

```
API Gateway ──[HTTP]──→ Market Engine
                          │
                          ├─→ Validate market status, user eligibility
                          ├─→ [TCP] Wallet Service: debit stake
                          │     └─→ MongoDB transaction (debit + record)
                          │     └─→ Kafka: wallet.transactions
                          │
                          ├─→ Create prediction record
                          ├─→ Update market pool
                          ├─→ Kafka: bet.placements
                          └─→ HTTP 201 response
                                   │
                          ┌────────┴────────┐
                          ▼                 ▼
                   Notification        WebSocket Gateway
                   Service             broadcasts to
                   (push + in-app)     market:{id} room
```

### 8.2 Market Settlement (Scheduled + Event-Driven)

```
Market Close Scheduler (@Cron)
  │
  ├─→ Find markets where closesAt <= now && status == "active"
  ├─→ Set status = "settling"
  ├─→ Dispatch to type-specific handler
  │
  │ Settlement Handler:
  ├─→ Calculate pool, fee (5%), prize
  ├─→ Determine winners
  ├─→ For each winner:
  │     └─→ [TCP] Wallet Service: credit payout
  ├─→ Update market results + status = "settled"
  ├─→ Kafka: market.events (MARKET_SETTLED)
  │
  │ Async consumers:
  ├─→ cg-notifications: result alerts to all participants
  ├─→ cg-websocket: market:settled + prediction:result events
  ├─→ cg-reputation: recalculate scores for participants
  └─→ cg-analytics: update platform revenue metrics
```

---

## 9. Scalability

### Horizontal Scaling Targets

| Component         | Strategy                            | Trigger                      |
| :---------------- | :---------------------------------- | :--------------------------- |
| API Gateway       | Multiple instances behind Nginx     | >70% CPU                     |
| Market Engine     | Multiple instances (stateless)      | >500ms p95 latency           |
| WebSocket Gateway | Redis adapter, sticky sessions      | >1000 concurrent connections |
| MongoDB           | Replica set → Sharding at >10M docs | Read lag, collection size    |
| Kafka             | Add partitions, add brokers         | Consumer lag                 |

### Caching (Redis)

| Data            | TTL         | Invalidation            |
| :-------------- | :---------- | :---------------------- |
| User session    | 24h         | On logout               |
| Market listings | 30s         | On market status change |
| Exchange rates  | 1h          | On API refresh          |
| Leaderboard     | 5m          | On settlement           |
| Daily limits    | Rolling 24h | On transaction          |

---

## 10. Infrastructure (Docker Compose)

All 8 microservices + MongoDB + Redis + Kafka + Zookeeper + Kafka UI are containerized. Full `docker-compose.yml` in `BACKEND_INTEGRATION_GUIDE.md` §7.

```
docker compose up -d     # Start all services
docker compose logs -f   # Stream all logs
docker compose ps        # Check health status
```

Individual service development:

```
cd apps/auth-service && npm run start:dev
```

---

## 11. Technical Debt

> [!WARNING]
> **Prisma must be removed.** `src/lib/prisma.ts` initializes a PrismaClient, but the entire backend uses Mongoose + native MongoDB. Delete `prisma.ts` and any Prisma dependencies during frontend integration.

> [!IMPORTANT]
> **Frontend type alignment required.** `UserProfile` type includes `signalAccuracy`, `reputationScore`, `totalPnl` — these must be populated by the Reputation Engine and User Profile API. Ensure API response shape matches frontend types exactly.

---

**CONFIDENTIAL PROPERTY OF ANTE SOCIAL**
_System Architecture v2.0 | February 2026_
