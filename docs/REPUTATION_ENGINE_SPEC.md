# REPUTATION_ENGINE_SPEC.md

**PROPRIETARY & CONFIDENTIAL — ANTE SOCIAL**
**Version 1.0 | February 2026**

---

## 1. Overview

The Reputation Engine calculates and maintains user credibility scores that serve three functions:

1. **Trust Signal**: Visible to other users as a credibility indicator
2. **Anti-Manipulation**: Invisible integrity weight applied to vote counting in poll-based markets
3. **Platform Governance**: Influences group admin privileges and tier eligibility

---

## 2. Score Components

### 2.1 Reputation Score (0–1000)

A composite metric displayed on user profiles. Higher scores indicate more trustworthy, active, and accurate participants.

**Calculation Formula:**

```
reputationScore = (
  accuracyComponent     × 0.40  +   // 40% weight
  consistencyComponent  × 0.25  +   // 25% weight
  tenureComponent       × 0.15  +   // 15% weight
  socialComponent       × 0.10  +   // 10% weight
  complianceComponent   × 0.10      // 10% weight
) × 1000

// Clamped to [0, 1000]
```

#### Component Definitions

| Component       | Range   | Calculation                                                        |
| :-------------- | :------ | :----------------------------------------------------------------- |
| **Accuracy**    | 0.0–1.0 | `positionsWon / totalPositionsTaken` (min 10 positions to qualify) |
| **Consistency** | 0.0–1.0 | `activeDays / totalDaysSinceRegistration` (capped at 1.0)          |
| **Tenure**      | 0.0–1.0 | `min(daysSinceRegistration / 365, 1.0)`                            |
| **Social**      | 0.0–1.0 | `min((followersCount + groupMemberships) / 100, 1.0)`              |
| **Compliance**  | 0.0–1.0 | `1.0 - (complianceViolations × 0.2)` (floor: 0.0)                  |

**Cold Start**: New users begin at `reputationScore = 100` (base trust). Scores only become "earned" after 10 settled positions.

---

### 2.2 Signal Accuracy (0–100%)

A straightforward historical correctness metric.

```
signalAccuracy = (positionsWon / totalSettledPositions) × 100
```

- Only settled positions count (active/cancelled excluded)
- Minimum 5 settled positions required before display
- Below threshold: displays "Not enough data" instead of a percentage
- Updated immediately on every market settlement

---

### 2.3 Integrity Weight (0.80–1.00)

An invisible weight applied to a user's vote during poll-style and consensus market settlement. This is the primary anti-Sybil mechanism.

**Weight Assignment Rules:**

| Condition                                       | Weight   | Rationale           |
| :---------------------------------------------- | :------- | :------------------ |
| Account age ≥ 30 days AND ≥ 5 settled positions | **1.00** | Established user    |
| Account age ≥ 7 days AND ≥ 1 settled position   | **0.95** | Building trust      |
| Account age ≥ 7 days AND 0 settled positions    | **0.90** | Active but unproven |
| Account age < 7 days                            | **0.85** | New account         |
| Account flagged for suspicious activity         | **0.80** | Under review        |

**Application**: When counting votes in poll-based markets:

```
effectiveVote = 1 × integrityWeight
```

For markets with >100 participants, integrity weighting has negligible effect on outcomes. It primarily prevents manipulation in small markets (<20 participants).

---

## 3. Decay Logic

### 3.1 Reputation Score Decay

Reputation decays to prevent stale scores from misrepresenting current trustworthiness.

**Decay Rules:**

| Inactivity Period | Decay Rate          | Mechanic                    |
| :---------------- | :------------------ | :-------------------------- |
| 0–30 days         | **No decay**        | Active grace period         |
| 31–60 days        | **-5 points/week**  | Gradual decline             |
| 61–90 days        | **-10 points/week** | Accelerated decline         |
| 91+ days          | **-20 points/week** | Floor: 50 (never reaches 0) |

**Recovery**: Decay halts immediately upon any prediction placement. Score recovers through normal calculation on next settlement.

### 3.2 Signal Accuracy — No Decay

Signal accuracy is a permanent historical record. It does not decay. Users who return after inactivity retain their accuracy history.

### 3.3 Integrity Weight — Resets on Compliance Clear

If an account was flagged and subsequently cleared by compliance review, integrity weight resets to the level appropriate for the account's age and activity. If not cleared within 30 days, weight remains at 0.80 until manual review.

---

## 4. Anti-Manipulation Logic

### 4.1 Sybil Attack Prevention

**Detection signals:**

- Multiple accounts from same device fingerprint
- Same IP address with burst registration pattern
- Identical prediction patterns across accounts in same markets

**Response:**

1. Flag all suspected accounts
2. Reduce integrity weight to 0.80 for all flagged accounts
3. If confirmed: freeze secondary accounts, merge valid prediction history to primary

### 4.2 Coordinated Manipulation (Ring Attacks)

**Detection signals:**

- A cluster of accounts consistently predicting the same option across multiple markets
- Accounts created within the same 24-hour window that always co-participate

**Response:**

1. Apply 0.80 weight to all accounts in the cluster
2. Flag for manual review
3. If confirmed: suspend accounts, void predictions from affected markets

### 4.3 Vote Buying / Social Engineering

**Detection signals:**

- Single user's invite link generating >10 accounts in 24 hours that immediately predict
- Pattern of new accounts funding, predicting, and going dormant

**Response:**

1. Rate-limit invite registrations (max 5 per 24h per invite code)
2. Apply 0.85 weight to all accounts from high-velocity invite codes
3. Manual review trigger

### 4.4 Group Admin Self-Dealing

In Winner Takes All group markets:

- Admin cannot declare themselves as winner
- Admin's own prediction is excluded from displayed participant list during declaration
- If admin's prediction matches declared winner, flag for review

### 4.5 Late-Surge Prevention

**Scenario**: A large number of predictions placed in the final 60 seconds of a market to swing outcomes.

**Response:**

- Predictions placed in final 60 seconds receive `integrityWeight × 0.9` modifier
- Does not apply to Reflex markets (where late entry IS the mechanic)

---

## 5. Edge Cases

### 5.1 User With Zero Settled Positions

- Reputation Score: 100 (base)
- Signal Accuracy: "Not enough data"
- Integrity Weight: 0.85–0.90 (based on account age)
- Can participate in all markets without restriction

### 5.2 User With 100% Accuracy After 5 Positions

- Displayed accurately, no artificial cap
- Reputation Score benefits from high accuracy component
- Subject to same sample-size caveat (clear labeling: "5 predictions")

### 5.3 User Returns After 6-Month Absence

- Reputation Score decayed to floor (50)
- Signal Accuracy: unchanged (22 positions, 68% accuracy)
- Integrity Weight: recalculated on first new prediction
- First prediction immediately halts decay

### 5.4 Account Frozen Then Unfrozen

- Compliance component resets to 0.8 (one violation recorded)
- Integrity weight restored to age-appropriate level
- Reputation Score recalculated with violation penalty

### 5.5 Reflex Market — Response Time Doesn't Affect Reputation

All valid predictions within the countdown window are treated equally. Response time (stored in `responseTimeMs`) is tracked for analytics but does not influence reputation or integrity weight.

---

## 6. Recalculation Schedule

| Event                   | Trigger                | Scope                                     |
| :---------------------- | :--------------------- | :---------------------------------------- |
| Market settlement       | Immediate              | All participants in that market           |
| Weekly decay check      | Cron: Sunday 00:00 UTC | All users with no activity in past 7 days |
| Compliance flag raised  | Immediate              | Flagged user only                         |
| Compliance flag cleared | Immediate              | Cleared user only                         |
| Manual admin override   | On-demand              | Target user only                          |

---

## 7. Display Rules

| Field             | Visibility               | Format                        |
| :---------------- | :----------------------- | :---------------------------- |
| Reputation Score  | Public (profile page)    | `780 / 1000` with colored bar |
| Signal Accuracy   | Public (profile page)    | `65%` or "Not enough data"    |
| Integrity Weight  | **NEVER shown to users** | Internal only                 |
| Tier              | Public (badge)           | `Novice` or `High Roller`     |
| Compliance status | **NEVER shown to users** | Internal only                 |

---

**CONFIDENTIAL PROPERTY OF ANTE SOCIAL**
_Reputation Engine Spec v1.0 | February 2026_
