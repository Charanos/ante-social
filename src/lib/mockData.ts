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

export const leaderboardData = [
    {
        rank: 1,
        username: "CryptoKing",
        avatar: "CK",
        totalWinnings: 2847650,
        winRate: 78,
        activeBets: 156,
        trend: "up",
        badge: "legend"
    },
    {
        rank: 2,
        username: "BetMaster",
        avatar: "BM",
        totalWinnings: 2345100,
        winRate: 72,
        activeBets: 189,
        trend: "up",
        badge: "master"
    },
    {
        rank: 3,
        username: "LuckyStrike",
        avatar: "LS",
        totalWinnings: 1998750,
        winRate: 69,
        activeBets: 134,
        trend: "same",
        badge: "expert"
    },
    {
        rank: 4,
        username: "VibeCheck",
        avatar: "VC",
        totalWinnings: 1765400,
        winRate: 65,
        activeBets: 142,
        trend: "up",
        badge: "expert"
    },
    {
        rank: 5,
        username: "RiskTaker",
        avatar: "RT",
        totalWinnings: 1523900,
        winRate: 61,
        activeBets: 167,
        trend: "down",
        badge: "pro"
    },
    {
        rank: 6,
        username: "MoonBoy",
        avatar: "MB",
        totalWinnings: 1398200,
        winRate: 58,
        activeBets: 121,
        trend: "up",
        badge: "pro"
    },
    {
        rank: 7,
        username: "SmartMoney",
        avatar: "SM",
        totalWinnings: 1234560,
        winRate: 55,
        activeBets: 98,
        trend: "same",
        badge: "advanced"
    },
    {
        rank: 8,
        username: "QuickWin",
        avatar: "QW",
        totalWinnings: 1089450,
        winRate: 52,
        activeBets: 87,
        trend: "up",
        badge: "advanced"
    }
]

export const mockGroups = [
  {
    id: "group1",
    name: "Weekend Warriors",
    description: "Betting enthusiasts who live for the weekend action",
    avatar_url: null,
    member_count: 12,
    created_at: "2025-11-20",
    active_bets: 3,
    is_public: true,
    isPublic: true,
    creator_id: "user456",
    members: ["user123", "user456"],
    activeBets: [],
    activityFeed: [],
    category: "Sports",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "group2",
    name: "High Rollers Club",
    description: "For those who play big and win bigger",
    avatar_url: null,
    member_count: 8,
    created_at: "2025-11-18",
    active_bets: 5,
    is_public: false,
    isPublic: false,
    creator_id: "user123",
    members: ["user123"],
    activeBets: [],
    activityFeed: [],
    image: "https://images.unsplash.com/photo-1634704784915-aacf363b021f?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "group3",
    name: "Meme Lords",
    description: "Betting on internet culture and viral moments",
    avatar_url: null,
    member_count: 24,
    created_at: "2025-11-15",
    active_bets: 2,
    is_public: true,
    isPublic: true,
    creator_id: "user789",
    members: ["user789"],
    activeBets: [],
    activityFeed: [],
    category: "Social",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "group4",
    name: "Fortune Seekers",
    description: "Strategic players analyzing every bet",
    avatar_url: null,
    member_count: 15,
    created_at: "2025-11-22",
    active_bets: 4,
    is_public: false,
    isPublic: false,
    creator_id: "user999",
    members: ["user999"],
    activeBets: [],
    activityFeed: [],
    category: "Strategy",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "1",
    name: "Premier League Fanatics",
    description: "Discuss matches, predict outcomes, and bet on your favorite teams. Weekly analysis and live match betting.",
    member_count: 1240,
    active_bets: 15,
    category: "Sports",
    is_public: true,
    isPublic: true,
    creator_id: "user_001",
    trending: true,
    growth: "+12%",
    activeBets: [],
    activityFeed: [],
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "2",
    name: "Crypto Whales KE",
    description: "For serious crypto investors. Market predictions, portfolio discussions, and high-stakes trading bets.",
    member_count: 850,
    active_bets: 32,
    category: "Finance",
    is_public: true,
    isPublic: true,
    creator_id: "user_002",
    trending: true,
    growth: "+28%",
    activeBets: [],
    activityFeed: [],
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "3",
    name: "Nairobi Tech Community",
    description: "Tech enthusiasts betting on startup success, product launches, and industry trends in Kenya's tech scene.",
    member_count: 2100,
    active_bets: 8,
    category: "Tech",
    is_public: true,
    isPublic: true,
    creator_id: "user_003",
    trending: true,
    growth: "+8%",
    activeBets: [],
    activityFeed: [],
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "4",
    name: "Music Charts KE",
    description: "Predict which songs will dominate the charts. Weekly music releases and artist collaborations.",
    member_count: 645,
    active_bets: 12,
    category: "Entertainment",
    is_public: true,
    isPublic: true,
    creator_id: "user_004",
    trending: false,
    growth: "+5%",
    activeBets: [],
    activityFeed: [],
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "5",
    name: "Political Pulse",
    description: "Policy debates, election predictions, and political event betting. Informed and civil discussions only.",
    member_count: 1890,
    active_bets: 24,
    category: "Politics",
    is_public: true,
    isPublic: true,
    creator_id: "user_001",
    trending: false,
    growth: "+15%",
    activeBets: [],
    activityFeed: [],
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "6",
    name: "Gaming Arena",
    description: "Esports tournaments, game releases, and competitive gaming predictions. All platforms welcome.",
    member_count: 1320,
    active_bets: 19,
    category: "Gaming",
    is_public: true,
    isPublic: true,
    creator_id: "user_002",
    trending: false,
    growth: "+10%",
    activeBets: [],
    activityFeed: [],
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "7",
    name: "Nairobi Nightlife",
    description: "Best venues, event predictions, and weekend plans. For those who know where the vibe is.",
    member_count: 890,
    active_bets: 6,
    category: "Social",
    is_public: true,
    isPublic: true,
    creator_id: "user_003",
    trending: false,
    growth: "+3%",
    activeBets: [],
    activityFeed: [],
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "8",
    name: "Elite Traders Circle",
    description: "Private group for verified high-volume traders. Exclusive market analysis and insider predictions.",
    member_count: 234,
    active_bets: 18,
    category: "Finance",
    is_public: false,
    isPublic: false,
    creator_id: "user_004",
    trending: false,
    growth: "+6%",
    activeBets: [],
    activityFeed: [],
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80"
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

