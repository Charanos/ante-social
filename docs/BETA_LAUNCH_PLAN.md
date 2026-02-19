# BETA_LAUNCH_PLAN.md

**PROPRIETARY & CONFIDENTIAL — ANTE SOCIAL**
**Version 1.0 | February 2026**

---

## 1. Beta Objectives

### Primary Goals

1. **Validate core market mechanics** — All 5 public market types function correctly with real users
2. **Test financial infrastructure** — Deposits, withdrawals, and payouts execute reliably
3. **Stress test settlement logic** — Ensure correct payouts under edge cases (ties, disputes, empty markets)
4. **Gather user feedback** — Identify UX friction, confusing flows, and missing features
5. **Measure engagement metrics** — DAU, prediction frequency, group creation rate, retention

### Non-Goals for Beta

- Full regulatory compliance (finalize post-beta based on jurisdiction feedback)
- Marketing campaigns (organic/invite-only growth)
- Production-scale infrastructure (single region, limited redundancy)
- Complete Syndicate market type (deferred to post-beta)

---

## 2. Pre-Launch Checklist

### 2.1 Backend Critical Path

| #   | Task                                                | Owner        | Status | Priority |
| :-- | :-------------------------------------------------- | :----------- | :----- | :------- |
| 1   | Resolve Prisma vs MongoDB ORM decision              | Backend Lead | ⬜     | P0       |
| 2   | Implement auth endpoints (register, login, 2FA)     | Backend      | ⬜     | P0       |
| 3   | Implement wallet service (deposit/withdraw/balance) | Backend      | ⬜     | P0       |
| 4   | Implement Consensus market settlement               | Backend      | ⬜     | P0       |
| 5   | Implement Reflex market settlement                  | Backend      | ⬜     | P0       |
| 6   | Implement Ladder market settlement                  | Backend      | ⬜     | P0       |
| 7   | Implement Prisoner's Dilemma settlement             | Backend      | ⬜     | P0       |
| 8   | Implement group creation + invite system            | Backend      | ⬜     | P0       |
| 9   | Implement Winner Takes All (group) settlement       | Backend      | ⬜     | P0       |
| 10  | Implement reputation engine (basic scoring)         | Backend      | ⬜     | P1       |
| 11  | Implement notification service                      | Backend      | ⬜     | P1       |
| 12  | Implement admin dashboard APIs                      | Backend      | ⬜     | P1       |
| 13  | Implement compliance flag system                    | Backend      | ⬜     | P2       |
| 14  | Implement Odd One Out (group) settlement            | Backend      | ⬜     | P2       |

### 2.2 Frontend Integration

| #   | Task                                       | Owner    | Status | Priority |
| :-- | :----------------------------------------- | :------- | :----- | :------- |
| 1   | Replace mock data with API calls (markets) | Frontend | ⬜     | P0       |
| 2   | Replace mock data with API calls (wallet)  | Frontend | ⬜     | P0       |
| 3   | Replace mock data with API calls (groups)  | Frontend | ⬜     | P0       |
| 4   | Replace localStorage membership with API   | Frontend | ⬜     | P0       |
| 5   | Connect auth flows to NextAuth backend     | Frontend | ⬜     | P0       |
| 6   | Real-time updates via WebSocket            | Frontend | ⬜     | P1       |
| 7   | Post-settlement results page               | Frontend | ⬜     | P1       |
| 8   | Market creation admin form                 | Frontend | ⬜     | P1       |

### 2.3 Infrastructure

| #   | Task                                                                           | Owner   | Status | Priority |
| :-- | :----------------------------------------------------------------------------- | :------ | :----- | :------- |
| 1   | Docker Compose setup (all 8 services + Kafka + MongoDB + Redis)                | DevOps  | ⬜     | P0       |
| 2   | Provision MongoDB Atlas cluster (M10+ replica set)                             | DevOps  | ⬜     | P0       |
| 3   | Provision Redis instance (ElastiCache or Redis Cloud)                          | DevOps  | ⬜     | P0       |
| 4   | Apache Kafka cluster (Confluent Cloud or 3-broker self-hosted)                 | DevOps  | ⬜     | P0       |
| 5   | Create Kafka topics (market.events, bet.placements, wallet.transactions, etc.) | DevOps  | ⬜     | P0       |
| 6   | Register Daraja sandbox app at developer.safaricom.co.ke                       | Backend | ⬜     | P0       |
| 7   | Configure Daraja STK Push + B2C + callback URLs                                | Backend | ⬜     | P0       |
| 8   | Setup ngrok or public tunnel for Daraja sandbox callbacks                      | Backend | ⬜     | P0       |
| 9   | Setup crypto payment sandbox (NOWPayments)                                     | Backend | ⬜     | P1       |
| 10  | CI/CD pipeline (GitHub Actions)                                                | DevOps  | ⬜     | P0       |
| 11  | Sentry error tracking for all 8 services                                       | DevOps  | ⬜     | P0       |
| 12  | Grafana + Prometheus monitoring dashboards                                     | DevOps  | ⬜     | P1       |
| 13  | WebSocket Gateway deployment (sticky sessions via Nginx)                       | DevOps  | ⬜     | P0       |

---

## 3. Beta Phases

### Phase 1: Internal Alpha (Week 1-2)

**Scope**: Team-only testing with simulated money

| Milestone                    | Criteria                                    |
| :--------------------------- | :------------------------------------------ |
| Auth works end-to-end        | Register → verify → login → 2FA → dashboard |
| Wallet accepts test deposits | M-Pesa sandbox → balance update             |
| Consensus market lifecycle   | Create → predict → close → settle → payout  |
| Group creation works         | Create → invite → join → create bet         |

**Users**: 5-10 (team members only)
**Data**: Test currency only (no real money)

### Phase 2: Closed Beta (Week 3-6)

**Scope**: Invite-only user group

| Milestone                            | Criteria                                      |
| :----------------------------------- | :-------------------------------------------- |
| All 4 public market types functional | Consensus, Reflex, Ladder, Prisoner's Dilemma |
| Winner Takes All groups functional   | Declaration → confirmation → payout           |
| Real M-Pesa deposits working         | Sandbox → production (low limits)             |
| Reputation scores calculating        | Accuracy + integrity weight updating          |

**Users**: 50-100 (invited users via referral)
**Data**: Real money with reduced limits (50% of normal tier limits)

### Phase 3: Open Beta (Week 7-12)

**Scope**: Public access with full feature set

| Milestone                         | Criteria                         |
| :-------------------------------- | :------------------------------- |
| All market types fully functional | Including Odd One Out groups     |
| Full tier limits active           | Normal novice/high_roller limits |
| Compliance monitoring live        | Automated flagging active        |
| Push notifications working        | FCM integration                  |
| Leaderboard functional            | Real-time rankings               |

**Users**: 500-2,000
**Data**: Full production with normal limits

---

## 4. Key Metrics to Track

### Engagement

| Metric                        | Target (Beta End) | Measurement                        |
| :---------------------------- | :---------------- | :--------------------------------- |
| DAU                           | 100+              | Active prediction or login per day |
| Predictions per user per week | 3+                | Average active user                |
| Group creation rate           | 2+ per day        | New groups                         |
| Avg group size                | 6+ members        | Members per group                  |
| Session duration              | 5+ minutes        | Average session                    |

### Financial

| Metric                     | Target (Beta End) | Measurement                    |
| :------------------------- | :---------------- | :----------------------------- |
| Total volume               | 500,000+ KSH      | Cumulative predictions         |
| Platform fee collected     | 25,000+ KSH       | 5% of volume                   |
| Avg prediction size        | 100+ KSH          | Per prediction                 |
| Deposit success rate       | >95%              | Successful deposits / attempts |
| Withdrawal processing time | <48h              | Request to completion          |

### Quality

| Metric                | Target (Beta End) | Measurement                         |
| :-------------------- | :---------------- | :---------------------------------- |
| Settlement accuracy   | 100%              | Correct payouts / total settlements |
| API uptime            | >99.5%            | Monthly availability                |
| P95 latency           | <500ms            | API response time                   |
| Crash-free rate       | >99%              | Frontend stability                  |
| Support ticket volume | <5/day            | End-user issues                     |

---

## 5. Known Gaps for Beta

### Must Resolve Before Beta

| Gap                               | Impact                             | Resolution                         |
| :-------------------------------- | :--------------------------------- | :--------------------------------- |
| Prisma vs MongoDB decision        | Cannot build backend               | Choose ONE ORM approach            |
| Frontend type drift (user fields) | API contract mismatch              | Align types to schema              |
| Syndicate market undefined        | Frontend page exists with no logic | Either implement or hide from beta |
| `membership.ts` uses localStorage | Won't work with real auth          | Replace with API calls             |

### Can Defer Past Beta

| Gap                                 | Impact                    | Planned Resolution        |
| :---------------------------------- | :------------------------ | :------------------------ |
| Advanced compliance (SAR reporting) | Manual monitoring only    | Implement when required   |
| Multi-language (Swahili)            | English-only beta         | Post-beta localization    |
| Accessibility improvements          | Basic compliance only     | Post-beta audit           |
| Exchange rate live updates          | Static rate during beta   | API integration post-beta |
| Terraform IaC                       | Manual cloud provisioning | Post-beta automation      |

---

## 6. Risk Mitigation

| Risk                                    | Likelihood | Impact   | Mitigation                                                                                       |
| :-------------------------------------- | :--------- | :------- | :----------------------------------------------------------------------------------------------- |
| M-Pesa API unreliable                   | Medium     | High     | Manual deposit confirmation fallback                                                             |
| Settlement bug causes incorrect payouts | Low        | Critical | Extensive test coverage, staging environment settlement, manual review for first 100 settlements |
| User fraud during beta                  | Medium     | Medium   | Low initial limits, manual review of first 50 users                                              |
| Regulatory inquiry                      | Low        | High     | Prepared response document, legal counsel on retainer                                            |
| Scale issues at 1,000+ users            | Low        | Medium   | Vertical scaling adequate for beta, horizontal scaling planned for v1.1                          |

---

## 7. Launch Day Checklist

### T-48 Hours

- [ ] All P0 tasks completed and verified
- [ ] Staging environment mirrors production
- [ ] M-Pesa production credentials configured
- [ ] Database backups automated (daily)
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented and tested

### T-24 Hours

- [ ] Final staging test pass (all market types)
- [ ] Load test with 100 concurrent users
- [ ] Security scan (OWASP ZAP or equivalent)
- [ ] Team briefed on incident response
- [ ] User onboarding flow tested end-to-end

### T-0 (Launch)

- [ ] Deploy to production
- [ ] Verify health checks
- [ ] Send invite codes to beta cohort
- [ ] Monitor error rates for first 2 hours
- [ ] First settlement completed successfully
- [ ] Team on-call for 72 hours post-launch

---

**CONFIDENTIAL PROPERTY OF ANTE SOCIAL**
_Beta Launch Plan v1.0 | February 2026_
