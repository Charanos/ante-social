# API_ENDPOINTS.md

**PROPRIETARY & CONFIDENTIAL — ANTE SOCIAL**
**Version 2.0 | February 2026**

---

## 1. API Design Principles

- **RESTful** with JSON request/response bodies
- **Authentication**: Bearer JWT (NextAuth.js issued)
- **Versioning**: `/api/v1/*` prefix for all endpoints
- **Rate limiting**: Tier-based (see Security doc)
- **Responses**: Consistent envelope format
- **Errors**: Structured error codes with human-readable messages

### Response Envelope

```json
// Success
{
  "success": true,
  "data": { /* response payload */ },
  "meta": { "page": 1, "perPage": 20, "total": 145 }
}

// Error
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Your wallet balance is insufficient for this transaction",
    "details": { "required": 100.0, "available": 45.5 }
  }
}
```

---

## 2. Authentication Endpoints

### `POST /api/v1/auth/register`

Create a new user account.

| Field         | Type   | Required | Description                      |
| :------------ | :----- | :------- | :------------------------------- |
| `username`    | string | ✓        | 3-20 alphanumeric + underscore   |
| `email`       | string | ✓        | Valid email address              |
| `password`    | string | ✓        | Min 8 chars, mixed case + number |
| `phoneNumber` | string | —        | +254 format                      |
| `dateOfBirth` | string | ✓        | ISO date, must be 18+            |
| `currency`    | string | ✓        | `USD` or `KSH`                   |

**Response (201):**

```json
{
  "user_id": "uuid",
  "username": "prophecy_king",
  "tier": "novice",
  "email_verification_sent": true
}
```

**Errors:** `409` — Username or email already taken. `400` — Under 18.

---

### `POST /api/v1/auth/login`

Standard email + password authentication.

**Response (200):** JWT token + user profile snapshot.

**2FA flow:** If `twoFactorEnabled === true`, initial login returns `{ requires_2fa: true, session_token: "..." }`. Client must follow up with `POST /api/v1/auth/2fa/verify`.

---

### `POST /api/v1/auth/2fa/setup`

Generate TOTP secret and QR code.

**Response (200):**

```json
{
  "secret": "base32-encoded-secret",
  "qr_code_url": "otpauth://totp/AnteSocial:user?secret=...",
  "backup_codes": ["ABC-123-DEF", ...] // 10 codes
}
```

---

### `POST /api/v1/auth/2fa/verify`

Verify 6-digit TOTP code or backup code.

**Request:** `{ "code": "123456" }` or `{ "backup_code": "ABC-123-DEF" }`

**Response (200):** Full JWT token on success.

---

### `POST /api/v1/auth/verify-email`

Verify email with 6-digit code.

**Request:** `{ "code": "123456" }`

---

### `POST /api/v1/auth/forgot-password`

Initiate password reset flow.

### `POST /api/v1/auth/reset-password`

Complete password reset with token.

---

## 3. User Endpoints

### `GET /api/v1/user/profile`

Get authenticated user's full profile.

**Response (200):**

```json
{
  "id": "uuid",
  "username": "prophecy_king",
  "email": "user@example.com",
  "tier": "novice",
  "reputationScore": 780,
  "signalAccuracy": 65.5,
  "totalVolume": 15000.0,
  "totalPnl": 2340.0,
  "followersCount": 42,
  "followingCount": 18,
  "isVerified": false,
  "avatarUrl": "https://...",
  "createdAt": "2026-01-15T..."
}
```

---

### `PATCH /api/v1/user/profile`

Update profile fields (username, bio, avatar, preferences).

---

### `GET /api/v1/user/activity`

Get authenticated user's activity feed.

**Query params:** `?page=1&perPage=20&type=bet_placed`

---

### `GET /api/v1/users/:userId/profile`

Get another user's **public** profile. Excludes email, phone, compliance data.

---

## 4. Wallet Endpoints

### `GET /api/v1/wallet`

Get user's wallet balances and daily limit status.

**Response (200):**

```json
{
  "balances": {
    "USD": { "available": 615.5, "pending": 200.0 },
    "KSH": { "available": 0.0, "pending": 0.0 }
  },
  "dailyLimits": {
    "deposit": { "used": 33113, "limit": 66225, "currency": "KSH" },
    "withdrawal": { "used": 0, "limit": 250, "currency": "USD" }
  }
}
```

---

### `POST /api/v1/wallet/deposit`

Initiate a deposit. For M-Pesa, this triggers Daraja STK Push to user's phone.

**Request:**

```json
{
  "amount": 5000,
  "currency": "KSH",
  "method": "mpesa",
  "phoneNumber": "+254712345678"
}
```

**Response (201) — M-Pesa STK Push initiated:**

```json
{
  "depositId": "uuid",
  "method": "mpesa",
  "status": "pending_user_action",
  "message": "M-Pesa payment prompt sent to your phone. Enter your PIN to complete.",
  "checkoutRequestId": "ws_CO_18022026...",
  "expiresAt": "2026-02-18T12:05:00Z"
}
```

**Response (201) — Crypto:**

```json
{
  "depositId": "uuid",
  "method": "usdt_trc20",
  "status": "awaiting_payment",
  "walletAddress": "T...",
  "expectedAmount": 50.0,
  "qrCode": "data:image/png;base64,...",
  "network": "TRC-20",
  "expiresAt": "2026-02-18T13:00:00Z"
}
```

---

### `POST /api/v1/wallet/mpesa/callback` _(Daraja STK Push webhook)_

Receives M-Pesa payment confirmation from Safaricom Daraja API. **Not called by frontend** — Safaricom's servers call this URL after user completes STK Push.

**Inbound payload (from Safaricom):**

```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "...",
      "CheckoutRequestID": "ws_CO_18022026...",
      "ResultCode": 0,
      "ResultDesc": "The service request is processed successfully.",
      "CallbackMetadata": {
        "Item": [
          { "Name": "Amount", "Value": 5000 },
          { "Name": "MpesaReceiptNumber", "Value": "SHC1ABCDEF" },
          { "Name": "TransactionDate", "Value": 20260218121500 },
          { "Name": "PhoneNumber", "Value": 254712345678 }
        ]
      }
    }
  }
}
```

**Server action on ResultCode 0:**

1. Credit user wallet (MongoDB transaction)
2. Create transaction record
3. Publish `WalletTransactionEvent` to Kafka
4. WebSocket: broadcast `wallet:updated` to `user:{userId}`

---

### `POST /api/v1/wallet/mpesa/b2c-result` _(Daraja B2C webhook)_

Receives withdrawal completion confirmation from Safaricom B2C API.

**Server action:** Marks withdrawal as `completed`, publishes event, notifies user.

---

### `POST /api/v1/wallet/mpesa/b2c-timeout` _(Daraja B2C timeout)_

Receives timeout notification if B2C request couldn't be processed.

**Server action:** Marks withdrawal as `failed`, refunds to wallet, notifies user.

---

### `POST /api/v1/wallet/crypto/ipn` _(NOWPayments IPN webhook)_

Receives crypto payment confirmation from NOWPayments.

---

### `POST /api/v1/wallet/withdraw`

Initiate withdrawal (triggers KYC if first time or >$500).

**Request:**

```json
{
  "amount": 200,
  "currency": "USD",
  "method": "mpesa",
  "phoneNumber": "+254712345678"
}
```

**Response (201):** Withdrawal request reference, estimated processing time.

---

### `GET /api/v1/wallet/transactions`

Transaction history with filtering.

**Query params:** `?page=1&perPage=20&type=deposit&status=completed`

---

## 5. Market Endpoints

### `GET /api/v1/markets`

List markets with filtering.

**Query params:**

- `?status=active|settled|all`
- `?type=consensus|reflex|ladder|prisoner_dilemma|syndicate`
- `?category=politics|sports|entertainment|...`
- `?sort=closing_soon|highest_pool|newest`
- `?page=1&perPage=20`

**Response (200):**

```json
{
  "markets": [
    {
      "id": "uuid",
      "type": "consensus",
      "title": "Best Nairobi Matatu Route",
      "description": "...",
      "image": "https://...",
      "category": "lifestyle",
      "status": "active",
      "totalPool": 2450.0,
      "participantCount": 47,
      "closesAt": "2026-02-20T18:00:00Z",
      "options": [
        { "optionId": "uuid", "text": "Route 46", "mediaUrl": "..." },
        { "optionId": "uuid", "text": "Route 33", "mediaUrl": "..." }
      ]
    }
  ],
  "meta": { "page": 1, "perPage": 20, "total": 145 }
}
```

**Privacy note:** `options[].voteCount` and `options[].totalStake` are **always null** for active markets. Only populated post-settlement.

---

### `GET /api/v1/markets/:id`

Get single market detail.

Same as list item but includes:

- `participants[]` — username, stake, timestamp (NOT option chosen)
- `results` — Full breakdown (only if status === "settled")
- `userPrediction` — The current user's prediction (if any)

---

### `POST /api/v1/markets/:id/predict`

Place a prediction on a public market.

**Request (Consensus/Reflex):**

```json
{
  "optionId": "uuid",
  "stake": 50.0,
  "currency": "USD"
}
```

**Request (Ladder):**

```json
{
  "rankedOptionIds": ["uuid-1", "uuid-3", "uuid-2", "uuid-4"],
  "stake": 50.0,
  "currency": "USD"
}
```

**Request (Prisoner's Dilemma):**

```json
{
  "choice": "cooperate",
  "stake": 50.0,
  "currency": "USD"
}
```

**Response (201):**

```json
{
  "predictionId": "uuid",
  "marketId": "uuid",
  "stake": 50.0,
  "editableUntil": "2026-02-20T12:35:00Z",
  "message": "Prediction placed successfully"
}
```

**Errors:**

- `409` — Already predicted on this market
- `400` — Market not active, insufficient balance, daily limit exceeded
- `422` — Invalid option ID, missing required fields

---

### `PATCH /api/v1/markets/:id/predict/:predictionId`

Edit prediction within 5-minute window.

**Request:** Same as POST (new option/ranking/choice).

**Errors:** `403` — Edit window expired.

---

### `DELETE /api/v1/markets/:id/predict/:predictionId`

Cancel prediction within 5-minute window. Refunds stake to wallet.

**Errors:** `403` — Cancel window expired.

---

### `POST /api/v1/markets/:id/settle`

Admin-only. Trigger manual settlement.

---

### `POST /api/v1/markets/create`

Admin-only. Create a new public market.

**Request:**

```json
{
  "type": "consensus",
  "title": "...",
  "description": "...",
  "category": "politics",
  "options": [{ "text": "...", "mediaUrl": "..." }],
  "config": {
    "minStake": 5,
    "maxStake": 500,
    "countdownSeconds": 5
  },
  "opensAt": "2026-02-20T12:00:00Z",
  "closesAt": "2026-02-21T12:00:00Z"
}
```

---

## 6. Group Endpoints

### `GET /api/v1/groups`

List groups: user's groups + discoverable public groups.

**Query params:** `?filter=my_groups|discover&category=...&page=1`

---

### `POST /api/v1/groups`

Create a new group.

**Request:**

```json
{
  "name": "Friday Night Crew",
  "description": "Weekly predictions with the squad",
  "isPublic": false,
  "category": "social",
  "rules": {
    "membershipApproval": "automatic",
    "marketCreation": "admin_only",
    "minBuyIn": 10,
    "maxBuyIn": 500
  }
}
```

**Response (201):** Group ID, invite code, share links.

---

### `POST /api/v1/groups/:groupId/join`

Join a group by invite code.

**Request:** `{ "inviteCode": "FN-CREW-2024" }`

---

### `DELETE /api/v1/groups/:groupId/leave`

Leave a group.

---

### `GET /api/v1/groups/:groupId/activity`

Group-scoped activity feed.

---

### `POST /api/v1/groups/:groupId/markets`

Create a group market (group admin only).

---

### `POST /api/v1/groups/:groupId/markets/:marketId/predict`

Place a prediction in a group market.

---

### `POST /api/v1/groups/:groupId/markets/:marketId/declare-winner`

Admin declares winner (Winner Takes All only).

---

### `POST /api/v1/groups/:groupId/markets/:marketId/confirm`

Member confirms winner declaration.

---

### `POST /api/v1/groups/:groupId/markets/:marketId/disagree`

Member disagrees with winner declaration.

---

### `POST /api/v1/groups/:groupId/markets/:marketId/settle`

Trigger settlement for group market.

---

## 7. Notification Endpoints

### `GET /api/v1/notifications`

Get user's notifications with pagination.

**Query params:** `?page=1&perPage=20&unread_only=true`

---

### `PATCH /api/v1/notifications/:id/read`

Mark notification as read.

---

### `PATCH /api/v1/notifications/read-all`

Mark all notifications as read.

---

## 8. Admin Endpoints

### `GET /api/v1/admin/stats`

Platform-wide statistics (DAU, revenue, active markets, etc.)

---

### `GET /api/v1/admin/users`

User list with search and filters.

---

### `PATCH /api/v1/admin/users/:userId/tier`

Update user tier. Admin only.

---

### `GET /api/v1/admin/compliance/flags`

Flagged accounts for review.

---

### `POST /api/v1/admin/compliance/freeze`

Freeze a user account.

---

### `POST /api/v1/admin/compliance/unfreeze`

Unfreeze a user account.

---

### `GET /api/v1/admin/withdrawals`

Pending withdrawals queue for manual processing.

---

### `POST /api/v1/admin/withdrawals/:id/approve`

Approve and process a withdrawal.

---

### `POST /api/v1/admin/withdrawals/:id/reject`

Reject a withdrawal with reason.

---

## 9. WebSocket Events (Socket.IO)

### Connection

```typescript
import { io } from "socket.io-client";

const socket = io("wss://api.antesocial.com", {
  auth: { token: jwtToken },
  transports: ["websocket"],
});
```

### Rooms

| Room                | Auto-joined       | Purpose                                                    |
| :------------------ | :---------------- | :--------------------------------------------------------- |
| `user:{userId}`     | ✓ On connect      | Personal notifications, wallet updates, prediction results |
| `market:{marketId}` | Client subscribes | Pool updates, new participants, settlement                 |
| `group:{groupId}`   | Client subscribes | Activity feed, winner declarations                         |
| `leaderboard`       | Client subscribes | Rank changes                                               |

### Client → Server Events

| Event                | Payload        | Purpose           |
| :------------------- | :------------- | :---------------- |
| `market:subscribe`   | `{ marketId }` | Join market room  |
| `market:unsubscribe` | `{ marketId }` | Leave market room |
| `group:subscribe`    | `{ groupId }`  | Join group room   |
| `group:unsubscribe`  | `{ groupId }`  | Leave group room  |

### Server → Client Events

| Event                 | Room          | Payload                                                | Description                             |
| :-------------------- | :------------ | :----------------------------------------------------- | :-------------------------------------- |
| `market:pool_updated` | `market:{id}` | `{ marketId, totalPool, participantCount, updatedAt }` | New prediction placed                   |
| `market:settled`      | `market:{id}` | `{ marketId, winningOption, totalPool, winnerCount }`  | Market settlement complete              |
| `prediction:result`   | `user:{id}`   | `{ marketId, isWinner, payout, profit }`               | User's personal result                  |
| `wallet:updated`      | `user:{id}`   | `{ balances }`                                         | Balance change (deposit, payout, debit) |
| `notification:new`    | `user:{id}`   | `{ id, type, title, message, actionUrl }`              | New notification                        |
| `group:activity`      | `group:{id}`  | `{ type, description, userId, createdAt }`             | Group bet placed, winner declared       |

---

## 10. Frontend API Route Mapping

The current Next.js API routes map to backend endpoints as follows:

| Frontend Route                                            | Backend Endpoint                                   |
| :-------------------------------------------------------- | :------------------------------------------------- |
| `api/auth/[...nextauth]/route.ts`                         | `/api/v1/auth/login`, `/api/v1/auth/register`      |
| `api/auth/register/route.ts`                              | `/api/v1/auth/register`                            |
| `api/auth/2fa/setup/route.ts`                             | `/api/v1/auth/2fa/setup`                           |
| `api/auth/2fa/verify/route.ts`                            | `/api/v1/auth/2fa/verify`                          |
| `api/markets/route.ts`                                    | `/api/v1/markets`                                  |
| `api/markets/[id]/route.ts`                               | `/api/v1/markets/:id`                              |
| `api/markets/[id]/bet/route.ts`                           | `/api/v1/markets/:id/predict`                      |
| `api/groups/route.ts`                                     | `/api/v1/groups`                                   |
| `api/groups/[groupId]/markets/route.ts`                   | `/api/v1/groups/:groupId/markets`                  |
| `api/groups/[groupId]/markets/[marketId]/settle/route.ts` | `/api/v1/groups/:groupId/markets/:marketId/settle` |
| `api/wallet/deposit/route.ts`                             | `/api/v1/wallet/deposit`                           |
| `api/wallet/withdraw/route.ts`                            | `/api/v1/wallet/withdraw`                          |
| `api/user/profile/route.ts`                               | `/api/v1/user/profile`                             |
| `api/user/activity/route.ts`                              | `/api/v1/user/activity`                            |
| `api/notifications/route.ts`                              | `/api/v1/notifications`                            |
| `api/admin/stats/route.ts`                                | `/api/v1/admin/stats`                              |
| `api/admin/users/route.ts`                                | `/api/v1/admin/users`                              |
| `api/admin/withdrawals/route.ts`                          | `/api/v1/admin/withdrawals`                        |

---

## 11. Error Codes Reference

| Code                   | HTTP | Description                            |
| :--------------------- | :--- | :------------------------------------- |
| `VALIDATION_ERROR`     | 400  | Request validation failed              |
| `UNAUTHORIZED`         | 401  | Invalid or missing token               |
| `FORBIDDEN`            | 403  | Insufficient permissions               |
| `NOT_FOUND`            | 404  | Resource not found                     |
| `CONFLICT`             | 409  | Duplicate prediction or username       |
| `RATE_LIMIT_EXCEEDED`  | 429  | Too many requests                      |
| `INSUFFICIENT_BALANCE` | 400  | Wallet balance too low                 |
| `DAILY_LIMIT_EXCEEDED` | 400  | Transaction limit reached              |
| `ACCOUNT_FROZEN`       | 403  | Account suspended                      |
| `MARKET_CLOSED`        | 400  | Market no longer accepting predictions |
| `EDIT_WINDOW_EXPIRED`  | 403  | 5-minute edit window passed            |
| `REQUIRES_2FA`         | 403  | 2FA verification required              |

---

**CONFIDENTIAL PROPERTY OF ANTE SOCIAL**
_API Endpoints v2.0 | February 2026_
