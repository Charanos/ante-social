# DATABASE_SCHEMA.md

**PROPRIETARY & CONFIDENTIAL — ANTE SOCIAL**
**Version 2.0 | February 2026**

---

## 1. Database Selection

**Primary**: MongoDB 6.0+ (document store)
**Cache**: Redis 7+ (sessions, rate limits, leaderboard)
**ORM Decision**: Native MongoDB driver (NOT Prisma — see [Technical Debt Note](#9-technical-debt))

---

## 2. Core Collections

### 2.1 `users`

Stores user identity, authentication state, tier, and preferences.

| Field              | Type       | Required | Description                                       |
| :----------------- | :--------- | :------- | :------------------------------------------------ |
| `_id`              | ObjectId   | ✓        | Primary key                                       |
| `username`         | String     | ✓        | 3-20 chars, alphanumeric + underscore, unique     |
| `email`            | String     | ✓        | Valid email, unique                               |
| `phoneNumber`      | String     | —        | Kenyan format: +254XXXXXXXXX                      |
| `passwordHash`     | String     | ✓        | bcrypt hash                                       |
| `dateOfBirth`      | Date       | ✓        | Must be 18+                                       |
| `twoFactorEnabled` | Boolean    | ✓        | Default: false                                    |
| `twoFactorSecret`  | String     | —        | TOTP secret (encrypted at rest)                   |
| `backupCodes`      | String[]   | —        | 10 one-time recovery codes                        |
| `tier`             | Enum       | ✓        | `novice` \| `high_roller`                         |
| `accountStatus`    | Enum       | ✓        | `active` \| `frozen` \| `suspended` \| `closed`   |
| `avatarUrl`        | String     | —        | CDN URL                                           |
| `bio`              | String     | —        | User bio text                                     |
| `fullName`         | String     | —        | Display name                                      |
| `reputationScore`  | Number     | ✓        | 0-1000 (community trust score)                    |
| `signalAccuracy`   | Number     | ✓        | 0-100 (historical correctness %)                  |
| `integrityWeight`  | Decimal128 | ✓        | 0.80–1.00 (anti-manipulation weight)              |
| `totalVolume`      | Decimal128 | ✓        | Lifetime volume traded                            |
| `totalPnl`         | Decimal128 | ✓        | Lifetime profit/loss                              |
| `totalWinnings`    | Decimal128 | —        | Sum of profitable positions                       |
| `totalLosses`      | Decimal128 | —        | Sum of losing positions                           |
| `followersCount`   | Number     | ✓        | Default: 0                                        |
| `followingCount`   | Number     | ✓        | Default: 0                                        |
| `isVerified`       | Boolean    | ✓        | KYC status                                        |
| `riskLimit`        | Decimal128 | ✓        | Max daily stake limit                             |
| `role`             | Enum       | ✓        | `admin` \| `group_admin` \| `user` \| `moderator` |
| `managedGroups`    | ObjectId[] | —        | IDs of administered groups                        |
| `preferences`      | Object     | ✓        | `{ theme, currency, notifications }`              |
| `createdAt`        | Date       | ✓        | Registration timestamp                            |
| `updatedAt`        | Date       | ✓        | Last modification                                 |
| `lastLoginAt`      | Date       | —        | Last successful login                             |

**Indexes:**

```javascript
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ phoneNumber: 1 }, { sparse: true });
db.users.createIndex({ tier: 1, accountStatus: 1 });
db.users.createIndex({ reputationScore: -1 }); // Leaderboard queries
db.users.createIndex({ createdAt: -1 });
```

---

### 2.2 `wallets`

One-to-one relationship with users. Tracks dual-currency balances.

| Field                    | Type       | Required | Description             |
| :----------------------- | :--------- | :------- | :---------------------- |
| `_id`                    | ObjectId   | ✓        | Primary key             |
| `userId`                 | ObjectId   | ✓        | Ref: users.\_id, unique |
| `balances.USD.available` | Decimal128 | ✓        | Spendable USD           |
| `balances.USD.pending`   | Decimal128 | ✓        | In-flight USD           |
| `balances.KSH.available` | Decimal128 | ✓        | Spendable KSH           |
| `balances.KSH.pending`   | Decimal128 | ✓        | In-flight KSH           |
| `createdAt`              | Date       | ✓        | —                       |
| `updatedAt`              | Date       | ✓        | —                       |

**Indexes:**

```javascript
db.wallets.createIndex({ userId: 1 }, { unique: true });
```

---

### 2.3 `publicMarkets`

All public market instances across all 5 types.

| Field                | Type     | Required | Description                                                                  |
| :------------------- | :------- | :------- | :--------------------------------------------------------------------------- |
| `_id`                | ObjectId | ✓        | Primary key                                                                  |
| `type`               | Enum     | ✓        | `consensus` \| `reflex` \| `ladder` \| `prisoner_dilemma` \| `syndicate`     |
| `title`              | String   | ✓        | Market question/title                                                        |
| `description`        | String   | ✓        | Detailed description                                                         |
| `image`              | String   | —        | Hero image URL                                                               |
| `category`           | String   | ✓        | Category tag                                                                 |
| `status`             | Enum     | ✓        | `draft` \| `active` \| `closed` \| `settling` \| `settled` \| `cancelled`    |
| `options`            | Array    | ✓        | `[{ optionId, text, mediaUrl, displayOrder, voteCount, totalStake }]`        |
| `pools.USD`          | Object   | ✓        | `{ totalPool, platformFee, prizePoolAfterFees, totalPaidOut }`               |
| `pools.KSH`          | Object   | ✓        | Same structure as USD                                                        |
| `oracleType`         | Enum     | ✓        | `manual` \| `automated` \| `community_consensus`                             |
| `resolutionCriteria` | String   | ✓        | How outcome is verified                                                      |
| `config`             | Object   | ✓        | Type-specific: `{ minStake, maxStake, allowMediaUploads, countdownSeconds }` |
| `results`            | Object   | —        | Populated after settlement                                                   |
| `tags`               | String[] | —        | Searchable tags                                                              |
| `createdBy`          | ObjectId | ✓        | Ref: users.\_id                                                              |
| `opensAt`            | Date     | ✓        | Market open time                                                             |
| `closesAt`           | Date     | ✓        | Market close time                                                            |
| `settledAt`          | Date     | —        | Settlement timestamp                                                         |
| `createdAt`          | Date     | ✓        | —                                                                            |
| `updatedAt`          | Date     | ✓        | —                                                                            |

**Indexes:**

```javascript
db.publicMarkets.createIndex({ type: 1, status: 1 });
db.publicMarkets.createIndex({ status: 1, closesAt: 1 });
db.publicMarkets.createIndex({ category: 1, status: 1 });
db.publicMarkets.createIndex({ createdAt: -1 });
db.publicMarkets.createIndex({ tags: 1 });
```

---

### 2.4 `marketBets`

Individual predictions placed on public markets.

| Field             | Type       | Required | Description                                   |
| :---------------- | :--------- | :------- | :-------------------------------------------- |
| `_id`             | ObjectId   | ✓        | Primary key                                   |
| `marketId`        | ObjectId   | ✓        | Ref: publicMarkets.\_id                       |
| `userId`          | ObjectId   | ✓        | Ref: users.\_id                               |
| `optionId`        | ObjectId   | ✓        | The chosen option (HIDDEN pre-settlement)     |
| `stake`           | Decimal128 | ✓        | Amount wagered                                |
| `currency`        | Enum       | ✓        | `USD` \| `KSH`                                |
| `integrityWeight` | Decimal128 | ✓        | User's weight at time of placement            |
| `rankedOptionIds` | ObjectId[] | —        | For ladder type: ordered ranking              |
| `choice`          | String     | —        | For prisoner_dilemma: `cooperate` \| `betray` |
| `responseTimeMs`  | Number     | —        | For reflex type: reaction time                |
| `payout`          | Decimal128 | —        | Populated after settlement                    |
| `isWinner`        | Boolean    | —        | Populated after settlement                    |
| `editableUntil`   | Date       | ✓        | 5 minutes after placement                     |
| `placedAt`        | Date       | ✓        | —                                             |
| `settledAt`       | Date       | —        | —                                             |

**Indexes:**

```javascript
db.marketBets.createIndex({ marketId: 1, userId: 1 }, { unique: true });
db.marketBets.createIndex({ userId: 1, placedAt: -1 });
db.marketBets.createIndex({ marketId: 1, isWinner: 1 });
```

---

### 2.5 `bettingGroups`

Social containers for private group markets.

| Field         | Type     | Required | Description                                                  |
| :------------ | :------- | :------- | :----------------------------------------------------------- |
| `_id`         | ObjectId | ✓        | Primary key                                                  |
| `name`        | String   | ✓        | Group display name                                           |
| `description` | String   | —        | Group description                                            |
| `adminId`     | ObjectId | ✓        | Ref: users.\_id                                              |
| `createdBy`   | ObjectId | ✓        | Ref: users.\_id                                              |
| `inviteCode`  | String   | ✓        | Unique join code                                             |
| `isPublic`    | Boolean  | ✓        | Visibility flag                                              |
| `category`    | String   | —        | Group category                                               |
| `image`       | String   | —        | Group image URL                                              |
| `members`     | Array    | ✓        | `[{ userId, username, role, joinedAt }]`                     |
| `rules`       | Object   | —        | `{ membershipApproval, marketCreation, minBuyIn, maxBuyIn }` |
| `stats`       | Object   | ✓        | `{ totalBets, activeBets, totalVolume }`                     |
| `createdAt`   | Date     | ✓        | —                                                            |
| `updatedAt`   | Date     | ✓        | —                                                            |

**Indexes:**

```javascript
db.bettingGroups.createIndex({ adminId: 1 });
db.bettingGroups.createIndex({ inviteCode: 1 }, { unique: true });
db.bettingGroups.createIndex({ "members.userId": 1 });
db.bettingGroups.createIndex({ isPublic: 1, category: 1 });
```

---

### 2.6 `groupBets`

Market instances within private groups.

| Field                  | Type       | Required | Description                                                                              |
| :--------------------- | :--------- | :------- | :--------------------------------------------------------------------------------------- |
| `_id`                  | ObjectId   | ✓        | Primary key                                                                              |
| `groupId`              | ObjectId   | ✓        | Ref: bettingGroups.\_id                                                                  |
| `type`                 | Enum       | ✓        | `winner_takes_all` \| `odd_one_out`                                                      |
| `title`                | String     | ✓        | —                                                                                        |
| `description`          | String     | —        | —                                                                                        |
| `status`               | Enum       | ✓        | `active` \| `closed` \| `pending_confirmation` \| `disputed` \| `settled` \| `cancelled` |
| `options`              | Array      | ✓        | Same structure as publicMarkets.options                                                  |
| `pools`                | Object     | ✓        | Same structure as publicMarkets.pools                                                    |
| `minimumStake`         | Decimal128 | ✓        | —                                                                                        |
| `declaredWinnerId`     | ObjectId   | —        | For winner_takes_all                                                                     |
| `declaredBy`           | ObjectId   | —        | Admin who declared                                                                       |
| `declaredAt`           | Date       | —        | —                                                                                        |
| `confirmationDeadline` | Date       | —        | 12 hours from declaration                                                                |
| `confirmations`        | Array      | —        | `[{ userId, action, comment, createdAt }]`                                               |
| `createdBy`            | ObjectId   | ✓        | —                                                                                        |
| `closesAt`             | Date       | —        | —                                                                                        |
| `settledAt`            | Date       | —        | —                                                                                        |
| `createdAt`            | Date       | ✓        | —                                                                                        |
| `updatedAt`            | Date       | ✓        | —                                                                                        |

**Indexes:**

```javascript
db.groupBets.createIndex({ groupId: 1, status: 1 });
db.groupBets.createIndex({ groupId: 1, createdAt: -1 });
```

---

### 2.7 `transactions`

Immutable record of all financial events.

| Field            | Type       | Required | Description                                                                             |
| :--------------- | :--------- | :------- | :-------------------------------------------------------------------------------------- |
| `_id`            | ObjectId   | ✓        | Primary key                                                                             |
| `userId`         | ObjectId   | ✓        | Ref: users.\_id                                                                         |
| `walletId`       | ObjectId   | ✓        | Ref: wallets.\_id                                                                       |
| `type`           | Enum       | ✓        | `deposit` \| `withdrawal` \| `bet_placed` \| `bet_payout` \| `refund` \| `platform_fee` |
| `status`         | Enum       | ✓        | `pending` \| `completed` \| `failed` \| `cancelled`                                     |
| `amount`         | Decimal128 | ✓        | Positive = credit, negative = debit                                                     |
| `currency`       | Enum       | ✓        | `USD` \| `KSH`                                                                          |
| `description`    | String     | ✓        | Human-readable description                                                              |
| `paymentDetails` | Object     | —        | Method-specific: M-Pesa or crypto details                                               |
| `marketMetadata` | Object     | —        | `{ marketId, total_pool, platform_fee, prize_pool }`                                    |
| `metadata`       | Object     | —        | Conversion rates, original amounts                                                      |
| `createdAt`      | Date       | ✓        | —                                                                                       |
| `completedAt`    | Date       | —        | —                                                                                       |

**Indexes:**

```javascript
db.transactions.createIndex({ userId: 1, createdAt: -1 });
db.transactions.createIndex({ walletId: 1 });
db.transactions.createIndex({ type: 1, status: 1 });
db.transactions.createIndex(
  { "paymentDetails.reference": 1 },
  { sparse: true },
);
```

---

### 2.8 `activityLogs`

User and system activity for feeds and audit.

| Field         | Type     | Required | Description                                                                                                                                                                                                     |
| :------------ | :------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_id`         | ObjectId | ✓        | —                                                                                                                                                                                                               |
| `userId`      | ObjectId | ✓        | —                                                                                                                                                                                                               |
| `type`        | Enum     | ✓        | `user_registered` \| `bet_placed` \| `bet_won` \| `bet_lost` \| `deposit_completed` \| `withdrawal_completed` \| `group_joined` \| `group_left` \| `winner_declared` \| `winner_confirmed` \| `winner_disputed` |
| `description` | String   | ✓        | —                                                                                                                                                                                                               |
| `groupId`     | ObjectId | —        | For group-scoped events                                                                                                                                                                                         |
| `marketId`    | ObjectId | —        | —                                                                                                                                                                                                               |
| `metadata`    | Object   | —        | Event-specific data                                                                                                                                                                                             |
| `ipAddress`   | String   | —        | —                                                                                                                                                                                                               |
| `createdAt`   | Date     | ✓        | —                                                                                                                                                                                                               |

**Indexes:**

```javascript
db.activityLogs.createIndex({ userId: 1, createdAt: -1 });
db.activityLogs.createIndex({ type: 1, createdAt: -1 });
db.activityLogs.createIndex({ groupId: 1, createdAt: -1 }, { sparse: true });
```

---

### 2.9 `notifications`

In-app and push notification records.

| Field       | Type     | Required | Description                                                                                                                                          |
| :---------- | :------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| `_id`       | ObjectId | ✓        | —                                                                                                                                                    |
| `userId`    | ObjectId | ✓        | —                                                                                                                                                    |
| `type`      | Enum     | ✓        | `bet_won` \| `bet_lost` \| `deposit_confirmed` \| `withdrawal_completed` \| `group_invite` \| `market_settled` \| `winner_declared` \| `spin_reward` |
| `title`     | String   | ✓        | —                                                                                                                                                    |
| `message`   | String   | ✓        | —                                                                                                                                                    |
| `icon`      | String   | —        | Emoji icon                                                                                                                                           |
| `isRead`    | Boolean  | ✓        | Default: false                                                                                                                                       |
| `actionUrl` | String   | —        | Deep link                                                                                                                                            |
| `relatedId` | ObjectId | —        | Referenced entity                                                                                                                                    |
| `createdAt` | Date     | ✓        | —                                                                                                                                                    |
| `readAt`    | Date     | —        | —                                                                                                                                                    |

**Indexes:**

```javascript
db.notifications.createIndex({ userId: 1, isRead: 1, createdAt: -1 });
```

---

### 2.10 Supporting Collections

| Collection        | Purpose                      | Key Index                            |
| :---------------- | :--------------------------- | :----------------------------------- |
| `authSessions`    | JWT session tracking         | `(tokenHash: 1)`, TTL on `expiresAt` |
| `dailyLimits`     | Rolling 24h transaction caps | `(userId: 1, date: 1)` unique        |
| `complianceFlags` | Suspicious activity records  | `(userId: 1, status: 1)`             |
| `auditLogs`       | Admin action records         | `(adminUserId: 1, createdAt: -1)`    |
| `exchangeRates`   | Cached USD/KSH rates         | `(updatedAt: -1)`                    |
| `appConfig`       | Platform settings            | `(key: 1)` unique                    |
| `achievements`    | Gamification state per user  | `(userId: 1)` unique                 |

---

## 3. Relationships Diagram

```
users (1) ──────── (1) wallets
  │
  ├──── (N) transactions
  ├──── (N) marketBets ───── (1) publicMarkets
  ├──── (N) groupBetEntries ── (1) groupBets ── (1) bettingGroups
  ├──── (N) activityLogs
  ├──── (N) notifications
  ├──── (N) dailyLimits
  ├──── (N) complianceFlags
  └──── (N) bettingGroups.members[]
```

---

## 9. Technical Debt

> [!WARNING]
> **Prisma vs MongoDB Conflict**: `src/lib/prisma.ts` initializes a PrismaClient pointing at `DATABASE_URL`. All documentation and schema definitions use native MongoDB syntax. The backend must commit to ONE approach before implementation begins. Recommendation: Use native MongoDB driver with Mongoose for schema validation, OR migrate all schemas to Prisma format with MongoDB adapter.

---

**CONFIDENTIAL PROPERTY OF ANTE SOCIAL**
_Database Schema v2.0 | February 2026_
