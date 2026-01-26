# ante-social - Frontend Implementation Guide

## Executive Overview

ante-social is a betting market platform focused on poll-style betting with Motlaire Points (MP) as the virtual currency. The platform features public betting markets where users can place bets on various outcomes, with dynamic weighting for early bettors and a comprehensive admin panel for market management.

**Key Characteristics:**

- Points-based virtual currency system (no real money)
- Poll-style betting markets with multiple outcomes
- Daily leaderboard and user rankings
- Early bettor advantage with dynamic payout weighting
- Manual admin settlement and verification
- Clean, modern UI with mobile-first design

---

## Table of Contents

1.  [Technology Stack](#-technology-stack)
2.  [Database Schema (Prisma + MongoDB)](#️-database-schema-prisma--mongodb)
3.  [Authentication & Authorization](#-authentication--authorization)
4.  [User Features](#-user-features)
5.  [Admin Features](#-admin-features)
6.  [Business Logic & Rules](#-business-logic--rules)
7.  [UI/UX Implementation](#-uiux-implementation)
8.  [API Routes & Backend](#-api-routes--backend)
9.  [Integrations & External Services](#-integrations--external-services)
10. [Setup & Configuration](#-setup--configuration)
11. [Deployment Guide](#-deployment-guide)

---

## 💻 Technology Stack

### Frontend

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** Shadcn UI
- **Icons:** Lucide React
- **State Management:** React Query (TanStack Query)
- **Date Handling:** date-fns
- **Forms:** React Hook Form
- **Animations:** Framer Motion

### Backend

- **Framework:** Next.js API Routes
- **Database:** MongoDB
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Email:** Resend or SendGrid

### Infrastructure

- **Hosting:** Vercel (recommended) or any Node.js platform
- **Database:** MongoDB Atlas
- **File Storage:** Vercel Blob or AWS S3
- **Environment:** Node.js 18+

---

## ️✔️ Database Schema (Prisma + MongoDB)

### User Model

```prisma
model User {
  id                    String    @id @default(auto()) @map("_id") @db.ObjectId
  email                 String    @unique
  emailVerified         DateTime?
  full_name             String?
  username              String?   @unique
  avatar_url            String?
  role                  String    @default("user") // "user" or "admin"

  // Account settings
  user_level            String    @default("novice") // "novice" or "high_roller"
  kyc_status            String?   // "none", "pending", "approved", "rejected"
  email_verified        Boolean   @default(false)

  // Notification preferences
  notification_email    Boolean   @default(true)
  notification_push     Boolean   @default(true)

  // Timezone
  timezone              String    @default("UTC")

  // Timestamps
  created_date          DateTime  @default(now())
  updated_date          DateTime  @updatedAt

  // Relations
  wallet                Wallet?
  marketParticipants    MarketParticipant[]
  transactions          Transaction[]
  notifications         UserNotification[]

  @@map("users")
}
```

### Wallet Model

```prisma
model Wallet {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  user_id         String   @unique @db.ObjectId
  user            User     @relation(fields: [user_id], references: [id], onDelete: Cascade)

  balance         Float    @default(500) // Default 500 MP for new users
  total_deposits  Float    @default(0)
  total_winnings  Float    @default(0)
  total_losses    Float    @default(0)

  version         Int      @default(1) // Optimistic locking
  is_frozen       Boolean  @default(false)
  frozen_reason   String?
  frozen_at       DateTime?

  created_date    DateTime @default(now())
  updated_date    DateTime @updatedAt

  @@map("wallets")
}
```

### PublicBetMarket Model

```prisma
model PublicBetMarket {
  id                        String    @id @default(auto()) @map("_id") @db.ObjectId

  // Basic Info
  title                     String
  description               String
  tags                      String[]  @default([])

  // Betting Configuration
  bet_type                  String    @default("poll_style") // Only "poll_style" supported
  market_duration           String    @default("daily") // "daily" or "weekly"
  buy_in_amount             Float
  min_participants          Int       @default(2)
  max_participants          Int?

  // Timing
  start_time                DateTime?
  close_time                DateTime
  settlement_time           DateTime
  scheduled_publish_time    DateTime?

  // Status
  status                    String    @default("draft") // "draft", "scheduled", "published", "active", "closed", "settling", "settled", "cancelled"

  // Settlement
  settlement_method         String    @default("admin_report") // "external_api" or "admin_report"
  external_api_endpoint     String?

  // Odds Configuration
  odds_type                 String    @default("pari_mutuel") // "fixed" or "pari_mutuel"
  fixed_odds                Json?

  // Geographic Restrictions
  regions_allowed           String[]  @default([])
  regions_blocked           String[]  @default([])
  age_restriction           Int       @default(18)
  requires_identity_check   Boolean   @default(false)

  // Market Stats
  total_pool                Float     @default(0)
  participant_count         Int       @default(0)
  winning_outcome_id        String?   @db.ObjectId

  // Admin Settlement
  admin_report              String?
  reported_at               DateTime?
  reported_by               String?   @db.ObjectId
  confirmations_needed      Int       @default(0)
  confirmations_received    Int       @default(0)

  // Compliance & Flags
  is_flagged                Boolean   @default(false)
  compliance_hold           Boolean   @default(false)
  hold_reason               String?

  // Financial
  payout_processed          Boolean   @default(false)
  platform_fee_collected    Float?
  prize_pool_after_fees     Float?

  // Media
  media_url                 String?
  media_type                String    @default("none") // "image", "gif", "video", "none"

  // Metadata
  created_by                String?   @db.ObjectId
  last_edited_by            String?   @db.ObjectId
  assigned_market_makers    String[]  @default([]) @db.ObjectId
  recurring_template_id     String?   @db.ObjectId

  // Soft Delete
  is_deleted                Boolean   @default(false)
  deleted_at                DateTime?
  deleted_by                String?   @db.ObjectId

  // Optimistic Locking
  version                   Int       @default(1)

  // Timestamps
  created_date              DateTime  @default(now())
  updated_date              DateTime  @updatedAt

  // Relations
  outcomes                  MarketOutcome[]
  participants              MarketParticipant[]

  @@map("public_bet_markets")
}
```

### MarketOutcome Model

```prisma
model MarketOutcome {
  id                  String           @id @default(auto()) @map("_id") @db.ObjectId
  market_id           String           @db.ObjectId
  market              PublicBetMarket  @relation(fields: [market_id], references: [id], onDelete: Cascade)

  option_text         String
  participant_count   Int              @default(0)
  total_amount        Float            @default(0)
  fixed_odds          Float?
  is_winning_outcome  Boolean          @default(false)
  payout_per_winner   Float            @default(0)

  // Media
  media_url           String?
  media_type          String           @default("none") // "image", "gif", "video", "none"

  created_date        DateTime         @default(now())
  updated_date        DateTime         @updatedAt

  // Relations
  participants        MarketParticipant[]

  @@map("market_outcomes")
}
```

### MarketParticipant Model

```prisma
model MarketParticipant {
  id                    String           @id @default(auto()) @map("_id") @db.ObjectId
  market_id             String           @db.ObjectId
  market                PublicBetMarket  @relation(fields: [market_id], references: [id], onDelete: Cascade)

  user_id               String           @db.ObjectId
  user                  User             @relation(fields: [user_id], references: [id], onDelete: Cascade)

  selected_outcome_id   String           @db.ObjectId
  outcome               MarketOutcome    @relation(fields: [selected_outcome_id], references: [id], onDelete: Cascade)

  amount_contributed    Float
  quantity              Int              @default(1)

  // Bet Context Snapshot (immutable at time of bet)
  bet_context_snapshot  Json? // Stores payout_weight, dominance, early_bettor status, etc.

  potential_payout      Float?
  actual_payout         Float            @default(0)
  is_winner             Boolean          @default(false)
  payout_processed      Boolean          @default(false)

  confirmed_outcome     Boolean?

  // User Info Cache
  identity_verified     Boolean          @default(false)
  region                String?
  full_name_cached      String?
  username_cached       String?

  created_date          DateTime         @default(now())
  updated_date          DateTime         @updatedAt

  @@map("market_participants")
}
```

### Transaction Model

```prisma
model Transaction {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  user_id     String   @db.ObjectId
  user        User     @relation(fields: [user_id], references: [id], onDelete: Cascade)

  type        String   // "deposit", "withdrawal", "bet_entry", "payout", "refund"
  amount      Float
  description String
  status      String   @default("completed") // "pending", "completed", "failed"

  bet_pool_id String?  @db.ObjectId

  created_date DateTime @default(now())
  updated_date DateTime @updatedAt

  @@map("transactions")
}
```

### UserNotification Model

```prisma
model UserNotification {
  id                 String   @id @default(auto()) @map("_id") @db.ObjectId
  user_id            String   @db.ObjectId
  user               User     @relation(fields: [user_id], references: [id], onDelete: Cascade)

  notification_type  String   // "bet_placed", "market_closing_soon", "payout_received", etc.
  title              String
  message            String

  market_id          String?  @db.ObjectId
  market_title       String?
  amount             Float?

  is_read            Boolean  @default(false)
  metadata           Json?

  created_date       DateTime @default(now())
  updated_date       DateTime @updatedAt

  @@map("user_notifications")
}
```

### AdminActivity Model

```prisma
model AdminActivity {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  admin_user_id   String   @db.ObjectId

  action_type     String   // "market_created", "market_edited", "outcome_reported", etc.
  entity_type     String   // "market", "user", "payout", "system"
  entity_id       String?  @db.ObjectId

  description     String
  reason          String?
  metadata        Json?

  ip_address      String?
  user_agent      String?

  created_date    DateTime @default(now())

  @@map("admin_activities")
}
```

### AuditLog Model

```prisma
model AuditLog {
  id                  String   @id @default(auto()) @map("_id") @db.ObjectId
  sequence_number     Int      @unique
  timestamp           DateTime @default(now())

  event_type          String   // "bet_placement", "payout", "market_settled", etc.
  actor_id            String   @db.ObjectId
  actor_type          String   @default("user") // "user", "admin", "system"

  entity_type         String?
  entity_id           String?  @db.ObjectId

  action              String
  before_state        Json?
  after_state         Json?

  amount_cents        Int?

  related_entity_type String?
  related_entity_id   String?  @db.ObjectId

  metadata            Json?
  ip_address          String?
  user_agent          String?

  // Chain Integrity
  previous_hash       String?
  current_hash        String?
  verification_status String   @default("unverified") // "unverified", "verified", "tampered"

  @@map("audit_logs")
}
```

### RecurringMarketTemplate Model

```prisma
model RecurringMarketTemplate {
  id                    String   @id @default(auto()) @map("_id") @db.ObjectId

  title_template        String   // e.g., "Daily Market - {date}"
  description_template  String

  recurrence_pattern    String   // "daily", "weekly", "custom"
  custom_cron           String?  // Cron expression for custom patterns

  bet_type              String   @default("poll_style")
  buy_in_amount         Float
  market_duration       String   @default("daily")

  outcomes              Json     // Array of outcome options

  is_active             Boolean  @default(true)

  created_by            String   @db.ObjectId
  created_date          DateTime @default(now())
  updated_date          DateTime @updatedAt

  @@map("recurring_market_templates")
}
```

---

## 🔐 Authentication & Authorization

### Authentication Flow (NextAuth.js)

Setup NextAuth:

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.username = user.username;
        session.user.email_verified = user.emailVerified !== null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-email",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### Authorization Middleware

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "admin";
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    // Protect admin routes
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Email verification check (except for verify-email page)
    if (
      token &&
      !token.email_verified &&
      !req.nextUrl.pathname.startsWith("/verify-email")
    ) {
      return NextResponse.redirect(new URL("/verify-email", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*", "/notifications/:path*"],
};
```

### Role-Based Access Control

**User Roles:**

- `user` - Standard user (default)
- `admin` - Full admin access

**Admin Permission Check:**

```typescript
// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }

  return session;
}
```

---

## 🧑‍💻 User Features

### 1. Dashboard (Home Page)

**Location:** `/` or `/dashboard`

**Features:**

- Welcome message with username display.
- User stats cards:
  - Total Bets (count)
  - Points Balance (MP)
  - Total Winnings (MP)
  - Win Rate (percentage)
- "Hall of the Unreasonably Lucky" leaderboard card:
  - Top 3 daily winners with mystical remarks.
  - Current user's rank.
  - Link to full leaderboard page.
- Active markets grid with filtering:
  - All Markets tab
  - Recurring Weekly Markets tab
  - One-Time Markets tab
- Each market card shows:
  - Media (image/gif/video) or placeholder.
  - Title and description.
  - Time remaining until close.
  - Total pool and participant count.
  - "Join Bet" button (disabled if scheduled or closed).
- Auto-refresh every 60 seconds.
- Manual refresh button.
- Countdown timers for market closing.

**Key Functions:**

```javascript
// Load markets
const loadMarkets = async () => {
  const markets = await fetch("/api/markets/active").then((r) => r.json());
  // Filter by status and close_time
  return markets;
};

// Load user stats
const loadUserStats = async (userId) => {
  const participants = await fetch(`/api/participants/user/${userId}`).then(
    (r) => r.json()
  );
  const wallet = await fetch(`/api/wallet/${userId}`).then((r) => r.json());

  return {
    totalBets: participants.length,
    pointsBalance: wallet.balance,
    totalWinnings: participants.reduce((sum, p) => sum + p.actual_payout, 0),
    winRate: calculateWinRate(participants),
  };
};

// Load daily leaderboard
const loadLeaderboard = async () => {
  return fetch("/api/leaderboard/daily").then((r) => r.json());
};
```

### 2. Market Details & Betting

**Location:** `/markets/[id]`

**Features:**

- Market header with media, title, description.
- Market info cards:
  - Total pool
  - Participant count
  - Time remaining
  - Buy-in amount
- Betting options grid (outcomes).
- Each outcome shows:
  - Option text
  - Media (if available)
  - Current votes/bets
  - Selection state
- Bet placement form:
  - Outcome selection (single choice)
  - Quantity selector (number of stakes)
  - Total cost display
  - Wallet balance check
  - "Place Bet" button
- User's active bets section.
- Recent participants live ticker.
- Success modal after bet placement.

**Bet Placement Logic:**

```javascript
// Place bet API call
async function placeBet(marketId, outcomeId, quantity) {
  const response = await fetch("/api/bets/place", {
    method: "POST",
    body: JSON.stringify({
      market_id: marketId,
      outcome_id: outcomeId,
      quantity: quantity,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}
```

**Backend Bet Processing (Critical):**

```typescript
// app/api/bets/place/route.ts
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { market_id, outcome_id, quantity } = await req.json();
  const userId = session.user.id;

  // 1. Validate market status
  const market = await prisma.publicBetMarket.findUnique({
    where: { id: market_id },
    include: { outcomes: true },
  });

  if (!market || market.status !== "active") {
    return Response.json({ error: "Market not available" }, { status: 400 });
  }

  if (new Date() >= new Date(market.close_time)) {
    return Response.json({ error: "Market closed" }, { status: 400 });
  }

  // 2. Check user wallet
  const wallet = await prisma.wallet.findUnique({
    where: { user_id: userId },
  });

  const totalCost = market.buy_in_amount * quantity;

  if (!wallet || wallet.balance < totalCost) {
    return Response.json({ error: "Insufficient balance" }, { status: 400 });
  }

  // 3. Build bet context snapshot (for early bettor weighting)
  const betContext = await buildBetContext(market, outcome_id, quantity);

  // 4. Create transaction (atomic)
  const result = await prisma.$transaction(async (tx) => {
    // Deduct from wallet
    await tx.wallet.update({
      where: { user_id: userId },
      data: { balance: { decrement: totalCost } },
    });

    // Create transaction record
    await tx.transaction.create({
      data: {
        user_id: userId,
        type: "bet_entry",
        amount: totalCost,
        description: `Bet on ${market.title}`,
        bet_pool_id: market_id,
      },
    });

    // Create participant record
    const participant = await tx.marketParticipant.create({
      data: {
        market_id,
        user_id: userId,
        selected_outcome_id: outcome_id,
        amount_contributed: totalCost,
        quantity,
        bet_context_snapshot: betContext,
        username_cached: session.user.username,
        full_name_cached: session.user.full_name,
      },
    });

    // Update market stats
    await tx.publicBetMarket.update({
      where: { id: market_id },
      data: {
        total_pool: { increment: totalCost },
        participant_count: { increment: 1 },
      },
    });

    // Update outcome stats
    await tx.marketOutcome.update({
      where: { id: outcome_id },
      data: {
        total_amount: { increment: totalCost },
        participant_count: { increment: 1 },
      },
    });

    return participant;
  });

  // 5. Create notification
  await prisma.userNotification.create({
    data: {
      user_id: userId,
      notification_type: "bet_placed",
      title: "Bet Placed Successfully",
      message: `You placed ${quantity} bet(s) on "${market.title}"`,
      market_id,
      market_title: market.title,
      amount: totalCost,
    },
  });

  return Response.json({ success: true, participant: result });
}

// Build bet context for early bettor weighting
async function buildBetContext(market, outcomeId, quantity) {
  const now = new Date();
  const startTime = market.start_time
    ? new Date(market.start_time)
    : new Date(market.created_date);
  const closeTime = new Date(market.close_time);

  const hoursSinceStart =
    (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  const totalDuration =
    (closeTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

  // Early bettor logic
  let isEarlyBettor = false;
  let earlyBettorReason = "";

  if (market.market_duration === "daily") {
    // First 4 hours = early
    if (hoursSinceStart < 4) {
      isEarlyBettor = true;
      earlyBettorReason = "Bet placed within first 4 hours";
    }
  } else if (market.market_duration === "weekly") {
    // First 24 hours = early
    if (hoursSinceStart < 24) {
      isEarlyBettor = true;
      earlyBettorReason = "Bet placed within first 24 hours";
    }
  }

  // Dominance calculation (how popular this outcome is)
  const outcome = market.outcomes.find((o) => o.id === outcomeId);
  const dominanceAtEntry =
    market.participant_count > 0
      ? (outcome.participant_count / market.participant_count) * 100
      : 0;

  // Payout weight (early bettors get 1.5x, others 1.0x)
  const payoutWeight = isEarlyBettor ? 1.5 : 1.0;
  const weightedAmount = market.buy_in_amount * quantity * payoutWeight;

  return {
    payout_weight: payoutWeight,
    dominance_at_entry: dominanceAtEntry,
    weighted_amount: weightedAmount,
    total_market_participants: market.participant_count,
    total_market_stake: market.total_pool,
    option_participant_count: outcome.participant_count,
    option_total_stake: outcome.total_amount,
    is_early_bettor: isEarlyBettor,
    early_bettor_reason: earlyBettorReason,
    market_duration: market.market_duration,
    hours_since_market_start: hoursSinceStart,
    weighting_triggered: isEarlyBettor,
    snapshot_timestamp: now.toISOString(),
  };
}
```

### 3. Wallet

**Location:** `/wallet`

**Features:**

- Current balance display (MP).
- Transaction history list:
  - Transaction type icon
  - Description
  - Amount (+ or -)
  - Date
  - Status badge
- Filter by transaction type.
- Pagination.
- **Note:** Deposits and withdrawals are marked as "Coming Soon" - no active functionality.

### 4. Profile

**Location:** `/profile`

**Features:**

- Avatar upload/display.
- Username management (one-time selection, permanent).
- Full name (private, required).
- Email display (read-only).
- Account creation date.
- User level badge (Novice or High-Roller).
- Notification preferences:
  - Email notifications toggle
  - Push notifications toggle
- Timezone selector.
- Sign out button.
- Links to Terms & Conditions and Privacy Policy.

**Username Selection Flow:**

```javascript
// Username is permanent once set
async function setUsername(username) {
  // Validate format (alphanumeric, 3-20 chars, no spaces)
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    throw new Error("Invalid username format");
  }

  // Check uniqueness
  const existing = await prisma.user.findUnique({
    where: { username },
  });

  if (existing) {
    throw new Error("Username already taken");
  }

  // Update user
  await prisma.user.update({
    where: { id: userId },
    data: { username },
  });

  // Sync to group members (if applicable)
  await syncUserDataToGroupMembers(userId);
}
```

### 5. Leaderboard

**Location:** `/leaderboard`

**Features:**

- Daily rankings based on payouts received that day.
- Top performers with:
  - Rank number
  - Username
  - Points earned today
  - Mystical remark for top 3
- Current user's rank highlighted.
- Resets daily at midnight UTC.

**Daily Leaderboard Calculation:**

```typescript
// app/api/leaderboard/daily/route.ts
export async function GET() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  // Get all payout transactions for today
  const payouts = await prisma.transaction.findMany({
    where: {
      type: "payout",
      created_date: {
        gte: today,
        lt: tomorrow,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
        },
      },
    },
  });

  // Aggregate by user
  const userEarnings = payouts.reduce((acc, tx) => {
    const userId = tx.user_id;
    if (!acc[userId]) {
      acc[userId] = {
        user_id: userId,
        username: tx.user.username || "Anonymous",
        total_earned: 0,
        payout_count: 0,
      };
    }
    acc[userId].total_earned += tx.amount;
    acc[userId].payout_count += 1;
    return acc;
  }, {});

  // Sort by earnings
  const leaderboard = Object.values(userEarnings).sort(
    (a, b) => b.total_earned - a.total_earned
  );

  return Response.json({
    date: today.toISOString().split("T")[0],
    leaderboard,
    top3: leaderboard.slice(0, 3),
  });
}
```

### 6. Notifications

**Location:** `/notifications`

**Features:**

- Notification list with filters:
  - All
  - Unread
  - Read
- Each notification shows:
  - Type icon
  - Title
  - Message
  - Timestamp
  - Read/unread indicator
- Mark as read functionality.
- Pagination.
- Real-time unread count in sidebar.

---

## 🛡️ Admin Features

### 1. Admin Dashboard

**Location:** `/admin`
**Access:** Admin role required

**Features:**

- Overview stats cards:
  - Total markets
  - Active markets
  - Total users
  - Platform revenue (fees collected)
- Quick actions:
  - Create new market
  - View pending settlements
  - Financial overview
  - User management
- Flagged markets alert.
- Recent markets list with filters.
- Recent admin activity feed.
- Real-time data refresh.

### 2. Market Editor

**Location:** `/admin/markets/new` or `/admin/markets/[id]/edit`

**Features:**

- Market creation/editing form with tabs:
  - **Basic Info:** Title, Description, Tags, Media upload.
  - **Betting Configuration:** Buy-in amount, Market duration, Min/max participants.
  - **Timing:** Start, Close, Settlement, Scheduled publish times.
  - **Outcomes:** Add multiple outcome options with text and optional media.
  - **Settlement:** Method (admin_report only).
  - **Status:** Draft, Scheduled, Published, etc.
- **Validation:** At least 2 outcomes, correct time sequence, positive buy-in.
- Save as draft or publish immediately.

**Market Creation API:**

```typescript
// app/api/admin/markets/route.ts
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await requireAdmin();
  const data = await req.json();

  if (!data.outcomes || data.outcomes.length < 2) {
    return Response.json(
      { error: "At least 2 outcomes required" },
      { status: 400 }
    );
  }

  const market = await prisma.publicBetMarket.create({
    data: {
      title: data.title,
      description: data.description,
      tags: data.tags || [],
      buy_in_amount: data.buy_in_amount,
      market_duration: data.market_duration || "daily",
      // ... other fields
      created_by: session.user.id,
      outcomes: {
        create: data.outcomes.map((outcome) => ({
          option_text: outcome.option_text,
          media_url: outcome.media_url,
          media_type: outcome.media_type || "none",
        })),
      },
    },
    include: { outcomes: true },
  });

  // Log admin activity
  await prisma.adminActivity.create({
    data: {
      admin_user_id: session.user.id,
      action_type: "market_created",
      entity_type: "market",
      entity_id: market.id,
      description: `Created market: ${market.title}`,
    },
  });

  return Response.json(market);
}
```

### 3. Market Manager

**Location:** `/admin/markets`

**Features:**

- Comprehensive market list with advanced filters.
- Bulk actions (Publish, Close, Flag, Delete).
- Individual market actions (Edit, View, Report Outcome, etc.).
- Market status badges, sorting, and pagination.

### 4. Market Settlement

**Location:** Triggered from Market Manager or `/admin/settlements`

**Settlement Flow:**

1.  **Admin Reports Outcome:** Selects winning outcome, adds notes, confirms.
2.  **Payout Calculation:** The backend calculates payouts based on early bettor advantage.

```typescript
// app/api/admin/markets/[id]/settle/route.ts
async function processSettlement(marketId, winningOutcomeId) {
  const market = await prisma.publicBetMarket.findUnique({
    where: { id: marketId },
    include: {
      outcomes: true,
      participants: true,
    },
  });

  // Mark winning outcome
  await prisma.marketOutcome.update({
    where: { id: winningOutcomeId },
    data: { is_winning_outcome: true },
  });

  const winners = market.participants.filter(
    (p) => p.selected_outcome_id === winningOutcomeId
  );

  if (winners.length === 0) {
    await processRefunds(market.participants);
    return;
  }

  // Calculate platform fee (5%) and prize pool
  const platformFee = market.total_pool * 0.05;
  const prizePool = market.total_pool - platformFee;

  // Calculate total weighted amount for winners
  const totalWeightedAmount = winners.reduce((sum, w) => {
    const context = w.bet_context_snapshot;
    return sum + (context?.weighted_amount || w.amount_contributed);
  }, 0);

  // Process payouts in a transaction
  await prisma.$transaction(async (tx) => {
    for (const winner of winners) {
      const context = winner.bet_context_snapshot;
      const weightedAmount =
        context?.weighted_amount || winner.amount_contributed;
      const payoutShare = (weightedAmount / totalWeightedAmount) * prizePool;

      // Update participant, wallet, create transaction, and notify user
      // ... (implementation details from prompt)
    }

    // Update market status to 'settled'
    await tx.publicBetMarket.update({
      where: { id: marketId },
      data: {
        status: "settled",
        winning_outcome_id: winningOutcomeId,
        payout_processed: true,
        platform_fee_collected: platformFee,
        prize_pool_after_fees: prizePool,
      },
    });
  });
}

async function processRefunds(participants) {
  // ... (implementation details from prompt)
}
```

### 5. Financial Overview

**Location:** `/admin/financials`
**Features:** Platform revenue stats, market financial stats, user financial stats, and CSV export.

### 6. User Management

**Location:** `/admin/users`
**Features:** User list with search/filters, detailed user view, and admin actions (update role, freeze wallet, etc.).

### 7. Audit Logs

**Location:** `/admin/audit-logs`
**Features:** Comprehensive, filterable log of all significant system and user actions.

### 8. Recurring Market Templates

**Location:** `/admin/recurring-markets`
**Features:** Create templates for daily/weekly markets that are generated automatically via a cron job.

**Cron Job for Recurring Markets:**

```typescript
// lib/cron/generateRecurringMarkets.ts
export async function generateRecurringMarkets() {
  const templates = await prisma.recurringMarketTemplate.findMany({
    where: { is_active: true },
  });

  for (const template of templates) {
    const shouldGenerate = checkRecurrencePattern(template);

    if (shouldGenerate) {
      // ... (logic to create a new market from the template)
    }
  }
}
```

---

## 📜 Business Logic & Rules

### Points System

- **Starting Balance:** 500 MP for all new users.
- **Currency:** Motlaire Points (MP) - virtual, no real money value.
- **Earning/Spending:** Win bets to earn, place bets to spend.

### Betting Rules

- **Market Access:** Guests view, authenticated/verified users bet.
- **Bet Placement:** Single outcome choice, multiple stakes allowed.
- **Early Bettor Advantage:**
  - **Daily markets:** 1.5x payout weight in the first 4 hours.
  - **Weekly markets:** 1.5x payout weight in the first 24 hours.
  - **Standard bettors:** 1.0x payout weight.
- **Payout Calculation:**
  - **Platform Fee:** 5% of the total pool.
  - **Prize Pool:** 95% distributed to winners.
  - **Winner's Share:** `(their_weighted_amount / total_weighted_amount) * prize_pool`.
- **No Winners:** Full refund to all participants.

### Market Lifecycle

`draft` → `scheduled` → `published` → `active` → `closed` → `settling` → `settled`
(A market can also be `cancelled`, which triggers refunds).

### Scheduled Market Activation

A cron job or scheduled task should run periodically to activate markets.

```typescript
// lib/cron/activateScheduledMarkets.ts
export async function activateScheduledMarkets() {
  const now = new Date();

  const marketsToActivate = await prisma.publicBetMarket.findMany({
    where: {
      status: { in: ["scheduled", "published"] },
      start_time: { lte: now },
    },
  });

  for (const market of marketsToActivate) {
    await prisma.publicBetMarket.update({
      where: { id: market.id },
      data: { status: "active" },
    });
  }
}
```

---

## 🎨 UI/UX Implementation

### Design System

**Colors (TailwindCSS):**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#000000", // Black
        secondary: "#6B7280", // Gray-500
        accent: "#3B82F6", // Blue-500
        success: "#10B981", // Green-500
        warning: "#F59E0B", // Amber-500
        error: "#EF4444", // Red-500
      },
    },
  },
};
```

**Typography:**

- **Font:** Inter (from Google Fonts)
- **Headings:** Bold, `font-medium` (700 weight)
- **Body:** Regular, `font-normal` (400 weight)
- **UI elements:** Medium, `font-medium` (500 weight)

**Spacing:**

- **Base unit:** 4px (Tailwind default `1` unit)
- **Container:** `max-w-7xl` (1280px)
- **Padding:** `p-4` (1rem) mobile, `md:p-8` (2rem) desktop

### Layout Structure

**App Layout (Root):**

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
```

**Main Layout (with Sidebar):**

```tsx
// components/layout/MainLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

export function MainLayout({ children, currentUser }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white">
      <Sidebar user={currentUser} currentPath={pathname} />

      <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
        <div className="p-4 md:p-8">{children}</div>
      </main>

      <MobileNav user={currentUser} currentPath={pathname} />
    </div>
  );
}
```

**Sidebar Component:**

```tsx
// components/layout/Sidebar.tsx
import Link from "next/link";
import {
  Home,
  Users,
  Wallet,
  User,
  Bell,
  Shield,
  LogOut,
  Lock,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { title: "Home", url: "/", icon: Home, requiresAuth: false },
  { title: "Wallet", url: "/wallet", icon: Wallet, requiresAuth: true },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
    requiresAuth: true,
  },
  { title: "Profile", url: "/profile", icon: User, requiresAuth: true },
];

export function Sidebar({ user, currentPath }) {
  const isAdmin = user?.role === "admin";

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 h-screen fixed top-0 left-0 bg-white">
      <div className="px-4 py-6">
        <Link href="/">
          {/* Replace with your logo component/image */}
          <span className="font-medium text-xl">ante-social</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.title}>
              <Link
                href={item.url}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-gray-100 ${
                  currentPath === item.url ? "bg-gray-100 font-medium" : ""
                }`}
              >
                <item.icon className="w-5 h-5 text-gray-600" />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}

          {isAdmin && (
            <li>
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100"
              >
                <Shield className="w-5 h-5 text-gray-600" />
                <span>Admin</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="px-2 pb-4 border-t border-gray-200 pt-4">
        {/* User profile and sign out button */}
      </div>
    </aside>
  );
}
```

---

Sections for **API Routes & Backend**, **Integrations**, **Setup**, and **Deployment** are detailed within the relevant feature and technology sections above. This document provides a comprehensive guide to start building.
