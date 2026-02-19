# PRODUCT_OVERVIEW.md

**PROPRIETARY & CONFIDENTIAL — ANTE SOCIAL**
**Version 2.0 | February 2026**

---

## 1. Platform Description

Ante Social is a **social prediction market platform** built for the Kenyan market and designed for global expansion. It transforms social intuition into structured, stake-backed predictions across community-driven markets.

Unlike conventional betting platforms, Ante Social operates as a **peer-to-peer prediction layer** — the platform never takes a position against its users. Revenue is derived exclusively from a flat 5% commission on settled market pools. There is no house edge, no odds manipulation, and no information asymmetry.

The platform is built around five public market types and two private group bet types, each designed to test a different cognitive dimension: consensus reading, strategic deception, reflexive instinct, ranking prediction, and contrarian divergence.

---

## 2. Core Principles

### 2.1 Peer-to-Peer, Not House-vs-Player

All payouts originate from participant-funded pools. Ante Social is a neutral settlement layer, not an adversary. This is a non-negotiable architectural constraint — the system cannot be configured to produce house float.

### 2.2 Information Symmetry

No participant can see another participant's chosen option before settlement. No live vote counts, probability percentages, or trending indicators are displayed during an active market. This eliminates herding bias, late-mover advantage, and information-based manipulation.

### 2.3 Transparent Settlement

Every settled market produces an immutable audit record containing:

- Total pool collected
- Platform fee deducted (always 5%)
- Prize pool after fees
- Per-winner payout breakdown
- Settlement timestamp and method

### 2.4 Reputation as Currency

User credibility is tracked through an integrity weight system. Early, consistent participants receive full weight (1.0×). New or burst-pattern accounts receive provisional weight (0.8×). This prevents Sybil attacks and last-minute manipulation clusters without penalizing legitimate users.

### 2.5 Social-First Architecture

Groups are first-class entities. Every market can exist within a social context — private groups with manual settlement, public markets with automated resolution. Social dynamics (cooperation, betrayal, consensus) are the game mechanics, not cosmetic layers.

---

## 3. Market Types (Differentiators)

### Public Markets

| Market Type                | Cognitive Test          | Settlement Mechanic        | Unique Feature                         |
| :------------------------- | :---------------------- | :------------------------- | :------------------------------------- |
| **Consensus (Poll-Style)** | Crowd reading           | Most-voted option wins     | Integrity-weighted votes               |
| **Reflex Reaction**        | Instinct under pressure | 5-second forced decision   | Minority multiplier tiers (up to 2.0×) |
| **Majority Ladder**        | Ranking prediction      | Exact sequence match wins  | Drag-and-drop chain prediction         |
| **Prisoner's Dilemma**     | Strategic deception     | Cooperate/Betray matrix    | Game-theory payoff matrix              |
| **Syndicate**              | Coordinated prediction  | Group-coordinated outcomes | Social coordination mechanics          |

### Private Group Markets

| Market Type          | Settlement                     | Key Mechanic                              |
| :------------------- | :----------------------------- | :---------------------------------------- |
| **Winner Takes All** | Admin-declared, peer-confirmed | 12-hour confirmation window, dispute flow |
| **Odd One Out**      | Automatic (fewest votes wins)  | Contrarian reward, tie-to-refund logic    |

---

## 4. Target User Archetypes

### 4.1 The Social Predictor (Primary)

- **Profile**: 18-35, urban Kenyan, active on Twitter/X and WhatsApp
- **Motivation**: Social bragging rights, community belonging, low-stakes entertainment
- **Behavior**: Joins via group invite, places predictions in friend circles, shares results on social media
- **Value**: High retention through social lock-in, organic growth via group invites

### 4.2 The Strategic Analyst

- **Profile**: 22-40, data-literate, follows multiple prediction markets
- **Motivation**: Proving analytical superiority, building public track record
- **Behavior**: Studies market mechanics, exploits multiplier tiers, builds reputation
- **Value**: Creates content-worthy prediction streaks, drives platform credibility

### 4.3 The Casual Explorer

- **Profile**: 18-30, smartphone-first, low financial commitment
- **Motivation**: Entertainment, curiosity, "what would I choose?" impulse
- **Behavior**: Low-stake predictions, engagement via daily spin, achievement hunting
- **Value**: Floor-level liquidity, DAU contributor, converts to predictor over time

### 4.4 The Group Admin

- **Profile**: Social organizer, WhatsApp group admin, friend-circle leader
- **Motivation**: Hosting social events, resolving friendly debates with stakes
- **Behavior**: Creates private groups, hosts Winner Takes All bets around real events
- **Value**: Organic acquisition channel (each admin brings 5-15 members)

---

## 5. Value Proposition

### For Users

> "Turn your social intuition into real outcomes. Predict with friends, prove your instincts, earn from being right."

### For Investors

> "Ante Social monetizes social prediction through a 5% commission model with zero house risk exposure. Growth is organic through group-based viral mechanics, with unit economics improving as pool sizes scale."

### For Regulators

> "Ante Social is a peer-to-peer social prediction platform. The platform does not take positions against users, does not display odds or probabilities, and enforces daily transaction limits with full audit trails. All outcomes are community-determined or manually verified by group administrators."

---

## 6. Competitive Positioning

| Dimension               | Ante Social                | Traditional Betting     | Polymarket / Kalshi     |
| :---------------------- | :------------------------- | :---------------------- | :---------------------- |
| **House risk**          | None (P2P)                 | House takes positions   | AMM-based               |
| **Information display** | Hidden pre-settlement      | Odds displayed          | Probabilities displayed |
| **Social layer**        | Core mechanic              | Peripheral              | Minimal                 |
| **Settlement**          | Community + Admin          | House-determined        | Oracle-based            |
| **Target market**       | Kenya → Africa → Global    | Regulated jurisdictions | US/Global               |
| **Entry barrier**       | M-Pesa, USDT, low minimums | Bank account required   | Crypto-primary          |
| **Game variety**        | 5 cognitive market types   | Single prediction model | Binary/multiple choice  |

---

## 7. Identified Risks & Mitigations

### 7.1 Regulatory Perception Risk

**Risk**: "Social predictions with money" can be framed as unlicensed gambling.

**Mitigation**:

- Platform never displays odds or probabilities (removes primary gambling characteristic)
- No house edge or adversarial position (peer-to-peer pools only)
- Daily transaction limits enforce responsible-use guardrails
- All settlements produce auditable records
- Framing uses "prediction" and "forecast" language, never "bet" in user-facing copy

### 7.2 Trust Perception Risk

**Risk**: Users may suspect manipulation in markets where their choices are hidden.

**Mitigation**:

- Post-settlement transparency shows full vote breakdowns
- Audit trail accessible for compliance review
- Integrity weighting prevents new-account manipulation clusters
- Group markets with manual settlement use peer confirmation (admin cannot self-deal)

### 7.3 Messaging Gap — Reputation System

**Current state**: The frontend displays `reputationScore`, `signalAccuracy`, and `tier` fields, but no existing documentation defines how these values are calculated, decay, or influence market participation.

**Required action**: `REPUTATION_ENGINE_SPEC.md` must fully specify calculation, weighting, decay, and anti-manipulation logic before backend implementation.

### 7.4 Messaging Gap — Syndicate Market Type

**Current state**: A `syndicate` market page exists in the frontend (`/dashboard/markets/[id]/syndicate/page.tsx`), but no specification exists in any documentation for how this market type operates.

**Required action**: Syndicate market mechanics must be fully specified and documented before backend implementation can proceed.

---

**CONFIDENTIAL PROPERTY OF ANTE SOCIAL**
_Product Overview v2.0 | February 2026_
