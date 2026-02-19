# SECURITY_AND_COMPLIANCE.md

**PROPRIETARY & CONFIDENTIAL — ANTE SOCIAL**
**Version 1.0 | February 2026**

---

## 1. Authentication & Authorization

### 1.1 Authentication Flow

```
┌─────────────────────────────────────────────────────┐
│                 Authentication Pipeline             │
│                                                     │
│  1. Credentials (email + password)                  │
│     └─→ bcrypt hash comparison (12 rounds)          │
│                                                     │
│  2. 2FA Check (if enabled)                          │
│     └─→ TOTP verification (30-second window)        │
│     └─→ OR backup code (one-time use, then deleted) │
│                                                     │
│  3. JWT Generation                                  │
│     └─→ Payload: { userId, role, username, tier }   │
│     └─→ Signed with RS256 (asymmetric)              │
│     └─→ Expiry: 24 hours                            │
│     └─→ Refresh: Silent refresh before expiry       │
│                                                     │
│  4. Session stored in HTTP-only, Secure cookie      │
│     └─→ SameSite: Strict                            │
│     └─→ No localStorage token storage               │
└─────────────────────────────────────────────────────┘
```

### 1.2 Password Requirements

- Minimum 8 characters
- At least 1 uppercase, 1 lowercase, 1 number
- bcrypt with cost factor 12
- No common password dictionary check (optional with zxcvbn)
- Password reset requires email verification

### 1.3 2FA Implementation

- **Standard**: TOTP via Google Authenticator / Authy (RFC 6238)
- **Backup**: 10 alphanumeric recovery codes generated on setup
- **Required for**: All withdrawal requests, tier change requests
- **Optional for**: Login (user-configurable)

### 1.4 Role-Based Access Control (RBAC)

| Role             | Permissions                                                                                         |
| :--------------- | :-------------------------------------------------------------------------------------------------- |
| **System Admin** | All operations. Create public groups/markets. Manage users, tiers, compliance. Process withdrawals. |
| **Group Admin**  | Create private groups. Manage group members. Create group markets. Declare winners.                 |
| **Moderator**    | Review flagged content. View compliance dashboard (read-only).                                      |
| **User**         | Participate in markets. Join/leave groups. Manage wallet & profile.                                 |

**Middleware enforcement:**

```typescript
// Applied to every API route
const requireAuth = (handler) => async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "UNAUTHORIZED" });
  return handler(req, res, session);
};

const requireRole = (roles: string[]) => (handler) => async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!roles.includes(session.user.role))
    return res.status(403).json({ error: "FORBIDDEN" });
  return handler(req, res, session);
};
```

---

## 2. Data Protection

### 2.1 Encryption

| Layer            | Method                       | Scope                           |
| :--------------- | :--------------------------- | :------------------------------ |
| **In transit**   | TLS 1.3 (HTTPS)              | All client-server communication |
| **At rest**      | AES-256 (MongoDB encryption) | Full database encryption        |
| **Passwords**    | bcrypt (12 rounds)           | User passwords                  |
| **2FA secrets**  | AES-256 with per-user IV     | TOTP secret keys                |
| **Backup codes** | bcrypt hashed                | Recovery codes                  |
| **JWT**          | RS256 (asymmetric)           | Session tokens                  |

### 2.2 Sensitive Data Handling

**Never stored in plaintext:**

- Passwords
- 2FA secrets
- Backup codes (hashed after display)
- M-Pesa PIN (never touches our servers)
- Full credit card numbers

**Never returned in API responses:**

- `passwordHash`
- `twoFactorSecret`
- `backupCodes`
- Other users' `optionChosen` (pre-settlement)
- `ipAddress` (except admin endpoints)

### 2.3 Data Retention

| Data Type           | Retention                | Reason               |
| :------------------ | :----------------------- | :------------------- |
| User accounts       | Until deletion requested | Business need        |
| Transaction records | 7 years                  | Financial compliance |
| Audit logs          | 7 years                  | Compliance/legal     |
| Activity logs       | 2 years                  | Analytics            |
| Notifications       | 90 days                  | UX                   |
| Session tokens      | 24 hours                 | Security             |

---

## 3. Rate Limiting

### 3.1 Tier-Based Limits

| Endpoint Category         | Novice      | High Roller | Admin       |
| :------------------------ | :---------- | :---------- | :---------- |
| **General API**           | 100 req/min | 200 req/min | 500 req/min |
| **Auth (login/register)** | 5 req/min   | 5 req/min   | 10 req/min  |
| **Prediction placement**  | 10 req/min  | 20 req/min  | N/A         |
| **Wallet operations**     | 5 req/min   | 10 req/min  | N/A         |
| **Group creation**        | 3 req/hour  | 5 req/hour  | Unlimited   |

### 3.2 Implementation

- Redis-based sliding window counter
- Response headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- On limit: `429 Too Many Requests` with `Retry-After` header

### 3.3 IP-Based Protection

- **Login brute force**: 10 failed attempts → 15-minute IP block
- **Registration spam**: 3 accounts per IP per day
- **Invite code abuse**: 5 registrations per invite code per 24 hours

---

## 4. Financial Compliance

### 4.1 Transaction Limits (Tier-Based)

| Tier            | Daily Deposit               | Daily Withdrawal         | Max Single Transaction   |
| :-------------- | :-------------------------- | :----------------------- | :----------------------- |
| **Novice**      | 66,225 KSH / $500 USD       | 33,113 KSH / $250 USD    | 13,245 KSH / $100 USD    |
| **High Roller** | 1,324,500 KSH / $10,000 USD | 662,250 KSH / $5,000 USD | 132,450 KSH / $1,000 USD |

**Enforcement**: Rolling 24-hour window. Limits stored in `dailyLimits` collection, indexed by `(userId, date)`.

### 4.2 KYC Requirements

| Trigger                            | Action                       |
| :--------------------------------- | :--------------------------- |
| First withdrawal                   | Mandatory KYC verification   |
| Single withdrawal > $500           | Enhanced verification        |
| Cumulative monthly volume > $5,000 | Enhanced due diligence       |
| Account creation                   | None (delayed KYC by design) |

**Verification steps:**

1. Upload government ID (Kenyan ID / Passport)
2. Selfie verification (liveness check)
3. Admin review (24-48 hour processing)
4. Status: `pending` → `verified` or `rejected`

### 4.3 Anti-Money Laundering (AML)

**Automated detection rules:**

| Pattern                       | Threshold                                    | Action           |
| :---------------------------- | :------------------------------------------- | :--------------- |
| **Structuring**               | >5 deposits under $50 in 1 hour              | Flag + review    |
| **Unusual volume**            | >300% of user's average daily volume         | Flag + review    |
| **Rapid cycling**             | Deposit followed by withdrawal within 1 hour | Flag + auto-hold |
| **New account large deposit** | >$200 within 24h of registration             | Flag + review    |
| **Multi-account**             | Same device fingerprint across 3+ accounts   | Flag + restrict  |

**Response escalation:**

1. **Flag**: Record in `complianceFlags`, notify compliance officer
2. **Hold**: Pause withdrawals pending review
3. **Freeze**: Full account suspension, notify user
4. **Report**: Generate SAR (Suspicious Activity Report) for regulatory filing

### 4.4 Audit Trail Requirements

Every financial operation generates an immutable audit record containing:

- `transactionId` (UUID)
- `userId`
- `type` (deposit/withdrawal/bet_placed/bet_payout/refund/platform_fee)
- `amount` + `currency`
- `timestamp`
- `ipAddress`
- `userAgent`
- For market payouts: `total_pool`, `platform_fee_collected`, `prize_pool_after_fees`, `total_paid_out`
- For market predictions: `user_tier_at_prediction_time`, `integrityWeight`
- `settlement_timestamp` (when applicable)

Audit logs are **append-only** — no record may be modified or deleted.

---

## 5. Input Validation & Sanitization

### 5.1 General Rules

- All text inputs sanitized against XSS (DOMPurify or equivalent)
- SQL injection N/A (NoSQL) but NoSQL injection prevention via parameterized queries
- Request body size limit: 1MB
- File upload size limit: 5MB (images only: PNG, JPG, WebP)
- All monetary values validated as positive numbers with max 2 decimal places
- All dates validated in ISO 8601 format

### 5.2 Market-Specific Validation

| Market Type        | Validation Rule                                            |
| :----------------- | :--------------------------------------------------------- |
| Consensus          | `optionId` must exist in market.options                    |
| Reflex             | `optionId` must exist; prediction within countdown window  |
| Ladder             | `rankedOptionIds` must contain all option IDs exactly once |
| Prisoner's Dilemma | `choice` must be `cooperate` or `betray`                   |
| Winner Takes All   | `declaredWinnerId` must be a participant in the market     |

---

## 6. Infrastructure Security

### 6.1 Network

- All traffic behind CDN (Cloudflare or equivalent)
- API servers in private subnet, not directly internet-accessible
- Database accessible only from application VPC
- WebSocket connections authenticated via JWT on handshake

### 6.2 Secrets Management

- Environment variables for all secrets (never in code)
- Production secrets in AWS Secrets Manager / GCP Secret Manager
- Key rotation schedule: JWT signing keys every 90 days
- Database credentials rotated every 90 days

### 6.3 Monitoring & Alerting

| Metric                   | Alert Threshold                      |
| :----------------------- | :----------------------------------- |
| Failed login rate        | >50/minute (potential brute force)   |
| Error rate (5xx)         | >5% of requests in 5-minute window   |
| Compliance flag rate     | >10 flags/hour (unusual activity)    |
| API latency p95          | >2 seconds for 5 consecutive minutes |
| Database connection pool | >80% utilization                     |

---

## 7. Regulatory Positioning

### 7.1 Language & Framing

The platform uses specific language choices to minimize regulatory friction:

| Instead of | We use                     | Rationale                    |
| :--------- | :------------------------- | :--------------------------- |
| "Bet"      | "Prediction" or "Forecast" | Reduces gambling connotation |
| "Betting"  | "Forecasting"              | Same                         |
| "Odds"     | N/A (never displayed)      | Eliminates gambling mechanic |
| "Wager"    | "Stake" or "Position"      | Financial framing            |
| "Win/Lose" | "Correct/Incorrect"        | Skill framing                |
| "Payout"   | "Return" or "Settlement"   | Neutral                      |

### 7.2 Key Defensible Positions

1. **No house edge**: Platform never takes a position against users
2. **No odds display**: Removes primary characteristic of gambling products
3. **Skill-based framing**: Markets test cognitive abilities (reading consensus, strategic thinking)
4. **Transaction limits**: Demonstrate responsible-use guardrails
5. **Full audit trail**: Enables regulatory compliance verification
6. **KYC at withdrawal**: Standard fintech compliance pattern
7. **Age verification**: 18+ enforced at registration

---

## 8. Incident Response Plan

### 8.1 Severity Levels

| Level             | Description                        | Response Time     | Example                              |
| :---------------- | :--------------------------------- | :---------------- | :----------------------------------- |
| **P0 — Critical** | Data breach, funds at risk         | 15 minutes        | Database exposure, wallet compromise |
| **P1 — High**     | Service outage, settlement failure | 1 hour            | API down, failed payouts             |
| **P2 — Medium**   | Feature degradation                | 4 hours           | Push notifications delayed           |
| **P3 — Low**      | Cosmetic/minor issues              | Next business day | UI rendering glitch                  |

### 8.2 Response Steps (P0)

1. Identify and contain (stop active breach)
2. Assess impact (affected users, data exposed)
3. Mitigate (patch vulnerability, rotate credentials)
4. Communicate (notify affected users within 72 hours per GDPR)
5. Post-mortem (root cause analysis, prevention measures)

---

**CONFIDENTIAL PROPERTY OF ANTE SOCIAL**
_Security & Compliance v1.0 | February 2026_
