// Mock data for dashboard presentation

export const mockUser = {
  id: "user123",
  username: "wormwood",
  email: "wormwood.p9@gmail.com",
  full_name: "TDewalt Mowtang",
  user_level: "novice",
  role: "admin", // Can be 'admin', 'group_admin', or 'user'
  wallet: {
    balance: 1250.50,
    total_deposits: 500,
    total_winnings: 980.50,
    total_losses: 230
  },
  managed_groups: ["group1", "group2"] // Groups this user can manage if they are group_admin
}

export const marketCategories = [
    "Sports", "Memes", "Social", "Crypto", "Gaming", "Politics", "Technology", "Entertainment"
]

export const mockLeaderboard = [
  {
    username: "@lucky_winner",
    achievement: "pulled a miracle",
    amount: 1250,
    rank: 1,
    avatar: "🔥"
  },
  {
    username: "@fortune_seeker",
    achievement: "escaped the abyss",
    amount: 980,
    rank: 2,
    avatar: "🎯"
  },
  {
    username: "@chaos_rider",
    achievement: "followed by chaos",
    amount: 750,
    rank: 3,
    avatar: "⚡"
  }
]

export const mockGroups = [
  {
    id: "group1",
    name: "Weekend Warriors",
    description: "Betting enthusiasts who live for the weekend action",
    avatar_url: null,
    member_count: 12,
    created_at: new Date("2025-11-20"),
    active_bets: 3,
    is_public: true,
    members: ["user123", "user456"]
  },
  {
    id: "group2",
    name: "High Rollers Club",
    description: "For those who play big and win bigger",
    avatar_url: null,
    member_count: 8,
    created_at: new Date("2025-11-18"),
    active_bets: 5,
    is_public: false,
    members: ["user123"]
  },
  {
    id: "group3",
    name: "Meme Lords",
    description: "Betting on internet culture and viral moments",
    avatar_url: null,
    member_count: 24,
    created_at: new Date("2025-11-15"),
    active_bets: 2,
    is_public: true,
    members: ["user789"]
  },
  {
    id: "group4",
    name: "Fortune Seekers",
    description: "Strategic players analyzing every bet",
    avatar_url: null,
    member_count: 15,
    created_at: new Date("2025-11-22"),
    active_bets: 4,
    is_public: false,
    members: ["user999"]
  }
]

export const mockNotifications = [
  {
    id: "notif1",
    type: "spin",
    title: "Wheel of Delusion",
    message: "The cosmos grants you: +25 MP",
    timestamp: new Date("2025-11-26T19:30:00"),
    is_read: false,
    icon: "🎡"
  },
  {
    id: "notif2",
    type: "withdrawal",
    title: "Withdrawal Completed",
    message: "Your withdrawal of $1000.00 has been sent to your wallet. Transaction: test1000",
    amount: 1000,
    timestamp: new Date("2025-11-17T06:11:00"),
    is_read: true,
    icon: "💸"
  },
  {
    id: "notif3",
    type: "withdrawal",
    title: "Withdrawal Rejected",
    message: "Your withdrawal request of $10.00 was rejected: suspicious",
    amount: 10,
    timestamp: new Date("2025-11-17T06:07:00"),
    is_read: true,
    icon: "❌"
  },
  {
    id: "notif4",
    type: "market",
    title: "Market Settled",
    message: "Your bet on 'What's your vibe?' has been settled. You won 150 MP!",
    timestamp: new Date("2025-11-25T14:20:00"),
    is_read: true,
    icon: "🎯"
  },
  {
    id: "notif5",
    type: "group",
    title: "Group Invite",
    message: "@chaos_rider invited you to join 'High Rollers Club'",
    timestamp: new Date("2025-11-24T10:15:00"),
    is_read: false,
    icon: "👥"
  }
]

export const mockTransactions = [
  {
    id: "tx1",
    type: "deposit",
    amount: 500,
    description: "USDT deposit via NOWPayments",
    status: "completed",
    created_date: new Date("2025-11-25T08:00:00")
  },
  {
    id: "tx2",
    type: "bet_entry",
    amount: -50,
    description: "Bet placed on 'What's your vibe?'",
    status: "completed",
    created_date: new Date("2025-11-25T10:30:00")
  },
  {
    id: "tx3",
    type: "payout",
    amount: 150,
    description: "Won bet: 'What's your vibe?'",
    status: "completed",
    created_date: new Date("2025-11-25T14:20:00")
  },
  {
    id: "tx4",
    type: "withdrawal",
    amount: -100,
    description: "Withdrawal to TRX address TXabc...123",
    status: "pending",
    created_date: new Date("2025-11-26T09:00:00")
  },
  {
    id: "tx5",
    type: "bet_entry",
    amount: -25,
    description: "Bet placed on 'Best meme 2025'",
    status: "completed",
    created_date: new Date("2025-11-26T11:00:00")
  }
]

export const mockMarkets = [
  {
    id: "market1",
    title: "What's your vibe right now?",
    description: "Pick the one that matches your brain's current state. Trust your gut — your mood might just make you money today.",
    tags: ["memes", "mood", "wager"],
    buy_in_amount: 1,
    participant_count: 3,
    total_pool: 1100,
    category: "Social media",
    status: "active",
    outcomes: [
      { id: "o1", option_text: "Chaotic energy", participant_count: 12 },
      { id: "o2", option_text: "Zen mode", participant_count: 8 },
      { id: "o3", option_text: "Procrastination nation", participant_count: 15 },
      { id: "o4", option_text: "Hustling hard", participant_count: 6 }
    ]
  },
  {
    id: "market2",
    title: "Most favorite meme so far",
    description: "Select which of the two memes you believe is the best of 2025. The meme with the most votes wins.",
    tags: ["Memes", "Social media"],
    buy_in_amount: 1,
    participant_count: 1,
    total_pool: 10,
    category: "Memes",
    status: "active",
    outcomes: [
      { id: "o1", option_text: "Distracted boyfriend", participant_count: 5 },
      { id: "o2", option_text: "Woman yelling at cat", participant_count: 8 }
    ]
  }
]

export const mockAdminStats = {
  totalUsers: 1247,
  totalRevenue: 15840.50,
  activeMarkets: 23,
  totalVolume: 89500,
  participants: 412,
  pendingPayouts: 12,
  pendingSettlements: 5,
  pendingWithdrawals: 8,
  flaggedMarkets: 3
}

export const mockAchievements = {
  stats: {
    balance: 1659,
    unlocked: 1,
    total: 22,
    earned: 40,
    streak: 1
  },
  dailyBonus: [
    { day: 1, reward: 15, claimed: true },
    { day: 2, reward: 25, claimed: false },
    { day: 3, reward: 30, claimed: false },
    { day: 4, reward: 45, claimed: false },
    { day: 5, reward: 50, claimed: false },
    { day: 6, reward: 55, claimed: false },
    { day: 7, reward: 100, claimed: false },
  ],
  inProgress: [
    { title: "Baby Gambler", description: "Place 5 bets. You're developing a habit.", reward: 15, progress: 20 },
    { title: "You're Getting Into This", description: "Log in 3 days in a row. Addiction looks good on you.", reward: 20, progress: 0 },
    { title: "Oracle of MP", description: "Accumulate 1000 MP. The prophecy unfolds.", reward: 100, progress: 100, claimable: true },
    { title: "Daily Grinder", description: "Log in 7 days in a row. Dedicated to delusion.", reward: 30, progress: 0 },
    { title: "Eternal Devotion", description: "Log in 30 days in a row. You need help.", reward: 150, progress: 0 },
  ],
  unlocked: [
    { title: "First Delusion", description: "Place your first bet. The journey into madness begins.", reward: 10, category: "Beginner", date: "12/1/2025" }
  ],
  locked: [
    { title: "Baby Gambler", description: "Place 5 bets. You're developing a habit.", reward: 15, category: "Beginner" },
    { title: "You're Getting Into This", description: "Log in 3 days in a row. Addiction looks good on you.", reward: 20, category: "Time Based" },
    { title: "Statistical Disaster", description: "Lose 5 bets in a row. The universe has spoken.", reward: 25, category: "Bad Luck" },
    { title: "Universe Hates You", description: "Spin the wheel and get 0 MP. Cosmic rejection.", reward: 0, category: "Wheel" },
    { title: "Wrong Every Time", description: "Finish last place 3 times. Consistency in failure.", reward: 30, category: "Bad Luck" },
    { title: "Prophet of Nonsense", description: "Correctly predict the majority outcome. Broken clock moment.", reward: 15, category: "Performance" },
    { title: "Clutch Victory", description: "Win by a margin of 1. Heart attack fuel.", reward: 40, category: "Performance" },
    { title: "Consistent Menace", description: "Finish in the top 3 five times. You're annoyingly good.", reward: 50, category: "Performance" },
    { title: "Oracle of MP", description: "Accumulate 1000 MP. The prophecy unfolds.", reward: 100, category: "Prestige" },
    { title: "All-In Lunatic", description: "Bet 90%+ of your balance. Therapy recommended.", reward: 50, category: "Risk" },
    { title: "Reckless Genius", description: "Win an all-in bet. Sometimes stupid works.", reward: 100, category: "Risk" },
    { title: "Reckless Idiot", description: "Lose an all-in bet. We all saw it coming.", reward: 10, category: "Risk" },
    { title: "Daily Grinder", description: "Log in 7 days in a row. Dedicated to delusion.", reward: 30, category: "Time Based" },
    { title: "Eternal Devotion", description: "Log in 30 days in a row. You need help.", reward: 150, category: "Time Based" },
    { title: "Spin Addict", description: "Spin the wheel 7 times. Dopamine dependency achieved.", reward: 35, category: "Wheel" },
    { title: "Blessed by Chaos", description: "Hit the 1000 MP jackpot. The gods smile upon idiots.", reward: 1000, category: "Wheel" },
    { title: "Influencer", description: "The majority follows your prediction. Shepherd of sheep.", reward: 60, category: "Social" },
    { title: "Echo Chamber Architect", description: "Get 3+ group members to follow your bet. Cult leader energy.", reward: 75, category: "Social" },
    { title: "MP Millionaire", description: "Accumulate 2000 MP. Wealth beyond reason.", reward: 200, category: "Prestige" },
    { title: "The Chosen One", description: "Win 3 markets in a single day. Fate's favorite fool.", reward: 150, category: "Prestige" },
    { title: "Motlaire Myth", description: "Participate in 100 markets. Legend status achieved.", reward: 500, category: "Prestige" }
  ]
}

export const mockMyBets = [
  {
    id: "bet1",
    marketId: "market1",
    title: "Who wins the Premier League?",
    amount: 50,
    status: "active",
    potentialWin: 250,
    type: "winner_takes_all",
    date: "2024-03-15",
    outcome: "Manchester City"
  },
  {
    id: "bet2",
    marketId: "market2",
    title: "Bitcoin hits $100k by Q3",
    amount: 100,
    status: "won",
    potentialWin: 180,
    type: "binary",
    date: "2024-01-10",
    outcome: "Yes"
  },
  {
    id: "bet3",
    marketId: "market3",
    title: "Will it rain on Saturday?",
    amount: 20,
    status: "lost",
    potentialWin: 40,
    type: "binary",
    date: "2024-02-28",
    outcome: "No"
  }
];

