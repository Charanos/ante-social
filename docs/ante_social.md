# Ante Social - Platform Documentation

**PROPRIETARY INFORMATION – DO NOT SHARE**

## Platform Overview

Ante Social is a social casino platform designed for the Kenyan market, combining competitive gaming with community-driven betting mechanics. The platform emphasizes transparency, fair play, and social interaction through group-based and public market betting.

---

## User Tier System

### Tier Levels & Benefits

**Available Tiers:**
1. **novice** (default tier)
2. **high_roller** (manually granted by Ante Social compliance team)

### Transaction Limits (Rolling 24-hour Period)

**Novice Tier:**
- Daily deposits/top-ups: **Maximum $500**
- Daily withdrawals: **Maximum $250**

**High Roller Tier:**
- Daily deposits/top-ups: **Maximum $5,000**
- Daily withdrawals: **Maximum $1,000**

### Tier Assignment Rules

- All new users start as **novice**
- **high_roller** status is granted exclusively by Ante Social administrators
- Spending patterns may qualify users, but only admins can assign the tier
- Assignment is discretionary and non-automatic
- Users cannot request or purchase tier upgrades

### Enforcement & Security

**Hard Caps:**
- Limits enforced at wallet service level
- Transactions exceeding limits are blocked immediately
- Clear error messages displayed to users
- All attempts logged to compliance system

**Monitoring & Fraud Prevention:**
- Rate-limit repeated transaction attempts
- Flag structuring behavior (multiple small deposits to circumvent limits)
- Automatic account freeze on suspicious patterns pending manual review
- Compliance team reviews flagged accounts within 24 hours

### User Experience

**Profile Display:**
- Tier badge visible in user profile
- Informational tooltip explaining limits and tier system
- High Roller badge message: *"An Ante Social honor, reserved for those who made fortune bend first."*

**Restrictions:**
- Tier status is read-only for users
- Only administrators can upgrade or downgrade tiers
- Tier changes logged with timestamp and admin ID

---

## Platform Economics

### Commission Structure

**Platform Fee:**
- **5% of each settled bet pool** (applies to both private group bets and public markets)
- Fee is deducted **before** payouts are distributed

### Accounting Fields (Per Bet)

For every bet, the following values are tracked:

```
total_pool              = Sum of all participant buy-ins
platform_fee_collected  = 5% of total_pool
prize_pool_after_fees   = total_pool − platform_fee_collected
total_paid_out          = Sum of actual payouts to winners
```

### Financial Principles

**No House Float:**
- All payouts come exclusively from each bet's participant pool
- Ante Social does not wager against users
- Platform revenue is solely from the 5% fee

**Transparency:**
- No odds, percentages, or probability displays shown to users
- No live counts or charts before settlement
- Eliminates information asymmetry and manipulation

**Audit Trail:**
- Immutable records for all fee calculations
- Complete payout history per bet
- Timestamped settlement data
- Accessible for compliance review

---

## Public Market Types

### 1. Poll-Style Markets

**Mechanics:**
- Option with the most votes wins
- Winners split `prize_pool_after_fees` proportionally by stake amount
- Supports media uploads (GIF, JPEG, JPG, PNG)

**User Interface Rules:**
- Users select outcome and enter stake amount only
- Chosen options are hidden from other participants
- Pre-settlement anonymity maintained

**Participant Display (Non-Admin View):**
- Username
- Total stake in USDT
- Timestamp of participation
- **No indication of chosen option**

**Integrity Weighting System:**
- Early and consistent participants: **1.0× integrity weight**
- New or burst-joined users: **0.8× provisional weight** (invisible to users)
- Weights applied to prevent manipulation from new account clusters

---

### 2. The Betrayal Game

**Core Mechanics:**
Players choose between **Cooperate** or **Betray**

**Outcome Matrix:**

| Scenario | Result |
|----------|--------|
| All cooperate | Small win distributed to all players |
| Majority cooperate, minority betray | Betrayers win big (split majority stakes) |
| Majority betray | All players lose their stakes |
| All betray | Zero payout for all (dramatic loss) |

**Game Theory:**
- Encourages strategic thinking and risk assessment
- Social dynamics influence individual decisions
- Higher stakes create psychological tension

---

### 3. Reflex Reaction Test

**Premise:**
Users predict the majority's first instinct when confronted with a situation. A **5-second countdown** forces quick decisions.

**Example Scenario:**
*"When suddenly added to a new group chat, the majority would…"*

**Options might include:**
- Leave immediately
- Mute notifications
- Ask "who's this?"
- Pretend they didn't see it
- Participate just for fun

**Payout Multiplier Tiers:**

| Majority % Range | Multiplier | Tier | Winner Message |
|-----------------|------------|------|----------------|
| ≤ 45% | 2.0× | A | "Fortune favors the absurd. You bet against reason and reason lost!" |
| 45–55% | 1.3× | B | "Neither too early nor too late; perfect timing, perfect folly." |
| 56–70% | 1.05× | C | "You weren't wrong, just a little too right." |
| > 70% | 1.0× (reset) | — | "You joined the parade, not the rebellion. But even parades have prizes." |

**Mechanics:**
- Rewards contrarian thinking
- Higher payouts for correctly predicting minority outcomes
- Maintains engagement even for majority predictions

---

### 4. Majority Prediction Ladder

**Premise:**
Users predict the top-ranked item based on majority vote.

**Mechanics:**
- Users arrange items in order they believe the majority will rank them
- Must guess the correct chain/sequence
- Winners (one or multiple) split the payout equally

**UI Requirements:**
- Option cards must be draggable
- Snap-to-grid positioning for clear ranking
- Visual feedback for placement

**Example Markets:**
- Rank these inconveniences (traffic, slow WiFi, dead phone battery, etc.)
- Rank these cringe behaviors
- Rank these guilty pleasures
- Rank best Nairobi neighborhoods

---

## Private Group Bets

### #1 – Winner Takes All

**Core Mechanic:**
A single user wins the entire `prize_pool_after_fees` after group confirmation.

**Settlement Flow:**

1. **Admin Declaration:**
   - Admin declares winner
   - Bet status changes to `pending_confirmation`
   - Group notification sent: *"@alex declared @jamie as winner."*

2. **Group Confirmation:**
   - All members see two buttons:
     - **Confirm Winner**
     - **Disagree**

3. **Disagree Action:**
   - Modal displayed: *"Are you sure? This will pause payout for everyone until the admin reviews."*
   - Buttons: **Cancel** | **Yes, Disagree**
   - Requires double-confirmation to prevent accidental clicks

4. **Auto-Finalization Logic:**
   - If ≥1 member confirms **AND** no disagreements within **12 hours** → payout finalizes automatically
   - If any member disagrees → status changes to `disputed`, payout paused
   - Admin may re-declare winner once; further disputes require manual resolution

**Activity Feed Entries:**
- "@alex declared @jamie as winner."
- "@riley confirmed the result."
- "@morgan disagreed – payout paused."
- "Winner confirmed, payout finalized."

**Acceptance Rules:**
- Admin cannot finalize alone (prevents self-dealing)
- At least one group member confirmation required
- Disagreement requires double-confirmation
- Auto-finalization only if group remains peaceful
- All logs visible only within the group

**Data Isolation:**
- All actions scoped by `group_id`
- Confirmation/disagreement counts stored per market per group
- Cross-group data leakage prevented

---

### #2 – Odd One Out

**Core Mechanic:**
- Option with the **fewest votes** wins
- Winners split the `prize_pool_after_fees` evenly
- Minimum **3 options** required (reduces tie probability)

**Tie Handling:**
- If everyone picks the same option:
  - Market marked as `tie`
  - Refund issued (minus 5% platform fee)
  - UI message: *"Everyone chose the same. House keeps the fee; try again, fools."*

**Activity Feed:**
- Shows only: *"placed $X"*
- Chosen option **never revealed** pre-settlement
- Maintains strategic uncertainty

**Gamification:**
- Winner earns **"Contrarian of the Day"** badge
- Badge shows latest winner per group
- Resets with each new Odd One Out win

---

## System Compliance & Checks

### Transaction Enforcement
- Tier caps enforced at wallet API level
- All transaction attempts logged (successful and failed)
- Rate limiting on repeated attempts
- Suspicious patterns trigger automatic review

### Fee Collection
- 5% platform fee deducted before all payouts
- No payout processed if admin confirmation is pending
- Fee calculation included in audit logs

### Public Market Privacy
- Non-admin users see: username, stake amount, timestamp only
- Chosen options never displayed pre-settlement
- Prevents information-based manipulation

### Private Group Restrictions
- Only **winner_takes_all** and **odd_one_out** bet types allowed
- Minimum 3 options enforced for odd_one_out
- Activity feed hides option choices
- All actions scoped to group

### Audit & Compliance Logs
Required data points for every bet:
- Platform fee collected
- Payout split calculations
- User tier at time of bet placement
- Settlement timestamp and metadata
- Admin actions with user ID
- Dispute records and resolutions

---

## Technical Requirements

### Data Isolation
- All group bet data scoped by `group_id`
- User privacy maintained across groups
- No cross-contamination of bet pools

### Immutability
- Settlement records cannot be altered post-finalization
- Audit trail preserved indefinitely
- Dispute history maintained

### Error Handling
- Clear error messages for transaction limit violations
- Graceful handling of tie scenarios
- Timeout handling for confirmation windows

---

**CONFIDENTIAL PROPERTY OF ANTE SOCIAL**  
*Last Updated: January 2026*