// Mock data for dashboard presentation
import { Market, Position } from "@/types/market";
import { UserProfile } from "@/types/user";

export const mockUser: UserProfile = {
  id: "user123",
  username: "wormwood",
  fullName: "Dennis Wanyama",
  email: "dennis@example.com",
  avatarUrl: "https://i.pravatar.cc/150?u=wormwood",
  
  // Identity & Trust
  tier: "novice",
  reputationScore: 780,
  signalAccuracy: 65,
  joinedAt: "2025-11-20T10:00:00Z",
  
  // Financials
  balance: 1250.50,
  totalVolume: 5400,
  totalPnl: 980.50,
  totalWinnings: 1540.50,
  totalLosses: 560,
  
  // Social
  followersCount: 42,
  followingCount: 15,
  
  // Compliance
  isVerified: true,
  riskLimit: 1000,
  role: 'group_admin',
};

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
        username: "Crypto Analyst",
        avatarUrl: "https://i.pravatar.cc/150?u=crypto",
        totalWinnings: 2847650,
        winRate: 78,
        activePositions: 156,
        trend: "up",
        badge: "legend"
    },
    {
        rank: 2,
        username: "Forecaster Pro",
        avatarUrl: "https://i.pravatar.cc/150?u=forecaster",
        totalWinnings: 2345100,
        winRate: 72,
        activePositions: 189,
        trend: "up",
        badge: "master"
    },
    {
        rank: 3,
        username: "Lucky Strike",
        avatarUrl: "https://i.pravatar.cc/150?u=lucky",
        totalWinnings: 1998750,
        winRate: 69,
        activePositions: 134,
        trend: "same",
        badge: "expert"
    },
    {
        rank: 4,
        username: "Vibe Check",
        avatarUrl: "https://i.pravatar.cc/150?u=vibe",
        totalWinnings: 1765400,
        winRate: 65,
        activePositions: 142,
        trend: "up",
        badge: "expert"
    },
    {
        rank: 5,
        username: "Risk Taker",
        avatarUrl: "https://i.pravatar.cc/150?u=risk",
        totalWinnings: 1523900,
        winRate: 61,
        activePositions: 167,
        trend: "down",
        badge: "pro"
    },
    {
        rank: 6,
        username: "Signal Master",
        avatarUrl: "https://i.pravatar.cc/150?u=signal",
        totalWinnings: 1398200,
        winRate: 58,
        activePositions: 121,
        trend: "up",
        badge: "pro"
    },
    {
        rank: 7,
        username: "Smart Money",
        avatarUrl: "https://i.pravatar.cc/150?u=smart",
        totalWinnings: 1234560,
        winRate: 55,
        activePositions: 98,
        trend: "same",
        badge: "advanced"
    },
    {
        rank: 8,
        username: "Quick Win",
        avatarUrl: "https://i.pravatar.cc/150?u=quick",
        totalWinnings: 1089450,
        winRate: 52,
        activePositions: 87,
        trend: "up",
        badge: "advanced"
    }
]

export const mockGroups = [
  {
    id: "group1",
    name: "Weekend Warriors",
    description: "Forecasting enthusiasts who live for the weekend action",
    avatarUrl: null,
    memberCount: 12,
    createdAt: "2025-11-20",
    activePositionsCount: 3,
    isPublic: true,
    creatorId: "user456",
    members: ["user123", "user456"],
    activePositions: [],
    activityFeed: [],
    category: "Sports",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "group2",
    name: "High Rollers Club",
    description: "For those who stake big and win bigger in forecasting",
    avatarUrl: null,
    memberCount: 8,
    createdAt: "2025-11-18",
    activePositionsCount: 5,
    isPublic: false,
    creatorId: "user123",
    members: ["user123"],
    activePositions: [],
    activityFeed: [],
    category: "Finance",
    image: "https://images.unsplash.com/photo-1634704784915-aacf363b021f?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "group3",
    name: "Meme Lords",
    description: "Forecasting internet culture and viral moments",
    avatarUrl: null,
    memberCount: 24,
    createdAt: "2025-11-15",
    activePositionsCount: 2,
    isPublic: true,
    creatorId: "user789",
    members: ["user789"],
    activePositions: [],
    activityFeed: [],
    category: "Social",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "group4",
    name: "Fortune Seekers",
    description: "Strategic analysts forecasting every market",
    avatarUrl: null,
    memberCount: 15,
    createdAt: "2025-11-22",
    activePositionsCount: 4,
    isPublic: false,
    creatorId: "user999",
    members: ["user999"],
    activePositions: [],
    activityFeed: [],
    category: "Strategy",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "1",
    name: "Premier League Fanatics",
    description: "Discuss matches, predict outcomes, and forecast your favorite teams. Weekly analysis.",
    memberCount: 1240,
    activePositionsCount: 15,
    category: "Sports",
    isPublic: true,
    creatorId: "user_001",
    trending: true,
    growth: "+12%",
    activePositions: [],
    activityFeed: [],
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "2",
    name: "Crypto Whales KE",
    description: "For serious crypto investors. Market predictions, portfolio discussions, and high-stakes signals.",
    memberCount: 850,
    activePositionsCount: 32,
    category: "Finance",
    isPublic: true,
    creatorId: "user_002",
    trending: true,
    growth: "+28%",
    activePositions: [],
    activityFeed: [],
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "3",
    name: "Nairobi Tech Community",
    description: "Tech enthusiasts forecasting startup success, product launches, and industry trends in Kenya's tech scene.",
    memberCount: 2100,
    activePositionsCount: 8,
    category: "Tech",
    isPublic: true,
    creatorId: "user_003",
    trending: true,
    growth: "+8%",
    activePositions: [],
    activityFeed: [],
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "4",
    name: "Music Charts KE",
    description: "Predict which songs will dominate the charts. Weekly music releases and artist collaborations.",
    memberCount: 645,
    activePositionsCount: 12,
    category: "Entertainment",
    isPublic: true,
    creatorId: "user_004",
    trending: false,
    growth: "+5%",
    activePositions: [],
    activityFeed: [],
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "5",
    name: "Political Pulse",
    description: "Policy debates, election predictions, and political event forecasting. Informed and civil discussions only.",
    memberCount: 1890,
    activePositionsCount: 24,
    category: "Politics",
    isPublic: true,
    creatorId: "user_001",
    trending: false,
    growth: "+15%",
    activePositions: [],
    activityFeed: [],
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "6",
    name: "Gaming Arena",
    description: "Esports tournaments, game releases, and competitive gaming predictions. All platforms welcome.",
    memberCount: 1320,
    activePositionsCount: 19,
    category: "Gaming",
    isPublic: true,
    creatorId: "user_002",
    trending: false,
    growth: "+10%",
    activePositions: [],
    activityFeed: [],
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "7",
    name: "Nairobi Nightlife",
    description: "Best venues, event predictions, and weekend plans. For those who know where the vibe is.",
    memberCount: 890,
    activePositionsCount: 6,
    category: "Social",
    isPublic: true,
    creatorId: "user_003",
    trending: false,
    growth: "+3%",
    activePositions: [],
    activityFeed: [],
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "8",
    name: "Elite Traders Circle",
    description: "Private group for verified high-volume traders. Exclusive market analysis and insider signals.",
    memberCount: 234,
    activePositionsCount: 18,
    category: "Finance",
    isPublic: false,
    creatorId: "user_004",
    trending: false,
    growth: "+6%",
    activePositions: [],
    activityFeed: [],
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80"
  }
];

export const mockNotifications = [
  {
    id: "notif1",
    type: "spin",
    title: "Wheel of Signal",
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
    message: "Your position on 'What's your vibe?' has been settled. You yielded 150 MP!",
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
    description: "Position opened on 'What's your vibe?'",
    status: "completed",
    created_date: new Date("2025-11-25T10:30:00")
  },
  {
    id: "tx3",
    type: "payout",
    amount: 150,
    description: "Yield from: 'What's your vibe?'",
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
    description: "Position opened on 'Best meme 2025'",
    status: "completed",
    created_date: new Date("2025-11-26T11:00:00")
  }
]

export const mockMarkets: Market[] = [
  {
    id: "market1",
    title: "What's your vibe right now?",
    description: "Pick the one that matches your brain's current state. Trust your gut — your mood might just make you money today.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    type: "consensus",
    category: "Social media",
    
    poolAmount: 1100,
    volume: 5400,
    minStake: 1,
    
    createdAt: "2025-11-20T10:00:00Z",
    endsAt: "2025-11-30T10:00:00Z",
    
    status: "active",
    oracleType: "community_consensus",
    resolutionCriteria: "Market resolves based on the option with the highest volume at close.",
    
    probability: 45,
    signalStrength: 82,
    priceHistory: [30, 35, 32, 40, 45, 48, 45],
    
    participantCount: 3,
    commentCount: 12,
    shareCount: 5,
    
    tags: ["memes", "mood", "signal"],
  },
  {
    id: "market2",
    title: "Most favorite meme so far",
    description: "Select which of the two memes you believe is the best of 2025. The meme with the most votes wins.",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80",
    type: "reflex",
    category: "Memes",
    
    poolAmount: 10,
    volume: 850,
    minStake: 1,
    
    createdAt: "2025-11-22T10:00:00Z",
    endsAt: "2025-11-28T10:00:00Z",
    
    status: "active",
    oracleType: "manual",
    resolutionCriteria: "Market resolves based on external poll results from X (formerly Twitter).",
    
    probability: 60,
    signalStrength: 45,
    priceHistory: [50, 52, 55, 53, 58, 60],
    
    participantCount: 1,
    commentCount: 4,
    shareCount: 2,
    
    tags: ["memes", "social media"],
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
    { title: "Baby Analyst", description: "Place 5 forecasts. You're developing a habit.", reward: 15, progress: 20 },
    { title: "You're Getting Into This", description: "Log in 3 days in a row. Dedication looks good on you.", reward: 20, progress: 0 },
    { title: "Oracle of MP", description: "Accumulate 1000 MP. The prophecy unfolds.", reward: 100, progress: 100, claimable: true },
    { title: "Daily Grinder", description: "Log in 7 days in a row. Dedicated to data.", reward: 30, progress: 0 },
    { title: "Eternal Devotion", description: "Log in 30 days in a row. You are a power user.", reward: 150, progress: 0 },
  ],
  unlocked: [
    { title: "First Signal", description: "Place your first position. The journey begins.", reward: 10, category: "Beginner", date: "12/1/2025" }
  ],
  locked: [
    { title: "Baby Analyst", description: "Place 5 forecasts. You're developing a habit.", reward: 15, category: "Beginner" },
    { title: "You're Getting Into This", description: "Log in 3 days in a row. Dedication looks good on you.", reward: 20, category: "Time Based" },
    { title: "Statistical Outlier", description: "Lose 5 positions in a row. The market is irrational.", reward: 25, category: "Bad Luck" },
    { title: "Universe Hates You", description: "Spin the wheel and get 0 MP. Cosmic rejection.", reward: 0, category: "Wheel" },
    { title: "Contrarian Indicator", description: "Finish last place 3 times. Consistency in failure.", reward: 30, category: "Bad Luck" },
    { title: "Prophet of Consensus", description: "Correctly predict the majority outcome. Broken clock moment.", reward: 15, category: "Performance" },
    { title: "Clutch Victory", description: "Win by a margin of 1. Heart attack fuel.", reward: 40, category: "Performance" },
    { title: "Consistent Menace", description: "Finish in the top 3 five times. You're annoyingly good.", reward: 50, category: "Performance" },
    { title: "Oracle of MP", description: "Accumulate 1000 MP. The prophecy unfolds.", reward: 100, category: "Prestige" },
    { title: "Max Conviction", description: "Stake 90%+ of your balance. High conviction.", reward: 50, category: "Risk" },
    { title: "Reckless Genius", description: "Win an all-in position. Fortune favors the bold.", reward: 100, category: "Risk" },
    { title: "Liquidity Provider", description: "Lose an all-in position. Thank you for your service.", reward: 10, category: "Risk" },
    { title: "Daily Grinder", description: "Log in 7 days in a row. Dedicated to data.", reward: 30, category: "Time Based" },
    { title: "Eternal Devotion", description: "Log in 30 days in a row. You are a power user.", reward: 150, category: "Time Based" },
    { title: "Spin Addict", description: "Spin the wheel 7 times. Dopamine dependency achieved.", reward: 35, category: "Wheel" },
    { title: "Blessed by Chaos", description: "Hit the 1000 MP jackpot. The gods smile upon you.", reward: 1000, category: "Wheel" },
    { title: "Influencer", description: "The majority follows your prediction. Shepherd of sheep.", reward: 60, category: "Social" },
    { title: "Echo Chamber Architect", description: "Get 3+ group members to follow your position. Cult leader energy.", reward: 75, category: "Social" },
    { title: "MP Millionaire", description: "Accumulate 2000 MP. Wealth beyond reason.", reward: 200, category: "Prestige" },
    { title: "The Chosen One", description: "Win 3 markets in a single day. Fate's favorite.", reward: 150, category: "Prestige" },
    { title: "Market Maker", description: "Participate in 100 markets. Legend status achieved.", reward: 500, category: "Prestige" }
  ]
}

export const mockMyBets: Position[] = [
  {
    id: "bet1",
    marketId: "market1",
    userId: "user123",
    outcome: "Manchester City",
    stakeAmount: 50,
    entryPrice: 0.45,
    currentValue: 65,
    status: "active",
    openedAt: "2024-03-15T10:00:00Z"
  },
  {
    id: "bet2",
    marketId: "market2",
    userId: "user123",
    outcome: "Yes",
    stakeAmount: 100,
    entryPrice: 0.50,
    currentValue: 180,
    status: "settled",
    pnl: 80,
    openedAt: "2024-01-10T10:00:00Z"
  },
  {
    id: "bet3",
    marketId: "market3",
    userId: "user123",
    outcome: "No",
    stakeAmount: 20,
    entryPrice: 0.30,
    currentValue: 0,
    status: "settled",
    pnl: -20,
    openedAt: "2024-02-28T10:00:00Z"
  }
];

