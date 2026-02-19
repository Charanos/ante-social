# PREDICTION_MARKET_LOGIC.md

**PROPRIETARY & CONFIDENTIAL — ANTE SOCIAL**
**Version 2.0 | February 2026**

---

## 1. Market Lifecycle

All markets follow a state machine with deterministic transitions:

```
                  ┌──────────┐
                  │  DRAFT   │ (Admin-created, not yet visible)
                  └────┬─────┘
                       │ Admin publishes
                       ▼
                  ┌──────────┐
        ┌────────│  ACTIVE   │────────┐
        │         └────┬─────┘         │
        │              │ Timer expires │ Admin cancels
        │              │ or admin      │
        │              │ closes        │
        │              ▼               ▼
        │         ┌──────────┐    ┌───────────┐
        │         │  CLOSED  │    │ CANCELLED │
        │         └────┬─────┘    └───────────┘
        │              │ Settlement begins
        │              ▼
        │         ┌──────────┐
        │         │ SETTLING │ (Locked, no new predictions)
        │         └────┬─────┘
        │              │ Settlement complete
        │              ▼
        │         ┌──────────┐
        └────────▶│ SETTLED  │
                  └──────────┘
```

**Group markets** add additional states for manual settlement:
`ACTIVE → CLOSED → PENDING_CONFIRMATION → DISPUTED → SETTLED`

---

## 2. Probability & Odds — Design Decision

> **Ante Social does NOT display odds, probabilities, or live vote distributions.**

This is a deliberate product decision, not a technical limitation:

- **No implied probability displayed**: Unlike Polymarket/Kalshi, users cannot see market-implied probabilities
- **No vote counts pre-settlement**: Participant counts are shown, but option distribution is hidden
- **No price history charts pre-settlement**: The `priceHistory` field in the frontend types is for **post-settlement** visualization only
- **No live trending indicators**: No "most popular" badges on options during active markets

**Rationale**: Hidden distributions force genuine prediction. If users could see that 80% chose Option A, contrarian markets like Consensus Divergence become trivially exploitable.

**Post-settlement display**: After a market settles, full vote breakdowns, percentages, and winner distributions are publicly visible.

---

## 3. Community Input & Market Resolution

### 3.1 How Predictions Influence Outcomes

In Ante Social, user predictions **ARE** the outcome. There is no external oracle for most market types.

| Market Type            | Resolution Method              | Who Determines Outcome             |
| :--------------------- | :----------------------------- | :--------------------------------- |
| **Consensus**          | Most-voted option wins         | The crowd (weighted votes)         |
| **Reflex**             | Most-voted option wins         | The crowd (within 5-second window) |
| **Ladder**             | Majority-matching ranking wins | The crowd (exact sequence)         |
| **Prisoner's Dilemma** | Cooperate/Betray matrix        | The crowd (game theory)            |
| **Syndicate**          | Coordinated outcome            | The crowd (TBD)                    |
| **Winner Takes All**   | Admin declares, peers confirm  | Group admin + peer verification    |
| **Odd One Out**        | Least-voted option wins        | The crowd (inverse consensus)      |

---

## 4. Settlement Logic by Market Type

### 4.1 Consensus (Poll-Style)

**Rule**: Option with the most integrity-weighted votes wins.

```
Settlement Steps:
1. Fetch all predictions for market
2. Calculate total_pool = sum(all stakes)
3. Calculate platform_fee = total_pool × 0.05
4. Calculate prize_pool = total_pool - platform_fee

5. Count votes per option WITH integrity weighting:
   For each prediction:
     effectiveVote = 1 × user.integrityWeight

6. Identify winning option (highest weighted vote count)

7. Calculate pro-rata payout for each winner:
   payout = (winner.stake / sumOfAllWinnerStakes) × prize_pool

8. Credit winner wallets, record transactions
```

**Tie Handling**: If two options have identical weighted vote counts:

- The option that received its first vote earliest wins
- If still tied: market marked as `tie`, stakes refunded minus 5% fee

### 4.2 Reflex Reaction

**Rule**: Predict the majority's instinct. Payout multiplied by minority tier.

```
Settlement Steps:
1-4. Same as Consensus (pool, fee, prize calculation)

5. Determine majority option (most votes, no weighting)

6. Calculate majority percentage:
   majorityPct = (majorityVotes / totalVotes) × 100

7. Determine multiplier tier:
   ≤ 45%  → 2.0×  (Tier A)
   45-55% → 1.3×  (Tier B)
   56-70% → 1.05× (Tier C)
   > 70%  → 1.0×  (reset)

8. Winners = predictions matching majority option

9. Calculate capped payout:
   rawPayout = winner.stake × multiplier
   cappedPayout = min(rawPayout, prize_pool / winnersCount)

10. Credit wallets
```

**Important**: Multipliers apply to the prediction amount, not the pool share. The `min()` cap prevents payouts exceeding the pool.

### 4.3 Majority Ladder

**Rule**: Exact ranking sequence match wins. Equal split among winners.

```
Settlement Steps:
1-4. Same as Consensus

5. Count ranking sequences:
   For each prediction:
     rankingKey = rankedOptionIds.join("→")
     rankingCounts[rankingKey]++

6. Majority ranking = most common sequence

7. Winners = predictions with exact matching sequence

8. If no winners (no sequence has >1 submission):
   → Market settles as "no_matches"
   → Refund all stakes minus platform fee

9. Equal payout: payoutPerWinner = prize_pool / winnersCount

10. Credit wallets
```

### 4.4 Prisoner's Dilemma (Betrayal Game)

**Rule**: Game-theory payoff matrix determines winners.

```
Settlement Steps:
1-4. Same as Consensus

5. Categorize predictions:
   cooperators = predictions where choice === "cooperate"
   betrayers = predictions where choice === "betray"

6. Apply outcome matrix:

   CASE 1: All cooperate (betrayers.length === 0)
   → Small win distributed equally to all
   → payoutPerPerson = prize_pool / cooperators.length

   CASE 2: Majority cooperate, minority betray
   → Betrayers win (they split the entire prize pool)
   → payout = (betrayer.stake / totalBetrayerStakes) × prize_pool

   CASE 3: Majority betray (betrayers.length >= cooperators.length)
   → Everyone loses. No payouts.
   → Platform fee still collected.

   CASE 4: All betray
   → Zero payout for everyone. Dramatic loss.
   → Platform fee still collected.

7. Credit winner wallets (if any)
```

### 4.5 Consensus Divergence (Odd One Out)

**Rule**: Option with the fewest votes wins. Contrarian is rewarded.

```
Settlement Steps:
1-4. Same as Consensus

5. Count votes per option (no integrity weighting)

6. Identify winning option = option with FEWEST votes
   (If all options have same count → tie, refund minus fee)

7. Winners = predictions matching the least-voted option

8. Equal payout: payoutPerWinner = prize_pool / winnersCount

9. Award "Contrarian of the Day" badge to winner(s)

10. Credit wallets
```

### 4.6 Syndicate

> **[SPECIFICATION PENDING]**
> The Syndicate market type has a frontend page but no settlement logic defined. This must be specified before backend implementation.

### 4.7 Winner Takes All (Group)

**Rule**: Admin declares winner, group confirms.

```
Settlement Steps:
1. Admin calls POST /groups/:groupId/bets/:betId/declare-winner
2. Status → "pending_confirmation"
3. 12-hour confirmation window opens
4. Members confirm or disagree:
   - Confirm: increment confirmation count
   - Disagree (double-confirmed): status → "disputed", payout paused

5. Auto-finalization conditions:
   - ≥1 confirmation AND 0 disagreements AND 12h elapsed
   → Execute payout to declared winner

6. Dispute resolution:
   - Admin may re-declare ONCE
   - If unresolved after 48h → escalate to platform support

7. Settlement:
   - Calculate pool, fee, prize (same as always)
   - Winner receives entire prize_pool_after_fees
   - Credit wallet, record transaction
```

### 4.8 Odd One Out (Group)

Same as Consensus Divergence (#4.5) but scoped to group members. Minimum 3 options required.

---

## 5. Platform Fee

**Flat 5% on all settled markets, public and private.**

```typescript
const platformFee = totalPool * 0.05;
const prizePool = totalPool - platformFee;
```

- Deducted BEFORE payouts
- Recorded as `platform_fee` transaction type
- Immutable in audit log
- Applies even in tie/refund scenarios

---

## 6. Transparency Mechanics

### 6.1 Pre-Settlement (Active Market)

Users can see:

- ✅ Market title, description, options
- ✅ Total pool amount
- ✅ Participant count
- ✅ Participant list: username + stake amount + timestamp
- ✅ Time remaining

Users CANNOT see:

- ❌ Which option each participant chose
- ❌ Vote distribution per option
- ❌ Running percentages or probabilities
- ❌ "Trending" or "popular" indicators

### 6.2 Post-Settlement (Settled Market)

Everything becomes visible:

- ✅ Full vote breakdown by option (count + percentage)
- ✅ Winning option with highlight
- ✅ All winner payouts with amounts
- ✅ Platform fee amount
- ✅ Settlement timestamp

### 6.3 Audit Trail (Admin/Compliance Only)

- Complete prediction records with chosen options
- Integrity weights applied at settlement
- Fee calculation breakdown
- IP addresses and device info at time of prediction
- All admin actions with timestamps

---

## 7. Prediction Placement Rules

| Rule                               | Enforcement                                 |
| :--------------------------------- | :------------------------------------------ |
| One prediction per user per market | `(marketId + userId)` unique index          |
| Minimum stake                      | Market-defined `config.minStake`            |
| Maximum stake                      | Market-defined `config.maxStake` (optional) |
| Market must be `active`            | Status check before placement               |
| Sufficient wallet balance          | Balance check with reservation              |
| Within daily tier limit            | Rolling 24h limit check                     |
| 5-minute edit/cancel window        | `editableUntil` timestamp on prediction     |
| Reflex: within countdown window    | Server-validated countdown timer            |

---

## 8. Currency Handling

All markets operate in a single settlement currency, but users can hold balances in both USD and KSH.

- User's wallet is debited in their active currency
- Market pools track both USD and KSH independently
- At settlement, payouts are issued in the currency the user staked in
- Exchange rate stored at time of each transaction for audit

---

**CONFIDENTIAL PROPERTY OF ANTE SOCIAL**
_Prediction Market Logic v2.0 | February 2026_
