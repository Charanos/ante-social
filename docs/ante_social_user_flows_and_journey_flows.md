# Ante Social - User Flows & Journey Maps

**PROPRIETARY INFORMATION – DO NOT SHARE**

---

## 1. User Onboarding Flow

### Registration Journey

```
START
  ↓
[Landing Page]
  - "Join Ante Social" CTA
  - Social proof (active users, total pools)
  - Theme toggle (light/dark) in top-right
  ↓
[Sign Up Form]
  - Username (check availability in real-time)
  - Email
  - Phone number (+254 format)
  - Password (strength meter)
  - Date of birth (auto-calculate age)
  - Currency preference: USD / KSH (defaults to KSH)
  - Checkbox: "I'm 18+ and agree to Terms"
  ↓
[Email Verification]
  - "Check your email"
  - Resend code option
  - Code input (6 digits, monospace font)
  - Auto-submit when 6 digits entered
  ↓
[Phone Verification]
  - SMS OTP to Kenyan number
  - Code input (6 digits, monospace)
  - Auto-detect and fill code
  ↓
[2FA Setup - Optional but Recommended]
  - "Secure Your Account"
  - Skip / Set Up Now
  
  IF Set Up:
    → QR code displayed
    → Scan with Google Authenticator / Authy
    → Enter 6-digit code to verify
    → Generate & save 10 backup codes
    → Download backup codes (monospace display)
  ↓
[Welcome Tutorial - Swipeable Cards]
  Card 1: "Welcome to Ante Social" (smooth fade-in)
  Card 2: "Your tier: Novice (66,225 KSH/day deposits)" (numbers in monospace)
  Card 3: "Choose your currency: USD or KSH" (currency selector)
  Card 4: "Browse Public Markets" (animated preview)
  Card 5: "Create or Join Groups" (animated preview)
  Card 6: "Ready to place your first bet?" (CTA)
  
  [Smooth swipe transitions with Framer Motion]
  ↓
[Onboarding Incentive]
  - "Get 13,245 KSH bonus on first deposit of 66,000+" (monospace numbers)
  - Skip / Deposit Now
  ↓
[Dashboard - First Time User State]
  - Empty state illustrations
  - "Explore Markets" button
  - "Create a Group" button
  ↓
END
```

### Key UX Decisions
- **No KYC initially** - Start betting immediately, trigger KYC at withdrawal
- **Gamified tutorial** - Skip option available but incentivized completion
- **Localized** - Kenyan phone format, M-Pesa as default payment

---

## 2. Deposit Flow

### M-Pesa Deposit Journey (Primary)

```
[Wallet Page]
  - Current balance: 0 KSH (monospace font)
  - Currency toggle: USD / KSH (smooth transition)
  - "Deposit" button (primary CTA, hover animation)
  - Skeleton loaders while data loads
  ↓
[Deposit Amount Screen]
  - Input field (monospace for numbers)
  - Quick amount buttons (smooth scale on tap):
    • 1,000 KSH
    • 5,000 KSH
    • 10,000 KSH
    • 20,000 KSH
  - Shows: "Daily limit: 33,113/66,225 KSH used" (progress bar animation)
  - Continue button (Framer Motion hover effect)
  ↓
[Payment Method Selection]
  - M-Pesa (default, highlighted with glow)
  - Crypto (USDT-TRC20, BTC, ETH)
  - Cards with smooth hover elevation
  ↓
[M-Pesa Instructions]
  - Animated step-by-step guide
  - Each step fades in with stagger effect
  
  1. Go to M-Pesa menu
  2. Select Lipa Na M-Pesa
  3. Select Pay Bill
  4. Enter Business Number: 123456 (copy button with haptic feedback)
  5. Enter Account Number: ANTE-USER123 (auto-copied, success toast)
  6. Enter Amount: 5,000 KSH (monospace)
  7. Enter PIN
  
  [Countdown Timer: 15:00 minutes (monospace, updates every second)]
  ↓
[Pending Confirmation]
  - Custom loading spinner (rotating gradient)
  - "Waiting for M-Pesa confirmation..."
  - Skeleton placeholder for transaction details
  - Webhook listens for payment
  - Average wait: 30-90 seconds
  - Real-time status updates with smooth transitions
  ↓
[Success State]
  - Confetti animation (Framer Motion)
  - Smooth number count-up animation
  - "5,000 KSH added to wallet!"
  - New balance: 5,000 KSH (animated)
  - Quick actions (fade in with stagger):
    • Browse Markets
    • Join a Group
  ↓
END
```

### Crypto Deposit Journey (Alternative)

```
[Payment Method Selection]
  - Select "Crypto"
  ↓
[Select Network]
  - Cards with crypto logos (smooth hover):
    • USDT-TRC20 (recommended, lowest fees)
    • Bitcoin (BTC)
    • Ethereum (ETH)
  ↓
[Crypto Deposit Screen]
  - Network badge (animated)
  - QR code (fade-in animation)
  - Wallet address (monospace, copy button)
  - "Send exactly: 5,000 KSH ≈ 37.75 USDT" (live conversion)
  - Warning: "Only send USDT-TRC20. Other assets will be lost."
  
  [Countdown: 30:00 minutes]
  ↓
[Pending Confirmation]
  - Custom spinner
  - "Waiting for blockchain confirmation..."
  - Confirmations: 0/12 (progress bar, monospace)
  - Estimated time: 5-10 minutes
  ↓
[Success State]
  - Same as M-Pesa success
  ↓
END
```

### Error Handling
- **Timeout (15 min)**: Modal with warning icon, "Payment expired. Please try again."
- **Payment failed**: "M-Pesa transaction failed. Check your balance and try again."
- **Limit exceeded**: "You've reached your daily deposit limit of 66,225 KSH. Resets in 8h 23m" (countdown in monospace)
- **Network error**: Toast notification, retry button with loading state

---

### Enhanced Login Flow with 2FA

```
[Login Page]
  - Theme toggle visible
  - Email input
  - Password input
  - "Remember me" checkbox
  - "Login" button (Framer Motion effects)
  - "Forgot password?" link
  ↓
[Credentials Verified]
  ↓
IF 2FA Enabled:
  ↓
  [2FA Code Entry]
    - "Enter 6-digit code from your authenticator"
    - 6 input boxes (monospace, auto-focus next)
    - Smooth slide-in animation
    - Each digit box has focus animation
    - Auto-submit when 6 digits entered
    - "Use backup code instead" link
    
    IF backup code selected:
      → [Backup Code Entry]
         - Single input: "ABC-123-DEF" format
         - Monospace font
         - Format validation
         - Warning: "This code can only be used once"
    ↓
  [2FA Verified]
    - Success animation
    - Smooth transition to dashboard
    ↓
ELSE:
  ↓
  [Login Success]
    - Optional prompt: "Enable 2FA for extra security?"
    - Skip / Set Up
    ↓
[Dashboard]
  - Page transition animation
  - Skeleton loaders → Real content
  - Smooth scroll enabled
  ↓
END
```

---

## 3. Public Market Betting Flow

### Poll-Style Market Example: "Best Nairobi Matatu Route"

```
[Markets Page]
  - Tabs: Active | Settling | Settled
  - Filter: Poll Style, Betrayal, Reflex, Prediction
  - Sort: Closing Soon, Highest Pool, Most Popular
  ↓
[Select Market Card]
  - Title: "Best Nairobi Matatu Route"
  - Pool: 2,450 USDT
  - Participants: 47
  - Closes: 2h 15m
  - Tap to open
  ↓
[Market Details]
  - Description
  - Options (with images):
    • Route 46 (Ngong Road)
    • Route 33 (Thika Road)  
    • Route 23 (Jogoo Road)
    • Route 11 (City Stadium)
  
  - Participants list (no option shown):
    • @jomo_bets - 50 USDT - 45 min ago
    • @nairobi_king - 125 USDT - 2h ago
    
  - Pool breakdown:
    Total: 2,450 USDT
    Fee (5%): 122.50 USDT
    Prize: 2,327.50 USDT
  ↓
[Select Option]
  - Tap option card (highlights)
  - "Route 33 (Thika Road)" selected
  ↓
[Enter Stake]
  - Stake input field
  - Quick amounts: 10, 25, 50, 100
  - Balance shown: 500 USDT
  - Min stake: 5 USDT
  
  - Preview:
    "You're betting 50 USDT on Route 33"
    "Potential pool share if winner: ~2-5x"
  ↓
[Confirmation Modal]
  - "Confirm Your Bet"
  - Option: Route 33 (Thika Road)
  - Stake: 50 USDT
  - "Your choice is hidden from others"
  - [Cancel] [Confirm Bet]
  ↓
[Bet Placed Success]
  - Haptic feedback
  - "Bet placed! 50 USDT on Route 33"
  - "Results in 2h 15m"
  - New balance: 450 USDT
  
  - Quick actions:
    • Share to Group
    • Browse More Markets
    • View My Bets
  ↓
[My Bets Tab - Active]
  - Shows all active bets
  - Countdown timers
  - Status: "Waiting for results"
  ↓
-- WAITING FOR MARKET CLOSE --
  ↓
[Push Notification]
  "🎯 Best Nairobi Matatu Route just settled!"
  ↓
[Results Screen]
  - Winning option: Route 33 (Thika Road) 🏆
  - Vote breakdown:
    • Route 33: 28 votes (59%)
    • Route 46: 12 votes (25%)
    • Route 23: 5 votes (11%)
    • Route 11: 2 votes (4%)
  
  - Your result:
    ✅ YOU WON!
    Stake: 50 USDT
    Payout: 165.50 USDT
    Profit: +115.50 USDT
  
  - Winners (28):
    • You - 165.50 USDT
    • @nairobi_king - 412.90 USDT
    • @jomo_bets - 165.50 USDT
    [+ 25 more]
  ↓
[Updated Wallet]
  - Balance: 615.50 USDT
  - Recent activity shows payout
  ↓
END
```

---

## 4. Private Group Flow

### Creating & Managing a Winner Takes All Bet

```
[Groups Tab]
  - My Groups (3)
  - "Create Group" button
  ↓
[Create Group]
  - Group name: "Friday Night Crew"
  - Description: "Weekly bets with the boys"
  - Privacy: Private (toggle)
  - Create button
  ↓
[Group Created]
  - Invite code generated: FN-CREW-2024
  - Share via:
    • WhatsApp
    • SMS
    • Copy link
  ↓
[Group Dashboard - Admin View]
  - Members (1/∞)
  - Active bets (0)
  - Total bets (0)
  - "Create Bet" button (primary)
  ↓
[Create Bet Form]
  - Bet type selector:
    • Winner Takes All (selected)
    • Odd One Out
  
  - Title: "Who will arrive last to the party?"
  - Description: "Annual late-arrival bet"
  
  - Options:
    [+ Add option]
    1. Alex
    2. Jamie
    3. Morgan
    4. Riley
  
  - Settings:
    • Minimum stake: 10 USDT
    • Closes: Manual (when I declare winner)
  
  - [Cancel] [Create Bet]
  ↓
[Bet Created - Active]
  - Status: Active
  - Pool: 0 USDT (nobody bet yet)
  
  - Activity Feed:
    "You created the bet 'Who will arrive last'"
  ↓
-- MEMBERS JOIN & BET --
  
  Activity updates:
  - "@jamie joined the group"
  - "@jamie placed 25 USDT on Option: Jamie"
  - "@alex placed 50 USDT on Option: Alex"
  - "@morgan placed 25 USDT on Option: Morgan"
  
  Pool now: 100 USDT
  ↓
-- REAL WORLD EVENT HAPPENS --
[Party concludes, Riley arrives last]
  ↓
[Admin Declares Winner]
  - Opens bet
  - "Declare Winner" button
  - Selects: @riley
  - Optional note: "Arrived 2 hours late 😂"
  - Confirm
  ↓
[Status: Pending Confirmation]
  
  - Notification to all members:
    "🏆 Admin declared @riley as winner"
    "Confirm or disagree within 12 hours"
  
  - Member view shows:
    [@riley - 25 USDT] - DECLARED WINNER
    [Confirm Winner] [Disagree]
  ↓
[Member Confirmations]
  Timeline:
  - 5 min: @jamie confirmed
  - 15 min: @alex confirmed
  - 30 min: @morgan confirmed
  
  Status: 3/3 non-admin confirmations
  ↓
[Auto-Finalization After 12h OR ≥1 Confirmation]
  - Status: Settled
  - Winner: @riley
  - Pool: 100 USDT
  - Fee: 5 USDT (5%)
  - Prize: 95 USDT
  
  - Payout:
    @riley receives 95 USDT
  ↓
[Winner Notification]
  "🎉 You won 95 USDT in Friday Night Crew!"
  "Bet: Who will arrive last to the party?"
  ↓
[Group Activity Feed - Final]
  - "@admin declared @riley as winner"
  - "@jamie confirmed the result"
  - "@alex confirmed the result"
  - "@morgan confirmed the result"
  - "Winner confirmed, payout finalized"
  - "@riley won 95 USDT! 💰"
  ↓
END
```

### Dispute Flow (Alternative Path)

```
[After Winner Declaration]
  ↓
[@morgan clicks "Disagree"]
  ↓
[Confirmation Modal]
  "Are you sure? This will pause payout for 
  everyone until the admin reviews."
  
  [Cancel] [Yes, Disagree]
  ↓
[Disagreement Recorded]
  - Status: Disputed
  - Payout: PAUSED
  
  - Notification to admin:
    "⚠️ @morgan disagreed with the winner declaration"
  
  - Activity feed:
    "@morgan disagreed - payout paused"
  ↓
[Admin Review]
  - Can see disagreement reason
  - Options:
    • Re-declare different winner (1 time only)
    • Contact support for manual resolution
  
  - If re-declares:
    → Back to pending confirmation flow
  
  - If doesn't re-declare within 48h:
    → Escalated to Ante Social support
  ↓
[Manual Resolution by Support]
  - Reviews evidence
  - Final decision made
  - Payout processed
  - Both parties notified
  ↓
END
```

---

## 5. Withdrawal Flow

### M-Pesa Withdrawal Journey

```
[Wallet Page]
  - Balance: 615.50 USDT
  - "Withdraw" button
  ↓
[KYC Check]
  IF first withdrawal OR high amount (>$500):
    → [KYC Verification Screen]
       - Upload ID (Kenyan ID / Passport)
       - Selfie verification
       - 24-48h review
       → Wait for approval
  ELSE:
    → Continue
  ↓
[Withdrawal Amount]
  - Input field
  - Max: 250 USDT (daily limit)
  - Shows: "0/250 USDT used today"
  - Available: 615.50 USDT
  
  - "Withdraw 200 USDT"
  ↓
[Withdrawal Method]
  - M-Pesa (default)
  - Bank Transfer
  ↓
[M-Pesa Details]
  - Phone number: +254 712 345 678
  - Confirm number
  - [Update] if needed
  ↓
[Confirmation]
  Amount: 200 USDT
  Method: M-Pesa
  Phone: +254 712 345 678
  Processing time: 24-48 hours
  Fee: 0 USDT (we cover it)
  
  You'll receive: 200 USDT
  
  [Cancel] [Confirm Withdrawal]
  ↓
[Withdrawal Requested]
  - "Withdrawal request submitted"
  - Reference: WD-20240125-A1B2
  - Status: Pending
  - "We'll notify you when processed"
  
  - New balance: 415.50 USDT
    (200 USDT in pending withdrawal)
  ↓
-- 12-48 HOURS LATER --
  ↓
[Push Notification]
  "💸 Your 200 USDT withdrawal has been processed!"
  ↓
[M-Pesa Confirmation]
  - User receives M-Pesa message
  - "You have received 200 USDT from Ante Social"
  ↓
[Transaction Complete]
  - Status: Completed
  - Wallet reflects final balance
  ↓
END
```

---

## 6. Reflex Reaction Test Flow

### Example: "Majority First Instinct" Game

```
[Browse Markets]
  ↓
[Reflex Reaction Market]
  - Title: "When added to a group chat..."
  - Type: Reflex Reaction Test
  - 5-second decision time
  - Pool: 1,200 USDT
  - Participants: 85
  - Closes: 30 minutes
  ↓
[Market Details]
  Question: "When suddenly added to a new 
  group chat, the majority would..."
  
  Options:
  A. Leave immediately
  B. Mute notifications
  C. Ask "who's this?"
  D. Pretend they didn't see it
  E. Participate just for fun
  
  Rules explained:
  "Predict minority = bigger multiplier!
   < 45% = 2.0x
   45-55% = 1.3x
   56-70% = 1.05x
   > 70% = 1.0x"
  ↓
[Enter Stake First]
  - Unlike other markets, stake FIRST
  - "Lock in: 50 USDT"
  - Can't change after countdown
  ↓
[Countdown Begins]
  
  [Large centered counter]
  
  5... "READY"
  4... "SET"
  3... 
  2...
  1...
  0... "CHOOSE NOW!"
  
  [Options appear, fullscreen takeover]
  
  Tap FAST:
  [Leave immediately]
  [Mute notifications]
  [Ask "who's this?"]
  [Pretend they didn't see it]
  [Participate just for fun]
  
  → User taps "Mute notifications"
  ↓
[Immediate Feedback]
  - "Choice locked! 🔒"
  - Your pick: Mute notifications
  - Stake: 50 USDT
  - "Results when market closes in 28m"
  ↓
-- MARKET CLOSES --
  ↓
[Results Reveal - Animated]
  
  Vote distribution:
  - Leave immediately: 15% (13 votes)
  - Mute notifications: 38% (32 votes) ← YOU
  - Ask "who's this?": 8% (7 votes)
  - Pretend didn't see: 19% (16 votes)
  - Participate for fun: 20% (17 votes)
  
  Majority picked: Mute notifications (38%)
  
  Your tier: A (minority < 45%)
  Multiplier: 2.0x! 🎯
  
  Calculation:
  - Your stake: 50 USDT
  - Base payout: 62.50 USDT
  - With 2.0x multiplier: 125 USDT
  
  Message: "Fortune favors the absurd. 
  You bet against reason and reason lost!"
  
  Final payout: 125 USDT
  Profit: +75 USDT
  ↓
END
```

---

## 7. Dashboard & Navigation

### Main App Structure

```
[Bottom Navigation]
┌─────────────────────────────────────────┐
│  🏠 Home  |  🎯 Markets  |  👥 Groups  │
│  💰 Wallet  |  👤 Profile               │
└─────────────────────────────────────────┘

[Home Tab]
  - Welcome banner
  - Quick stats: Win rate, Total wagered
  - Featured markets (3-4 cards)
  - Recent activity feed
  - Quick actions: Deposit, Invite Friends

[Markets Tab]
  - Search bar
  - Filter chips: All, Poll, Betrayal, Reflex, Prediction
  - Sort: Closing Soon, Highest Pool, New
  - Market cards (infinite scroll)
  - "My Active Bets" pinned section

[Groups Tab]
  - "My Groups" list
  - Recent group activity
  - "Create Group" FAB
  - "Join with Code" option
  - Group invites (badge if any)

[Wallet Tab]
  - Balance (large, prominent)
  - Daily limits progress bars
  - Quick actions: Deposit, Withdraw
  - Transaction history
  - Tier badge & info

[Profile Tab]
  - Avatar & username
  - Tier badge
  - Stats: Total bets, Win rate, Biggest win
  - Settings
  - Help & Support
  - Logout
```

---

## 8. Edge Cases & Error States

### Insufficient Balance
```
User tries to bet 100 USDT with 50 USDT balance
  ↓
[Error Modal]
  "Insufficient Balance"
  "You need 100 USDT but have 50 USDT"
  
  [Deposit Now] [Cancel]
```

### Market Closed During Bet
```
User places bet, but market closed 1 second prior
  ↓
[Error State]
  "Market just closed!"
  "This market closed while you were placing your bet"
  "Your wallet was not charged"
  
  [Browse Other Markets]
```

### Daily Limit Reached
```
User tries to deposit 600 USDT as novice (limit: 500)
  ↓
[Warning Modal]
  "Daily Limit Reached"
  "Novice tier: 500 USDT/day
   You've used: 450 USDT
   Available: 50 USDT
   Resets in: 8h 23m"
  
  Options:
  - Deposit 50 USDT (max available)
  - Try again tomorrow
  - Learn about High Roller tier
```

### Network Error
```
[Offline State - Banner]
  "⚠️ No internet connection"
  "Some features may not work"
  
  Cached content still viewable
  Actions disabled until reconnected
```

### Settlement Tie (Odd One Out)
```
Everyone in group picks same option
  ↓
[Tie State]
  "It's a Tie!"
  "Everyone chose the same option"
  "House keeps the 5% fee"
  "Remaining 95% refunded to all"
  
  Your refund: 47.50 USDT (from 50 stake)
  
  Message: "Everyone chose the same. 
  House keeps the fee; try again, fools."
```

---

## 9. Notifications Strategy

### Push Notifications

**Transactional:**
- Deposit confirmed
- Withdrawal processed
- Bet placed successfully
- Market settled (you participated)
- Payout received

**Social:**
- Friend joined your group
- New bet created in group
- Winner declared (needs confirmation)
- Someone confirmed/disagreed result
- Group invitation

**Engagement:**
- Market closing soon (1 hour before)
- "You haven't bet in 3 days"
- Weekly summary (wins, losses, highlight)
- Tier upgrade notification

**Compliance:**
- Daily limit warning (80% reached)
- Account verification required
- Suspicious activity detected

### In-App Notifications
- Real-time activity feed in groups
- Market status changes
- Wallet balance updates
- Badge unlocks

---

## 10. Accessibility Considerations

- **Color Blind Mode**: Use patterns + colors for win/loss
- **Screen Reader**: All buttons properly labeled
- **Font Scaling**: Supports system font size
- **High Contrast**: Option in settings
- **Haptic Feedback**: Confirm important actions
- **Offline Mode**: Cache recent data
- **Language**: English + Swahili support

---

**CONFIDENTIAL PROPERTY OF ANTE SOCIAL**  
*User Flows Version 1.0 | January 2026*