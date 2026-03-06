# Ante Social Market Ideas - Testing Templates

**25 Market Ideas Across 5 Market Types**  
Designed for current events, high engagement, and clear settlement criteria.

---

## Table of Contents

1. [Consensus Markets](#consensus-markets) - Majority vote wins, weighted by stake
2. [Reflex Markets](#reflex-markets) - Minority wins with multipliers
3. [Ladder Markets](#ladder-markets) - Predict exact sequences
4. [Betrayal Markets](#betrayal-markets) - Game theory meets betting
5. [Group Pool Markets](#group-pool-markets) - Private pools with custom rules
6. [Market Categories Analysis](#market-categories-analysis)

---

## CONSENSUS Markets

_Participants vote on outcomes, majority wins, weighted by stake and accuracy_

### 1. US Tech Stock Performance Q1 2026

```json
{
  "title": "Will NVIDIA stock close above $150 by March 31, 2026?",
  "type": "consensus",
  "category": "finance",
  "options": ["Yes, above $150", "No, $150 or below"],
  "closesAt": "2026-03-31T20:00:00Z",
  "description": "NVIDIA's stock price at market close on March 31, 2026. Settled using official NASDAQ closing price.",
  "minStake": 10,
  "maxStake": 10000,
  "minParticipants": 5,
  "settlementSource": "NASDAQ official close price"
}
```

**Why This Works:**

- Clear settlement criteria (official stock price)
- High interest (NVIDIA is trending)
- 3-month timeframe (good for engagement)
- Binary outcome (easy to verify)

---

### 2. African Union Summit 2026 Host

```json
{
  "title": "Which country will host the 2026 African Union Summit?",
  "type": "consensus",
  "category": "politics",
  "options": ["Kenya", "South Africa", "Egypt", "Nigeria", "Other"],
  "closesAt": "2026-01-15T23:59:00Z",
  "description": "Official AU announcement for 2026 summit host nation. Settled using official AU press release.",
  "minStake": 10,
  "maxStake": 5000,
  "minParticipants": 10,
  "settlementSource": "African Union official press release"
}
```

**Why This Works:**

- African relevance (local interest)
- Official announcement (verifiable)
- Multiple options (strategic betting)
- Political engagement

---

### 3. FIFA World Cup 2026 Winner

```json
{
  "title": "Which team will win the 2026 FIFA World Cup?",
  "type": "consensus",
  "category": "sports",
  "options": [
    "Brazil",
    "Argentina",
    "France",
    "Germany",
    "Spain",
    "England",
    "Portugal",
    "Other"
  ],
  "closesAt": "2026-07-19T18:00:00Z",
  "description": "Winner of the 2026 FIFA World Cup final. Settled after final match result.",
  "minStake": 20,
  "maxStake": 50000,
  "minParticipants": 20,
  "settlementSource": "FIFA official match result"
}
```

**Why This Works:**

- Global event (massive audience)
- Long timeframe (build engagement)
- Clear outcome (tournament winner)
- High betting volume expected

---

### 4. Bitcoin Price Prediction March 2026

```json
{
  "title": "Will Bitcoin be above $100,000 by end of March 2026?",
  "type": "consensus",
  "category": "crypto",
  "options": ["Yes, above $100k", "No, below $100k"],
  "closesAt": "2026-03-31T23:59:00Z",
  "description": "Bitcoin price at midnight UTC on March 31, 2026. Settled using CoinMarketCap average.",
  "minStake": 10,
  "maxStake": 20000,
  "minParticipants": 15,
  "settlementSource": "CoinMarketCap 24h average price"
}
```

**Why This Works:**

- Crypto interest (high engagement)
- Psychological price point ($100k)
- Clear settlement (price data)
- Moderate timeframe

---

### 5. Kenya Presidential Election 2027

```json
{
  "title": "Who will win the 2027 Kenya Presidential Election?",
  "type": "consensus",
  "category": "politics",
  "options": ["William Ruto", "Raila Odinga", "Other Candidate"],
  "closesAt": "2027-08-09T17:00:00Z",
  "description": "Winner of Kenya's 2027 presidential election. Settled after official IEBC announcement.",
  "minStake": 50,
  "maxStake": 100000,
  "minParticipants": 50,
  "settlementSource": "IEBC official election results"
}
```

**Why This Works:**

- Local relevance (Kenyan platform)
- High stakes (political passion)
- Official verification (IEBC)
- Long-term engagement

---

## REFLEX Markets

_Bet against the crowd - minority wins with multipliers_

### 1. Champions League Final 2026

```json
{
  "title": "Champions League 2025/26 Final Winner - Contrarian Bet",
  "type": "reflex",
  "category": "sports",
  "options": [
    "Real Madrid",
    "Manchester City",
    "Bayern Munich",
    "PSG",
    "Liverpool",
    "Arsenal"
  ],
  "closesAt": "2026-05-30T19:45:00Z",
  "description": "Bet against the crowd! Smaller the winning group, bigger the payout. Settled after UCL final.",
  "minStake": 25,
  "maxStake": 10000,
  "minParticipants": 20,
  "reflexMultiplier": 2.5,
  "settlementSource": "UEFA official match result"
}
```

**Why This Works:**

- Contrarian incentive (unique to reflex)
- Popular event (high participation)
- Clear favorite (crowd will cluster)
- Multiplier attracts risk-takers

---

### 2. US Presidential Election 2026 Midterms

```json
{
  "title": "Which party wins US House majority in 2026 midterms? (Minority wins big)",
  "type": "reflex",
  "category": "politics",
  "options": ["Democrats", "Republicans", "Tied/No Clear Majority"],
  "closesAt": "2026-11-03T23:59:00Z",
  "description": "Contrarian bet on 2026 US midterm results. Smaller winning group gets exponential returns.",
  "minStake": 20,
  "maxStake": 15000,
  "minParticipants": 30,
  "reflexMultiplier": 3.0,
  "settlementSource": "Official US election results"
}
```

**Why This Works:**

- Political polarization (crowd clustering)
- Contrarian edge rewards research
- High multiplier (3x for minority)
- Global interest

---

### 3. Tesla Stock Volatility

```json
{
  "title": "Tesla Stock: Biggest % Move in Q1 2026? (Bet the unexpected)",
  "type": "reflex",
  "category": "finance",
  "options": [
    "Up 20%+",
    "Down 20%+",
    "Flat (-10% to +10%)",
    "Moderate (10-20% either way)"
  ],
  "closesAt": "2026-03-31T20:00:00Z",
  "description": "What's Tesla's biggest move? Contrarians win big. Settled using Q1 high/low vs Dec 31 close.",
  "minStake": 15,
  "maxStake": 8000,
  "minParticipants": 15,
  "reflexMultiplier": 2.0,
  "settlementSource": "NASDAQ official price data"
}
```

**Why This Works:**

- Volatile stock (unpredictable)
- Multiple outcomes (spread betting)
- Rewards research over herd mentality
- Popular ticker

---

### 4. Arsenal Premier League Title

```json
{
  "title": "Will Arsenal FINALLY win the Premier League 2025/26? (Contrarian)",
  "type": "reflex",
  "category": "sports",
  "options": ["Yes, Arsenal wins", "No, someone else wins"],
  "closesAt": "2026-05-24T16:00:00Z",
  "description": "Bet against the majority! Arsenal's title drought continues or ends? Minority wins multiply.",
  "minStake": 20,
  "maxStake": 12000,
  "minParticipants": 25,
  "reflexMultiplier": 2.5,
  "settlementSource": "Premier League official standings"
}
```

**Why This Works:**

- Emotional investment (Arsenal fans)
- Historical drought (narrative)
- Binary with edge case (contrarian bet)
- Season-long engagement

---

### 5. SpaceX Mars Mission 2026

```json
{
  "title": "SpaceX Mars Mission Success in 2026? (Long shot pays big)",
  "type": "reflex",
  "category": "technology",
  "options": [
    "Successful landing",
    "Launch but no landing",
    "No launch attempt",
    "Mission scrubbed"
  ],
  "closesAt": "2026-12-31T23:59:00Z",
  "description": "Predict the unpredictable! Smallest winning group gets massive returns.",
  "minStake": 10,
  "maxStake": 5000,
  "minParticipants": 20,
  "reflexMultiplier": 4.0,
  "settlementSource": "SpaceX official mission status"
}
```

**Why This Works:**

- Uncertain outcome (high variance)
- Tech enthusiast appeal
- High multiplier (4x)
- Multiple scenarios

---

## LADDER Markets

_Predict exact sequences - all steps must be correct_

### 1. Premier League Top 4 Sequence

```json
{
  "title": "Premier League 2025/26 Final Standings - Exact Top 4 Order",
  "type": "ladder",
  "category": "sports",
  "sequence": [
    "1st Place Team",
    "2nd Place Team",
    "3rd Place Team",
    "4th Place Team"
  ],
  "options": [
    "Man City",
    "Arsenal",
    "Liverpool",
    "Chelsea",
    "Man United",
    "Tottenham"
  ],
  "closesAt": "2026-05-24T16:00:00Z",
  "description": "Predict EXACT finishing order of top 4 teams. All 4 must be correct to win. High risk, massive reward.",
  "minStake": 50,
  "maxStake": 20000,
  "minParticipants": 10,
  "settlementSource": "Premier League official final standings"
}
```

**Why This Works:**

- High difficulty (exponential odds)
- Season-long engagement
- Clear verification (league table)
- Massive payout potential

---

### 2. NBA Playoffs Progression

```json
{
  "title": "NBA 2026 Playoffs - Predict Conference Finals Winners in Order",
  "type": "ladder",
  "category": "sports",
  "sequence": [
    "Eastern Conference Champion",
    "Western Conference Champion",
    "NBA Finals Winner"
  ],
  "options": [
    "Lakers",
    "Celtics",
    "Nuggets",
    "Bucks",
    "Warriors",
    "Heat",
    "Mavericks",
    "76ers"
  ],
  "closesAt": "2026-06-20T23:00:00Z",
  "description": "Predict exact sequence: East champ, West champ, Finals winner. All 3 must be right.",
  "minStake": 100,
  "maxStake": 50000,
  "minParticipants": 15,
  "settlementSource": "NBA official playoff results"
}
```

**Why This Works:**

- 3-step sequence (manageable difficulty)
- Playoff excitement (high engagement)
- Progressive reveals (each round builds tension)
- Clear outcomes

---

### 3. Tech Earnings Sequence Q1 2026

```json
{
  "title": "FAANG Q1 2026 Earnings - Rank by % Revenue Growth",
  "type": "ladder",
  "category": "finance",
  "sequence": [
    "Highest % growth",
    "2nd highest",
    "3rd highest",
    "4th highest",
    "Lowest % growth"
  ],
  "options": ["Meta", "Apple", "Amazon", "Netflix", "Google"],
  "closesAt": "2026-04-30T23:59:00Z",
  "description": "Predict exact ranking of FAANG by Q1 YoY revenue growth. Settled after earnings reports.",
  "minStake": 50,
  "maxStake": 15000,
  "minParticipants": 10,
  "settlementSource": "Official SEC earnings filings"
}
```

**Why This Works:**

- Financial expertise rewarded
- 5-step sequence (very high difficulty)
- Quarterly event (repeatable)
- Clear data (SEC filings)

---

### 4. African Elections 2026 Sequence

```json
{
  "title": "African Elections 2026 - Predict Exact Winner Sequence",
  "type": "ladder",
  "category": "politics",
  "sequence": [
    "Ghana Election Result",
    "Zambia Election Result",
    "Somalia Election Result"
  ],
  "options": {
    "Ghana": ["NPP wins", "NDC wins", "Other"],
    "Zambia": ["UPND wins", "PF wins", "Other"],
    "Somalia": ["Current govt", "Opposition", "Coalition"]
  },
  "closesAt": "2026-12-31T23:59:00Z",
  "description": "Predict winners in exact sequence. All 3 must be correct to win.",
  "minStake": 100,
  "maxStake": 30000,
  "minParticipants": 20,
  "settlementSource": "Official election commission results"
}
```

**Why This Works:**

- African focus (local relevance)
- Political engagement
- Complex prediction (high reward)
- Year-long timeframe

---

### 5. Crypto Market Cap Ranking Q2 2026

```json
{
  "title": "Top 5 Crypto by Market Cap - Exact Order June 2026",
  "type": "ladder",
  "category": "crypto",
  "sequence": ["#1 Crypto", "#2 Crypto", "#3 Crypto", "#4 Crypto", "#5 Crypto"],
  "options": [
    "Bitcoin",
    "Ethereum",
    "BNB",
    "Solana",
    "XRP",
    "Cardano",
    "Avalanche",
    "Polygon"
  ],
  "closesAt": "2026-06-30T23:59:00Z",
  "description": "Predict exact top 5 ranking. Perfect sequence required. Settled via CoinMarketCap.",
  "minStake": 25,
  "maxStake": 10000,
  "minParticipants": 15,
  "settlementSource": "CoinMarketCap rankings snapshot"
}
```

**Why This Works:**

- Volatile market (unpredictable)
- 5-step sequence (very difficult)
- Crypto community engagement
- Clear data source

---

## BETRAYAL Markets

_Cooperate or betray - game theory meets betting_

### 1. Kenya Economic Growth Cooperation

```json
{
  "title": "Kenya GDP Growth 2026: Cooperate for shared gains or betray for more?",
  "type": "betrayal",
  "category": "economics",
  "baseOutcome": "Will Kenya's GDP grow 5%+ in 2026?",
  "options": [
    "Cooperate (Yes)",
    "Cooperate (No)",
    "Betray (Yes)",
    "Betray (No)"
  ],
  "closesAt": "2026-12-31T23:59:00Z",
  "description": "Classic betrayal dilemma: If everyone cooperates correctly, pool splits evenly. Betrayers steal cooperators' stakes if right. All betrayers split pool if all betray.",
  "minStake": 100,
  "maxStake": 50000,
  "minParticipants": 20,
  "betrayalMultiplier": 2.0,
  "settlementSource": "Kenya National Bureau of Statistics"
}
```

**Betrayal Rules:**

- **All Cooperate + Correct**: Pool split evenly among cooperators
- **Mixed (Cooperate + Betray) + Correct**: Betrayers take cooperators' stakes
- **All Betray + Correct**: Pool split among betrayers
- **Wrong Answer**: Lose stake regardless of choice

**Why This Works:**

- Game theory excitement
- Local economic interest
- Psychological tension (trust vs greed)
- Clear outcome

---

### 2. Bitcoin $100k Prisoners Dilemma

```json
{
  "title": "Bitcoin hits $100k in 2026: Trust others or betray?",
  "type": "betrayal",
  "category": "crypto",
  "baseOutcome": "Will Bitcoin reach $100,000 before Dec 31, 2026?",
  "options": [
    "Cooperate (Yes)",
    "Cooperate (No)",
    "Betray (Yes)",
    "Betray (No)"
  ],
  "closesAt": "2026-12-31T23:59:00Z",
  "description": "Game theory at its finest. Cooperators share evenly if right. Betrayers steal from cooperators if correct. Everyone loses if all betray and wrong.",
  "minStake": 50,
  "maxStake": 25000,
  "minParticipants": 30,
  "betrayalMultiplier": 3.0,
  "settlementSource": "CoinMarketCap price history"
}
```

**Why This Works:**

- Crypto volatility (uncertain outcome)
- High multiplier (3x betrayal reward)
- Psychological milestone ($100k)
- Trust dynamics

---

### 3. Champions League Final Score

```json
{
  "title": "UCL Final 2026 Total Goals: Cooperate or Defect?",
  "type": "betrayal",
  "category": "sports",
  "baseOutcome": "Will total goals in UCL final be Over 2.5?",
  "options": [
    "Cooperate (Over)",
    "Cooperate (Under)",
    "Betray (Over)",
    "Betray (Under)"
  ],
  "closesAt": "2026-05-30T19:45:00Z",
  "description": "Trust the crowd or go rogue? Betrayers take cooperators' money if right. Universal betrayal = chaos.",
  "minStake": 30,
  "maxStake": 15000,
  "minParticipants": 25,
  "betrayalMultiplier": 2.5,
  "settlementSource": "UEFA official match statistics"
}
```

**Why This Works:**

- Single match (quick resolution)
- Binary outcome (simple)
- High-stakes game (emotional investment)
- Betrayal adds intrigue

---

### 4. US Inflation Rate Game

```json
{
  "title": "US Inflation Below 3% by June 2026: Trust or Betray?",
  "type": "betrayal",
  "category": "economics",
  "baseOutcome": "Will US inflation rate be below 3% by June 2026?",
  "options": [
    "Cooperate (Yes)",
    "Cooperate (No)",
    "Betray (Yes)",
    "Betray (No)"
  ],
  "closesAt": "2026-06-30T23:59:00Z",
  "description": "Economic game theory. Cooperate for fair split or betray for winner-takes-all. Settled via official CPI data.",
  "minStake": 75,
  "maxStake": 30000,
  "minParticipants": 40,
  "betrayalMultiplier": 2.0,
  "settlementSource": "US Bureau of Labor Statistics CPI"
}
```

**Why This Works:**

- Economic importance (affects everyone)
- Official data (clear settlement)
- Game theory appeal
- Moderate difficulty

---

### 5. Premier League Top Scorer Dilemma

```json
{
  "title": "Haaland wins Golden Boot 2025/26: Cooperate or Betray?",
  "type": "betrayal",
  "category": "sports",
  "baseOutcome": "Will Erling Haaland win the Premier League Golden Boot?",
  "options": [
    "Cooperate (Yes)",
    "Cooperate (No)",
    "Betray (Yes)",
    "Betray (No)"
  ],
  "closesAt": "2026-05-24T16:00:00Z",
  "description": "Classic prisoner's dilemma in sports betting. Cooperators share, betrayers steal if correct.",
  "minStake": 40,
  "maxStake": 20000,
  "minParticipants": 30,
  "betrayalMultiplier": 2.5,
  "settlementSource": "Premier League official top scorer stats"
}
```

**Why This Works:**

- Popular player (fan engagement)
- Season-long narrative
- Trust/betrayal dynamics
- Clear outcome

---

## GROUP POOL Markets

_Private pools with custom rules and payouts_

### 1. Workplace World Cup 2026 Pool

```json
{
  "title": "Office World Cup 2026 Winner Pool",
  "type": "group_pool",
  "category": "sports",
  "poolType": "winner_takes_all",
  "options": [
    "Brazil",
    "Argentina",
    "France",
    "Germany",
    "Spain",
    "England",
    "Belgium",
    "Netherlands"
  ],
  "closesAt": "2026-06-11T15:00:00Z",
  "description": "Office pool for FIFA World Cup. Each person picks a team. Winner takes entire pot.",
  "entryFee": 1000,
  "maxParticipants": 32,
  "isPrivate": true,
  "inviteCode": "OFFICE2026WC",
  "settlementSource": "FIFA official tournament results"
}
```

**Why This Works:**

- Social bonding (office pool)
- Simple rules (winner takes all)
- Long tournament (engagement)
- Private group (controlled environment)

---

### 2. Fantasy Premier League H2H

```json
{
  "title": "FPL 2025/26 Season Long Point Battle",
  "type": "group_pool",
  "category": "sports",
  "poolType": "points_based",
  "description": "Track FPL points all season. Top 3 get payouts: 50%, 30%, 20%",
  "closesAt": "2026-05-24T16:00:00Z",
  "entryFee": 500,
  "maxParticipants": 20,
  "payoutStructure": {
    "1st": 0.5,
    "2nd": 0.3,
    "3rd": 0.2
  },
  "isPrivate": true,
  "inviteCode": "FPL2026LEAGUE",
  "settlementSource": "Official FPL API points totals"
}
```

**Why This Works:**

- Season-long engagement
- Incremental competition
- Friend group appeal
- Tiered payouts

---

### 3. Crypto Trading Challenge

```json
{
  "title": "Q1 2026 Crypto Trading Competition",
  "type": "group_pool",
  "category": "crypto",
  "poolType": "performance_based",
  "description": "Best % portfolio gain in Q1 2026 wins pool. Must declare holdings by Jan 1.",
  "closesAt": "2026-03-31T23:59:00Z",
  "entryFee": 2000,
  "maxParticipants": 15,
  "payoutStructure": {
    "1st": 0.6,
    "2nd": 0.25,
    "3rd": 0.15
  },
  "isPrivate": true,
  "inviteCode": "CRYPTOQ12026",
  "settlementSource": "Self-reported with proof of holdings"
}
```

**Why This Works:**

- Competitive traders
- Skill-based (not just luck)
- Quarterly reset (repeatable)
- High entry fee (serious players)

---

### 4. NCAA March Madness Bracket

```json
{
  "title": "March Madness 2026 Bracket Challenge",
  "type": "group_pool",
  "category": "sports",
  "poolType": "points_based",
  "description": "Standard bracket scoring. Most points wins. Ties split pot.",
  "closesAt": "2026-03-17T12:00:00Z",
  "entryFee": 100,
  "maxParticipants": 64,
  "payoutStructure": {
    "1st": 0.5,
    "2nd": 0.3,
    "3rd": 0.15,
    "4th": 0.05
  },
  "isPrivate": true,
  "inviteCode": "MADNESS2026",
  "scoringRules": {
    "round1": 1,
    "round2": 2,
    "sweet16": 4,
    "elite8": 8,
    "final4": 16,
    "championship": 32
  },
  "settlementSource": "NCAA official tournament results"
}
```

**Why This Works:**

- Cultural phenomenon (March Madness)
- Standard pool format
- Large groups (64 people)
- Clear point system

---

### 5. Stock Portfolio Challenge

```json
{
  "title": "Build a $10k Portfolio - Best Returns Win",
  "type": "group_pool",
  "category": "finance",
  "poolType": "performance_based",
  "description": "Virtual $10k portfolio. Pick 5-10 stocks. Best 6-month return wins.",
  "closesAt": "2026-06-30T20:00:00Z",
  "entryFee": 500,
  "maxParticipants": 30,
  "payoutStructure": {
    "1st": 0.45,
    "2nd": 0.25,
    "3rd": 0.15,
    "4th": 0.1,
    "5th": 0.05
  },
  "isPrivate": true,
  "inviteCode": "STOCKS2026H1",
  "rules": {
    "virtualStartingCapital": 10000,
    "minStocks": 5,
    "maxStocks": 10,
    "rebalancingAllowed": false
  },
  "settlementSource": "NYSE/NASDAQ official closing prices"
}
```

**Why This Works:**

- Investment education
- Virtual portfolio (no risk)
- Skill-based competition
- Friend/colleague groups

---

## Market Categories Analysis

### Volume Projections by Category

| Category           | Expected Volume | Reasoning                                              |
| ------------------ | --------------- | ------------------------------------------------------ |
| **Sports**         | 40%             | Universal appeal, clear outcomes, emotional investment |
| **Finance/Crypto** | 30%             | High-value traders, quantifiable outcomes              |
| **Politics**       | 20%             | Passionate participants, local relevance               |
| **Technology**     | 10%             | Tech-savvy audience, uncertain outcomes                |

### Best Market Type for Each Category

| Market Type    | Ideal Categories                  | Why                                      |
| -------------- | --------------------------------- | ---------------------------------------- |
| **Consensus**  | Sports, Politics, Finance         | Clear majority opinions, binary outcomes |
| **Reflex**     | Sports underdogs, Volatile stocks | Rewards contrarian thinking              |
| **Ladder**     | Rankings, Sequences, Playoffs     | Multi-step predictions                   |
| **Betrayal**   | Binary with high engagement       | Psychological gameplay                   |
| **Group Pool** | Private competitions              | Social/office pools                      |

### Settlement Difficulty Scale

| Difficulty    | Market Examples                 | Odds of Winning |
| ------------- | ------------------------------- | --------------- |
| **Easy**      | Binary yes/no (Consensus)       | ~50%            |
| **Medium**    | 3-5 options (Consensus, Reflex) | ~20-33%         |
| **Hard**      | 8+ options (Consensus, Reflex)  | ~10-12%         |
| **Very Hard** | 3-step Ladder                   | ~1-5%           |
| **Extreme**   | 5-step Ladder                   | ~0.1-1%         |

---

## Market Design Principles

### What Makes a Good Market

✅ **Verifiable Settlement**

- Official sources (NASDAQ, FIFA, IEBC, etc.)
- Publicly available data
- No ambiguity in outcome

✅ **Timely Resolution**

- Mix of short-term (1 week - 3 months)
- Medium-term (3-6 months)
- Long-term (6-12 months)

✅ **Engaging Topics**

- Current events
- Popular sports/culture
- Financial markets
- Local relevance (Kenya/Africa)

✅ **Clear Rules**

- Unambiguous outcome criteria
- Simple settlement logic
- Transparent payout structure

✅ **Appropriate Stakes**

- Minimum: KES 10-100 (accessibility)
- Maximum: KES 5,000-100,000 (risk management)
- Varies by market type and volatility

---

## Testing Workflow

### Phase 1: Single Market Type Testing

1. Create 1 Consensus market
2. Test end-to-end flow:
   - Market creation
   - Bet placement
   - Pool accumulation
   - Settlement trigger
   - Payout distribution
3. Verify all states: active → closed → settling → settled

### Phase 2: Multi-Market Type Testing

1. Create 1 of each type (5 total)
2. Test parallel markets
3. Verify isolation (no cross-contamination)
4. Test concurrent settlements

### Phase 3: Scale Testing

1. Create multiple markets per type
2. Test with real users (beta group)
3. Monitor performance
4. Gather feedback

### Phase 4: Production Launch

1. Launch with 2-3 high-interest markets
2. Monitor engagement
3. Add markets based on demand
4. Iterate on market types

---

## Quick Reference: Market Type Selection Guide

**Need high participation fast?** → Consensus (World Cup, elections)  
**Want to reward contrarians?** → Reflex (underdogs, volatile events)  
**Testing prediction skills?** → Ladder (rankings, sequences)  
**Adding psychological element?** → Betrayal (prisoner's dilemma)  
**Private group/office?** → Group Pool (brackets, fantasy)

---

## Settlement Source Standards

### Recommended Settlement Sources

**Sports:**

- FIFA (football)
- UEFA (Champions League)
- Premier League Official
- NBA Official Stats
- NCAA Official Results

**Finance:**

- NASDAQ/NYSE closing prices
- SEC filings (earnings)
- Bloomberg Terminal data
- CoinMarketCap (crypto)

**Politics:**

- Official election commissions (IEBC for Kenya)
- Government press releases
- UN/AU official announcements

**Economics:**

- National Bureau of Statistics
- World Bank data
- IMF reports
- Central bank announcements

---

## Next Steps for Implementation

1. **Choose 1-2 markets from above** to test first
2. **Set up admin panel** for market creation
3. **Configure settlement sources** and automation
4. **Test with small group** (5-10 beta users)
5. **Monitor and iterate** based on feedback
6. **Scale gradually** - add markets as demand grows

---

**Generated:** March 2026  
**Purpose:** Market testing templates for Ante Social  
**Total Markets:** 25 (5 per type)  
**Categories:** Sports, Finance, Politics, Crypto, Technology, Economics
