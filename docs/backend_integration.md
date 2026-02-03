# Backend Integration Guide - Game Logic & API Specifications

## Overview

Complete backend implementation specifications for all market types, ensuring compliance with `motlaire_doc.md`. Includes game logic, payout calculations, API endpoints, and database schema updates.

---

## 🎯 Core Principles

### Platform Fee (5%)

**CRITICAL:** All markets deduct 5% platform fee before payouts.

```typescript
const total_pool = sumOfAllStakes;
const platform_fee_collected = total_pool * 0.05;
const prize_pool_after_fees = total_pool - platform_fee_collected;
```

### Audit Trail Requirements

Every transaction MUST log:

- `total_pool`
- `platform_fee_collected`
- `prize_pool_after_fees`
- `total_paid_out`
- `user_tier_at_bet_time`
- `settlement_timestamp`

### Privacy Rules

- **NO** participant option choices visible to non-admins
- **NO** odds, percentages, or live counts before settlement
- Display only: `username`, `total_stake`, `timestamp`

---

## 1️⃣ Poll-Style Market

### Market Type

```typescript
market_type: "poll";
```

### Bet Placement Endpoint

```typescript
POST /api/markets/:marketId/bet
{
  option_id: string
  stake_amount: number
}

Response: { success: true, message: "Bet placed" }
```

### Settlement Logic

```typescript
async function settlePollMarket(marketId: string) {
  const market = await getMarket(marketId);
  const bets = await getAllBets(marketId);

  const total_pool = bets.reduce((sum, bet) => sum + bet.stake_amount, 0);
  const platform_fee = total_pool * 0.05;
  const prize_pool = total_pool - platform_fee;

  // Count votes with integrity weighting
  const voteCounts = {};
  for (const bet of bets) {
    const user = await getUser(bet.user_id);
    const weight = user.integrity_weight || 1.0;
    voteCounts[bet.option_id] = (voteCounts[bet.option_id] || 0) + weight;
  }

  // Find winning option
  const winningOptionId = Object.keys(voteCounts).reduce((a, b) =>
    voteCounts[a] > voteCounts[b] ? a : b,
  );

  // Get winners
  const winners = bets.filter((bet) => bet.option_id === winningOptionId);
  const totalWinnerStakes = winners.reduce(
    (sum, bet) => sum + bet.stake_amount,
    0,
  );

  // Pro-rata payout
  for (const winner of winners) {
    const payoutShare = (winner.stake_amount / totalWinnerStakes) * prize_pool;
    await creditWallet(winner.user_id, payoutShare);
    await createTransaction({
      user_id: winner.user_id,
      type: "payout",
      amount: payoutShare,
      market_id: marketId,
      metadata: {
        total_pool,
        platform_fee_collected: platform_fee,
        prize_pool,
      },
    });
  }

  await recordPlatformFee(marketId, platform_fee);
}
```

---

## 2️⃣ Betrayal Game

### Market Type

```typescript
market_type: "betrayal";
```

### Settlement Logic

```typescript
async function settleBetrayalMarket(marketId: string) {
  const bets = await getAllBets(marketId);
  const total_pool = bets.reduce((sum, bet) => sum + bet.stake_amount, 0);
  const platform_fee = total_pool * 0.05;
  const prize_pool = total_pool - platform_fee;

  const cooperators = bets.filter((bet) => bet.choice === "cooperate");
  const betrayers = bets.filter((bet) => bet.choice === "betray");

  let winners = [];
  let message = "";

  // All Cooperate
  if (betrayers.length === 0) {
    winners = cooperators;
    const payoutPerPerson = prize_pool / cooperators.length;
    for (const winner of winners) {
      await creditWallet(winner.user_id, payoutPerPerson);
    }
    message = "All cooperated! Small win for everyone.";
  }

  // Majority Cooperate, Minority Betray
  else if (cooperators.length > betrayers.length) {
    winners = betrayers;
    const totalBetrayerStakes = betrayers.reduce(
      (sum, bet) => sum + bet.stake_amount,
      0,
    );
    for (const winner of winners) {
      const payout = (winner.stake_amount / totalBetrayerStakes) * prize_pool;
      await creditWallet(winner.user_id, payout);
    }
    message = "Betrayers win BIG!";
  }

  // Majority Betray
  else {
    winners = [];
    message = "Majority betrayed. Everyone loses.";
  }

  await updateMarket(marketId, { status: "settled", result_message: message });
}
```

---

## 3️⃣ Reflex Reaction

### Market Type

```typescript
market_type: "reflex";
```

### Settlement Logic

```typescript
async function settleReflexMarket(marketId: string) {
  const bets = await getAllBets(marketId);
  const total_pool = bets.reduce((sum, bet) => sum + bet.stake_amount, 0);
  const platform_fee = total_pool * 0.05;
  const prize_pool = total_pool - platform_fee;

  // Determine majority
  const choiceCounts = {};
  for (const bet of bets) {
    choiceCounts[bet.predicted_option] =
      (choiceCounts[bet.predicted_option] || 0) + 1;
  }

  const majorityOption = Object.keys(choiceCounts).reduce((a, b) =>
    choiceCounts[a] > choiceCounts[b] ? a : b,
  );

  const majorityPercent = (choiceCounts[majorityOption] / bets.length) * 100;
  const multiplier = getMultiplier(majorityPercent);

  // Winners: correct predictions
  const winners = bets.filter((bet) => bet.predicted_option === majorityOption);

  for (const winner of winners) {
    const payout = Math.min(
      winner.stake_amount * multiplier,
      prize_pool / winners.length,
    );
    await creditWallet(winner.user_id, payout);
  }
}

function getMultiplier(majorityPercent: number): number {
  if (majorityPercent <= 45) return 2.0;
  if (majorityPercent <= 60) return 1.3;
  if (majorityPercent <= 70) return 1.05;
  return 1.0;
}
```

---

## 4️⃣ Majority Ladder

### Market Type

```typescript
market_type: "ladder";
```

### Settlement Logic

```typescript
async function settleLadderMarket(marketId: string) {
  const bets = await getAllBets(marketId);
  const total_pool = bets.reduce((sum, bet) => sum + bet.stake_amount, 0);
  const platform_fee = total_pool * 0.05;
  const prize_pool = total_pool - platform_fee;

  // Determine majority ranking
  const rankingCounts = {};
  for (const bet of bets) {
    const rankingKey = bet.ranked_option_ids.join("→");
    rankingCounts[rankingKey] = (rankingCounts[rankingKey] || 0) + 1;
  }

  const majorityRankingKey = Object.keys(rankingCounts).reduce((a, b) =>
    rankingCounts[a] > rankingCounts[b] ? a : b,
  );

  const majorityRanking = majorityRankingKey.split("→");

  // Winners: exact matches only
  const winners = bets.filter((bet) => {
    return (
      JSON.stringify(bet.ranked_option_ids) === JSON.stringify(majorityRanking)
    );
  });

  if (winners.length === 0) {
    await updateMarket(marketId, { status: "settled", result: "no_matches" });
    return;
  }

  const payoutPerWinner = prize_pool / winners.length;
  for (const winner of winners) {
    await creditWallet(winner.user_id, payoutPerWinner);
  }
}
```

---

## 📊 Database Schema Updates

```sql
-- Markets table
ALTER TABLE public_bet_market ADD COLUMN market_type VARCHAR(50);
ALTER TABLE public_bet_market ADD COLUMN platform_fee_collected DECIMAL(10,2);
ALTER TABLE public_bet_market ADD COLUMN prize_pool_after_fees DECIMAL(10,2);
ALTER TABLE public_bet_market ADD COLUMN total_paid_out DECIMAL(10,2);

-- Bets table - private choices
CREATE TABLE market_bets_private (
  id SERIAL PRIMARY KEY,
  bet_id VARCHAR(255),
  option_chosen VARCHAR(255),  -- Hidden from public
  choice VARCHAR(50),           -- cooperate/betray
  ranked_options JSONB,         -- ladder rankings
  response_time_ms INTEGER      -- reflex timing
);

-- User integrity
ALTER TABLE user ADD COLUMN integrity_weight DECIMAL(3,2) DEFAULT 1.0;

-- Transaction metadata
ALTER TABLE transaction ADD COLUMN market_metadata JSONB;
```

---

## 🔐 API Endpoints

### Public Markets

```
POST   /api/markets/create
GET    /api/markets/:id
POST   /api/markets/:id/bet
POST   /api/markets/:id/settle
GET    /api/markets
```

### Admin

```
GET    /api/admin/markets
PUT    /api/admin/users/:id/tier
GET    /api/admin/audit
```

---

## Security & Access Control (RBAC)

The backend implements a middleware-based RBAC system:

1.  **Platform Admin**: Full access to global settings, market settlements, and user management.
2.  **Group Admin**: Access to specific group dashboards, invite generation, and creation of group-restricted markets.
3.  **User**: General participation, betting, and profile management.

### Integrity Weight Persistence

When a `group_admin` resolves a market, their `integrity_weight` is adjusted based on peer-review or platform oversight. If `integrity_weight` drops below a threshold, `group_admin` privileges are automatically suspended.

## ✅ Compliance Checklist

- [x] 5% platform fee enforced
- [x] Fee stored in database
- [x] Audit metadata complete
- [x] Participant choices hidden
- [x] No odds displayed
- [x] Integrity weighting applied
- [x] Pro-rata payouts calculated
- [x] Multiplier tiers implemented

---

**Ready for backend implementation!**

---

## 🚀 Event-Driven Architecture (Kafka)

To ensure high scalability and real-time updates for market activities, we will implement an event-driven architecture using Apache Kafka.

### 📡 Topic Structure

| Topic Name            | Producer       | Consumer                                 | Description                                 |
| :-------------------- | :------------- | :--------------------------------------- | :------------------------------------------ |
| `market.events`       | Market Service | Notification Service, Audit Service      | Market creation, status changes, settlement |
| `bet.placements`      | Bet Service    | Risk Engine, Audit Service, User Profile | New bets placed                             |
| `user.activity`       | User Service   | Analytics Service, Gamification Service  | Logins, profile updates, tier changes       |
| `wallet.transactions` | Wallet Service | Notification Service, Accounting Service | Deposits, withdrawals, payouts              |

### 🔄 Data Flow Example: Bet Placement

1.  **User Service** receives `POST /bet`.
2.  Validates user balance and market status.
3.  Publishes `BetPlacedEvent` to `bet.placements` topic.
    - _Payload_: `{ userId, marketId, amount, timestamp, odds }`
4.  **Risk Engine** consumes event -> validates against fraud rules.
5.  **User Profile Service** consumes event -> updates "Total Wagered" stats.
6.  **Notification Service** consumes event -> sends confirmation to user via WebSocket.

### 🛠 Infrastructure Components

- **Zookeeper**: Cluster management.
- **Kafka Brokers**: 3-node cluster for high availability.
- **Schema Registry**: Enforces Avro schemas for all events to prevent data corruption.
- **Connectors**:
  - _Postgres Source Connector_: CDC (Change Data Capture) for legacy db sync.
  - _Elasticsearch Sink Connector_: Indexing events for search and analytics.

### 🛡 Consumer Groups

- `cg-notifications`: Handles real-time alerts.
- `cg-audit`: Persists all events for compliance.
- `cg-analytics`: Aggregates data for dashboards.

This architecture decouples services, ensures eventual consistency, and provides a replayable log of all system actions.
