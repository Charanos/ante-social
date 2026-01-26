# Ante Social - API Specification

**VERSION 1.0 | PROPRIETARY & CONFIDENTIAL**

---

## API Overview

**Base URL:** `https://api.antesocial.com/v1`

**Authentication:** Bearer Token (JWT)

**Rate Limiting:** 
- Standard users: 100 requests/minute
- High rollers: 200 requests/minute
- Admin: 500 requests/minute

**Response Format:** JSON

**Error Handling:** Standard HTTP status codes with detailed error messages

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string (3-20 chars, alphanumeric + underscore)",
  "email": "string (valid email)",
  "password": "string (min 8 chars)",
  "phone_number": "string (Kenyan format: +254...)",
  "date_of_birth": "string (YYYY-MM-DD, must be 18+)",
  "preferred_currency": "USD|KSH (default: KSH)"
}
```

**Response (201):**
```json
{
  "user_id": "objectId",
  "username": "string",
  "email": "string",
  "tier": "novice",
  "preferences": {
    "currency": "KSH",
    "theme": "dark"
  },
  "token": "jwt_token",
  "created_at": "timestamp"
}
```

**Errors:**
- `400` - Validation failed
- `409` - Username or email already exists
- `422` - User under 18 years old

---

### POST /auth/login
Authenticate existing user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "totp_code": "string (6 digits, required if 2FA enabled)",
  "backup_code": "string (alternative to totp_code)"
}
```

**Response (200):**
```json
{
  "user_id": "objectId",
  "username": "string",
  "tier": "novice|high_roller",
  "two_factor_enabled": true,
  "requires_totp": false,
  "preferences": {
    "currency": "KSH",
    "theme": "dark"
  },
  "token": "jwt_token",
  "expires_at": "timestamp"
}
```

**Response (206 - 2FA Required):**
```json
{
  "requires_totp": true,
  "message": "Please provide your 6-digit authenticator code"
}
```

**Errors:**
- `401` - Invalid credentials
- `403` - Account suspended/frozen
- `428` - 2FA code required
- `422` - Invalid 2FA code

---

### POST /auth/logout
Invalidate current session token.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### POST /auth/refresh
Refresh authentication token.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "token": "new_jwt_token",
  "expires_at": "timestamp"
}
```

---

### POST /auth/2fa/setup
Enable 2FA for user account.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qr_code_url": "data:image/png;base64,...",
  "backup_codes": [
    "ABC-123-DEF",
    "GHI-456-JKL",
    "MNO-789-PQR",
    "STU-012-VWX",
    "YZA-345-BCD",
    "EFG-678-HIJ",
    "KLM-901-NOP",
    "QRS-234-TUV",
    "WXY-567-ZAB",
    "CDE-890-FGH"
  ],
  "message": "Save backup codes in a secure location"
}
```

---

### POST /auth/2fa/verify
Verify and activate 2FA.

**Request Body:**
```json
{
  "totp_code": "123456"
}
```

**Response (200):**
```json
{
  "message": "2FA enabled successfully",
  "two_factor_enabled": true
}
```

**Errors:**
- `422` - Invalid code

---

### POST /auth/2fa/disable
Disable 2FA for user account.

**Request Body:**
```json
{
  "password": "string",
  "totp_code": "123456"
}
```

**Response (200):**
```json
{
  "message": "2FA disabled successfully",
  "two_factor_enabled": false
}
```

---

## User Management Endpoints

### GET /users/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "user_id": "objectId",
  "username": "string",
  "email": "string",
  "tier": "novice|high_roller",
  "tier_badge_message": "string",
  "two_factor_enabled": true,
  "preferences": {
    "currency": "KSH",
    "theme": "dark",
    "notifications": {
      "email": true,
      "push": true,
      "sms": false
    }
  },
  "daily_limits": {
    "currency": "KSH",
    "deposit_limit": 66225.00,
    "withdrawal_limit": 33112.50,
    "deposit_used_today": 15925.00,
    "withdrawal_used_today": 0,
    "resets_at": "timestamp"
  },
  "wallet_balances": {
    "USD": {
      "available": 1250.75,
      "pending": 200.00
    },
    "KSH": {
      "available": 165432.50,
      "pending": 26490.00
    }
  },
  "total_bets_placed": 42,
  "total_wins": 18,
  "member_since": "timestamp"
}
```

---

### PATCH /users/profile
Update user profile (limited fields).

**Request Body:**
```json
{
  "username": "string (optional)",
  "phone_number": "string (optional)",
  "avatar_url": "string (optional)",
  "preferences": {
    "currency": "USD|KSH (optional)",
    "theme": "light|dark (optional)",
    "notifications": {
      "email": "boolean (optional)",
      "push": "boolean (optional)",
      "sms": "boolean (optional)"
    }
  }
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "updated_fields": ["username"]
}
```

**Errors:**
- `400` - Validation failed
- `409` - Username already taken

---

### GET /users/activity
Get user activity history.

**Query Parameters:**
- `limit` (int, default: 20, max: 100)
- `offset` (int, default: 0)
- `type` (string, optional: "bet_placed" | "bet_won" | "bet_lost" | "deposit" | "withdrawal")

**Response (200):**
```json
{
  "activities": [
    {
      "activity_id": "uuid",
      "type": "bet_placed",
      "description": "Placed $50 on Poll-Style market",
      "amount": 50.00,
      "market_id": "uuid",
      "timestamp": "timestamp"
    }
  ],
  "pagination": {
    "total": 156,
    "limit": 20,
    "offset": 0
  }
}
```

---

## Wallet Endpoints

### GET /wallet/balance
Get current wallet balance.

**Response (200):**
```json
{
  "balances": {
    "USD": {
      "available": 1250.75,
      "pending": 200.00
    },
    "KSH": {
      "available": 165432.50,
      "pending": 26490.00
    }
  },
  "exchange_rate": {
    "USD_to_KSH": 132.45,
    "last_updated": "timestamp"
  }
}
```

---

### POST /wallet/deposit
Initiate a deposit.

**Request Body:**
```json
{
  "amount": 100.00,
  "currency": "USD|KSH",
  "payment_method": "mpesa|crypto"
}
```

**Response (200) - M-Pesa:**
```json
{
  "transaction_id": "objectId",
  "amount": 13245.00,
  "currency": "KSH",
  "status": "pending",
  "payment_instructions": {
    "method": "mpesa",
    "business_number": "123456",
    "account_number": "ANTE-USER123",
    "steps": [
      "Go to M-Pesa menu",
      "Select Lipa Na M-Pesa → Pay Bill",
      "Enter Business Number: 123456",
      "Enter Account Number: ANTE-USER123",
      "Enter Amount: 13245",
      "Enter your PIN"
    ]
  },
  "expires_at": "timestamp (15 minutes)"
}
```

**Response (200) - Crypto:**
```json
{
  "transaction_id": "objectId",
  "amount": 100.00,
  "currency": "USD",
  "status": "pending",
  "payment_instructions": {
    "method": "crypto",
    "network": "USDT-TRC20",
    "wallet_address": "TXyZ123...",
    "qr_code_url": "data:image/png;base64,...",
    "amount_exact": "100.00 USDT",
    "warning": "Only send USDT on TRC20 network. Other assets will be lost.",
    "confirmations_required": 12
  },
  "expires_at": "timestamp (30 minutes)"
}
```

**Errors:**
- `400` - Invalid amount
- `403` - Daily limit exceeded
- `429` - Too many deposit attempts

---

### POST /wallet/withdraw
Request a withdrawal.

**Request Body:**
```json
{
  "amount": 100.00,
  "withdrawal_method": "mpesa|bank_transfer",
  "destination": {
    "mpesa_number": "+254700000000"
  }
}
```

**Response (200):**
```json
{
  "transaction_id": "uuid",
  "amount": 100.00,
  "status": "pending",
  "estimated_completion": "timestamp (24-48 hours)"
}
```

**Errors:**
- `400` - Insufficient balance
- `403` - Daily limit exceeded
- `422` - Pending bets must settle first

---

### GET /wallet/transactions
Get transaction history.

**Query Parameters:**
- `limit` (int, default: 20)
- `offset` (int, default: 0)
- `type` (string: "deposit" | "withdrawal" | "bet" | "payout")

**Response (200):**
```json
{
  "transactions": [
    {
      "transaction_id": "uuid",
      "type": "deposit",
      "amount": 100.00,
      "status": "completed",
      "timestamp": "timestamp"
    }
  ],
  "pagination": {
    "total": 89,
    "limit": 20,
    "offset": 0
  }
}
```

---

## Public Markets Endpoints

### GET /markets/public
List all active public markets.

**Query Parameters:**
- `type` (string, optional: "poll_style" | "betrayal_game" | "reflex_reaction" | "majority_prediction")
- `status` (string: "active" | "settling" | "settled")
- `limit` (int, default: 20)

**Response (200):**
```json
{
  "markets": [
    {
      "market_id": "uuid",
      "type": "poll_style",
      "title": "Best Nairobi matatu route?",
      "description": "Vote for the most reliable route",
      "status": "active",
      "total_pool": 2450.00,
      "participant_count": 47,
      "closes_at": "timestamp",
      "created_at": "timestamp"
    }
  ]
}
```

---

### GET /markets/public/:market_id
Get specific public market details.

**Response (200):**
```json
{
  "market_id": "uuid",
  "type": "poll_style",
  "title": "Best Nairobi matatu route?",
  "description": "Vote for the most reliable route",
  "status": "active",
  "options": [
    {
      "option_id": "uuid",
      "text": "Route 46",
      "media_url": "https://cdn.antesocial.com/..."
    }
  ],
  "total_pool": 2450.00,
  "platform_fee": 122.50,
  "prize_pool_after_fees": 2327.50,
  "participant_count": 47,
  "participants": [
    {
      "username": "betting_king",
      "total_stake": 50.00,
      "timestamp": "timestamp"
    }
  ],
  "closes_at": "timestamp",
  "settlement_info": null
}
```

**Note:** `participants` array does NOT include chosen options for non-admin users.

---

### POST /markets/public/:market_id/bet
Place a bet on a public market.

**Request Body:**
```json
{
  "option_id": "uuid",
  "stake": 50.00
}
```

**Response (201):**
```json
{
  "bet_id": "uuid",
  "market_id": "uuid",
  "option_id": "uuid",
  "stake": 50.00,
  "status": "active",
  "placed_at": "timestamp"
}
```

**Errors:**
- `400` - Invalid stake amount
- `403` - Insufficient balance
- `404` - Market not found or closed
- `409` - Already bet on this market

---

### GET /markets/public/:market_id/results
Get settled market results (only after settlement).

**Response (200):**
```json
{
  "market_id": "uuid",
  "status": "settled",
  "winning_option": {
    "option_id": "uuid",
    "text": "Route 46",
    "vote_count": 28
  },
  "total_pool": 2450.00,
  "platform_fee": 122.50,
  "prize_pool_after_fees": 2327.50,
  "winners": [
    {
      "username": "betting_king",
      "stake": 50.00,
      "payout": 165.50
    }
  ],
  "settled_at": "timestamp"
}
```

---

## Private Group Bets Endpoints

### POST /groups
Create a new betting group.

**Request Body:**
```json
{
  "name": "Friday Night Crew",
  "description": "Weekly bets with the boys",
  "is_private": true
}
```

**Response (201):**
```json
{
  "group_id": "uuid",
  "name": "Friday Night Crew",
  "admin_id": "uuid",
  "invite_code": "FN-CREW-2024",
  "member_count": 1,
  "created_at": "timestamp"
}
```

---

### POST /groups/:group_id/join
Join a group via invite code.

**Request Body:**
```json
{
  "invite_code": "FN-CREW-2024"
}
```

**Response (200):**
```json
{
  "message": "Joined group successfully",
  "group_id": "uuid",
  "group_name": "Friday Night Crew"
}
```

**Errors:**
- `404` - Invalid invite code
- `409` - Already a member

---

### GET /groups/:group_id
Get group details.

**Response (200):**
```json
{
  "group_id": "uuid",
  "name": "Friday Night Crew",
  "description": "Weekly bets with the boys",
  "admin_id": "uuid",
  "members": [
    {
      "user_id": "uuid",
      "username": "betting_king",
      "role": "admin",
      "joined_at": "timestamp"
    }
  ],
  "active_bets": 2,
  "total_bets": 15,
  "created_at": "timestamp"
}
```

---

### POST /groups/:group_id/bets
Create a new group bet.

**Request Body:**
```json
{
  "type": "winner_takes_all|odd_one_out",
  "title": "Who will arrive last to the party?",
  "description": "Annual late-arrival bet",
  "options": [
    {"text": "Alex"},
    {"text": "Jamie"},
    {"text": "Morgan"}
  ],
  "minimum_stake": 10.00,
  "closes_at": "timestamp"
}
```

**Response (201):**
```json
{
  "bet_id": "uuid",
  "group_id": "uuid",
  "type": "winner_takes_all",
  "title": "Who will arrive last to the party?",
  "status": "active",
  "created_at": "timestamp"
}
```

**Errors:**
- `400` - Invalid bet type or insufficient options
- `403` - Only admin can create bets

---

### POST /groups/:group_id/bets/:bet_id/place
Place a bet in a group.

**Request Body:**
```json
{
  "option_id": "uuid",
  "stake": 25.00
}
```

**Response (201):**
```json
{
  "bet_entry_id": "uuid",
  "bet_id": "uuid",
  "option_id": "uuid",
  "stake": 25.00,
  "placed_at": "timestamp"
}
```

---

### POST /groups/:group_id/bets/:bet_id/declare-winner
Declare winner (admin only, winner_takes_all only).

**Request Body:**
```json
{
  "winner_user_id": "uuid"
}
```

**Response (200):**
```json
{
  "bet_id": "uuid",
  "status": "pending_confirmation",
  "declared_winner": "uuid",
  "declared_by": "uuid",
  "confirmation_deadline": "timestamp (12 hours)"
}
```

**Errors:**
- `403` - Only admin can declare winner
- `404` - User not in bet

---

### POST /groups/:group_id/bets/:bet_id/confirm
Confirm winner declaration.

**Response (200):**
```json
{
  "message": "Winner confirmed",
  "bet_id": "uuid",
  "confirmations": 2,
  "required_confirmations": 1
}
```

---

### POST /groups/:group_id/bets/:bet_id/disagree
Disagree with winner declaration.

**Response (200):**
```json
{
  "message": "Disagreement recorded, payout paused",
  "bet_id": "uuid",
  "status": "disputed",
  "disagreed_by": "uuid"
}
```

---

### GET /groups/:group_id/activity
Get group activity feed.

**Response (200):**
```json
{
  "activities": [
    {
      "activity_id": "uuid",
      "type": "bet_placed",
      "description": "@betting_king placed $25",
      "user_id": "uuid",
      "timestamp": "timestamp"
    },
    {
      "activity_id": "uuid",
      "type": "winner_declared",
      "description": "@admin declared @betting_king as winner",
      "timestamp": "timestamp"
    }
  ]
}
```

---

## Admin Endpoints

### PATCH /admin/users/:user_id/tier
Update user tier (admin only).

**Request Body:**
```json
{
  "tier": "high_roller",
  "reason": "Consistent high-volume betting"
}
```

**Response (200):**
```json
{
  "user_id": "uuid",
  "previous_tier": "novice",
  "new_tier": "high_roller",
  "updated_by": "uuid",
  "updated_at": "timestamp"
}
```

---

### GET /admin/compliance/flags
Get flagged accounts.

**Response (200):**
```json
{
  "flagged_accounts": [
    {
      "user_id": "uuid",
      "username": "suspicious_user",
      "flag_type": "structuring",
      "description": "Multiple small deposits detected",
      "flagged_at": "timestamp",
      "status": "pending_review"
    }
  ]
}
```

---

### POST /admin/compliance/freeze
Freeze user account.

**Request Body:**
```json
{
  "user_id": "uuid",
  "reason": "Suspected fraud"
}
```

**Response (200):**
```json
{
  "message": "Account frozen",
  "user_id": "uuid",
  "frozen_at": "timestamp"
}
```

---

## Webhooks

### POST {webhook_url}/bet_settled
Triggered when any bet is settled.

**Payload:**
```json
{
  "event": "bet_settled",
  "bet_id": "uuid",
  "market_type": "poll_style",
  "total_pool": 2450.00,
  "platform_fee": 122.50,
  "winners_count": 28,
  "settled_at": "timestamp"
}
```

---

### POST {webhook_url}/withdrawal_completed
Triggered when withdrawal is processed.

**Payload:**
```json
{
  "event": "withdrawal_completed",
  "transaction_id": "uuid",
  "user_id": "uuid",
  "amount": 100.00,
  "completed_at": "timestamp"
}
```

---

## Error Response Format

All error responses follow this structure:

```json
{
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Your wallet balance is insufficient for this transaction",
    "details": {
      "required": 100.00,
      "available": 45.50
    }
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Request validation failed
- `UNAUTHORIZED` - Invalid or missing token
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INSUFFICIENT_BALANCE` - Wallet balance too low
- `DAILY_LIMIT_EXCEEDED` - Transaction limit reached
- `ACCOUNT_FROZEN` - Account suspended
- `BET_CLOSED` - Market no longer accepting bets

---

**CONFIDENTIAL PROPERTY OF ANTE SOCIAL**  
*API Version 1.0 | Last Updated: January 2026*