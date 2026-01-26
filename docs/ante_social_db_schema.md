// Ante Social - MongoDB Database Schema
// MongoDB 6.0+
// PROPRIETARY & CONFIDENTIAL

// =====================================================
// USERS & AUTHENTICATION
// =====================================================

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "passwordHash", "dateOfBirth", "tier"],
      properties: {
        _id: { bsonType: "objectId" },
        username: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9_]{3,20}$",
          description: "Alphanumeric username, 3-20 characters"
        },
        email: {
          bsonType: "string",
          pattern: "^[^@]+@[^@]+\\.[^@]+$"
        },
        phoneNumber: {
          bsonType: "string",
          pattern: "^\\+254[0-9]{9}$",
          description: "Kenyan phone format"
        },
        passwordHash: { bsonType: "string" },
        dateOfBirth: {
          bsonType: "date",
          description: "Must be 18+ years old"
        },
        
        // 2FA
        twoFactorEnabled: {
          bsonType: "bool",
          description: "Whether 2FA is enabled"
        },
        twoFactorSecret: {
          bsonType: "string",
          description: "TOTP secret for 2FA"
        },
        backupCodes: {
          bsonType: "array",
          items: { bsonType: "string" },
          description: "Recovery codes for 2FA"
        },
        
        // Tier & Status
        tier: {
          enum: ["novice", "high_roller"],
          description: "User tier level"
        },
        accountStatus: {
          enum: ["active", "frozen", "suspended", "closed"],
          description: "Account status"
        },
        
        // Profile
        avatarUrl: { bsonType: "string" },
        bio: { bsonType: "string" },
        
        // Preferences
        preferences: {
          bsonType: "object",
          properties: {
            theme: { enum: ["light", "dark"] },
            currency: { enum: ["USD", "KSH"] },
            notifications: {
              bsonType: "object",
              properties: {
                email: { bsonType: "bool" },
                push: { bsonType: "bool" },
                sms: { bsonType: "bool" }
              }
            }
          }
        },
        
        // Timestamps
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        lastLoginAt: { bsonType: "date" }
      }
    }
  }
});

// Indexes for users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ phoneNumber: 1 }, { sparse: true });
db.users.createIndex({ tier: 1 });
db.users.createIndex({ accountStatus: 1 });
db.users.createIndex({ createdAt: -1 });

// Example user document
/*
{
  _id: ObjectId("..."),
  username: "betting_king",
  email: "king@example.com",
  phoneNumber: "+254712345678",
  passwordHash: "$2b$12$...",
  dateOfBirth: ISODate("1995-06-15"),
  twoFactorEnabled: true,
  twoFactorSecret: "JBSWY3DPEHPK3PXP",
  backupCodes: ["ABC123", "DEF456", "GHI789"],
  tier: "novice",
  accountStatus: "active",
  avatarUrl: "https://cdn.antesocial.com/avatars/123.jpg",
  bio: "Nairobi's finest bettor",
  preferences: {
    theme: "dark",
    currency: "KSH",
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  },
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-20T14:22:00Z"),
  lastLoginAt: ISODate("2024-01-25T08:15:00Z")
}
*/


// =====================================================
// AUTHENTICATION SESSIONS
// =====================================================

db.createCollection("authSessions");

db.authSessions.createIndex({ userId: 1 });
db.authSessions.createIndex({ tokenHash: 1 });
db.authSessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/*
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  tokenHash: "sha256_hash",
  expiresAt: ISODate("2024-02-25T08:15:00Z"),
  createdAt: ISODate("2024-01-25T08:15:00Z"),
  ipAddress: "196.207.123.45",
  userAgent: "Mozilla/5.0...",
  deviceInfo: {
    type: "mobile",
    os: "Android",
    browser: "Chrome"
  }
}
*/


// =====================================================
// WALLETS
// =====================================================

db.createCollection("wallets", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "balances"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "objectId" },
        balances: {
          bsonType: "object",
          properties: {
            USD: {
              bsonType: "object",
              properties: {
                available: { bsonType: "decimal" },
                pending: { bsonType: "decimal" }
              }
            },
            KSH: {
              bsonType: "object",
              properties: {
                available: { bsonType: "decimal" },
                pending: { bsonType: "decimal" }
              }
            }
          }
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.wallets.createIndex({ userId: 1 }, { unique: true });

/*
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  balances: {
    USD: {
      available: NumberDecimal("1250.75"),
      pending: NumberDecimal("200.00")
    },
    KSH: {
      available: NumberDecimal("165432.50"),
      pending: NumberDecimal("0.00")
    }
  },
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-25T14:22:00Z")
}
*/


// =====================================================
// TRANSACTIONS
// =====================================================

db.createCollection("transactions");

db.transactions.createIndex({ userId: 1, createdAt: -1 });
db.transactions.createIndex({ walletId: 1 });
db.transactions.createIndex({ type: 1, status: 1 });
db.transactions.createIndex({ "paymentDetails.reference": 1 }, { sparse: true });

/*
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  walletId: ObjectId("..."),
  
  type: "deposit", // deposit, withdrawal, bet_placed, bet_payout, refund, platform_fee
  status: "completed", // pending, completed, failed, cancelled
  
  amount: NumberDecimal("100.00"),
  currency: "KSH",
  
  paymentDetails: {
    method: "mpesa", // mpesa, crypto
    reference: "RBK1A2B3C4",
    
    // For M-Pesa
    mpesa: {
      phoneNumber: "+254712345678",
      transactionId: "RBK1A2B3C4",
      businessNumber: "123456",
      accountNumber: "ANTE-USER123"
    },
    
    // For Crypto
    crypto: {
      network: "USDT-TRC20",
      address: "TXyZ123...",
      txHash: "0xabc123...",
      confirmations: 12
    }
  },
  
  // Related entities
  betId: ObjectId("..."),
  marketId: ObjectId("..."),
  
  description: "M-Pesa deposit",
  metadata: {
    conversionRate: 132.45, // KSH to USD rate at transaction time
    originalAmount: 13245.00,
    originalCurrency: "KSH"
  },
  
  createdAt: ISODate("2024-01-25T10:15:00Z"),
  completedAt: ISODate("2024-01-25T10:16:30Z")
}
*/


// =====================================================
// DAILY LIMITS
// =====================================================

db.createCollection("dailyLimits");

db.dailyLimits.createIndex({ userId: 1, date: 1 }, { unique: true });
db.dailyLimits.createIndex({ date: -1 });

/*
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  date: ISODate("2024-01-25T00:00:00Z"),
  
  limitsUsed: {
    USD: {
      deposits: NumberDecimal("450.00"),
      withdrawals: NumberDecimal("0.00")
    },
    KSH: {
      deposits: NumberDecimal("59602.50"),
      withdrawals: NumberDecimal("0.00")
    }
  },
  
  createdAt: ISODate("2024-01-25T08:15:00Z"),
  updatedAt: ISODate("2024-01-25T14:22:00Z")
}
*/


// =====================================================
// PUBLIC MARKETS
// =====================================================

db.createCollection("publicMarkets");

db.publicMarkets.createIndex({ type: 1, status: 1 });
db.publicMarkets.createIndex({ status: 1, closesAt: 1 });
db.publicMarkets.createIndex({ createdAt: -1 });

/*
{
  _id: ObjectId("..."),
  type: "poll_style", // poll_style, betrayal_game, reflex_reaction, majority_prediction
  
  title: "Best Nairobi matatu route?",
  description: "Vote for the most reliable route",
  
  status: "active", // draft, active, closed, settling, settled, cancelled
  
  options: [
    {
      optionId: ObjectId("..."),
      text: "Route 46 (Ngong Road)",
      mediaUrl: "https://cdn.antesocial.com/...",
      displayOrder: 0,
      voteCount: 0,
      totalStake: {
        USD: NumberDecimal("0.00"),
        KSH: NumberDecimal("0.00")
      }
    },
    {
      optionId: ObjectId("..."),
      text: "Route 33 (Thika Road)",
      mediaUrl: null,
      displayOrder: 1,
      voteCount: 0,
      totalStake: {
        USD: NumberDecimal("0.00"),
        KSH: NumberDecimal("0.00")
      }
    }
  ],
  
  // Financial tracking (multi-currency)
  pools: {
    USD: {
      totalPool: NumberDecimal("2450.00"),
      platformFee: NumberDecimal("122.50"),
      prizePoolAfterFees: NumberDecimal("2327.50"),
      totalPaidOut: NumberDecimal("0.00")
    },
    KSH: {
      totalPool: NumberDecimal("324525.00"),
      platformFee: NumberDecimal("16226.25"),
      prizePoolAfterFees: NumberDecimal("308298.75"),
      totalPaidOut: NumberDecimal("0.00")
    }
  },
  
  // Timing
  opensAt: ISODate("2024-01-25T08:00:00Z"),
  closesAt: ISODate("2024-01-25T18:00:00Z"),
  settledAt: null,
  
  // Metadata
  createdBy: ObjectId("..."),
  config: {
    // Type-specific configuration
    allowMediaUploads: true,
    minStake: NumberDecimal("5.00"),
    maxStake: NumberDecimal("1000.00")
  },
  
  // Results (populated after settlement)
  results: {
    winningOptionId: ObjectId("..."),
    winnerCount: 28,
    settlementMetadata: {}
  },
  
  createdAt: ISODate("2024-01-25T08:00:00Z"),
  updatedAt: ISODate("2024-01-25T14:22:00Z")
}
*/


// =====================================================
// MARKET BETS
// =====================================================

db.createCollection("marketBets");

db.marketBets.createIndex({ marketId: 1, userId: 1 }, { unique: true });
db.marketBets.createIndex({ userId: 1, placedAt: -1 });
db.marketBets.createIndex({ marketId: 1, isWinner: 1 });

/*
{
  _id: ObjectId("..."),
  marketId: ObjectId("..."),
  userId: ObjectId("..."),
  optionId: ObjectId("..."),
  
  stake: NumberDecimal("50.00"),
  currency: "USD",
  integrityWeight: NumberDecimal("1.00"), // 0.8 for new users, 1.0 for established
  
  // Payout tracking
  payout: NumberDecimal("165.50"),
  isWinner: true,
  
  placedAt: ISODate("2024-01-25T10:30:00Z"),
  settledAt: ISODate("2024-01-25T18:05:00Z")
}
*/


// =====================================================
// BETTING GROUPS
// =====================================================

db.createCollection("bettingGroups");

db.bettingGroups.createIndex({ adminId: 1 });
db.bettingGroups.createIndex({ inviteCode: 1 }, { unique: true });
db.bettingGroups.createIndex({ "members.userId": 1 });

/*
{
  _id: ObjectId("..."),
  name: "Friday Night Crew",
  description: "Weekly bets with the boys",
  
  adminId: ObjectId("..."),
  inviteCode: "FN-CREW-2024",
  isPrivate: true,
  
  members: [
    {
      userId: ObjectId("..."),
      username: "betting_king",
      role: "admin", // admin, member
      joinedAt: ISODate("2024-01-15T10:00:00Z")
    },
    {
      userId: ObjectId("..."),
      username: "jamie_bets",
      role: "member",
      joinedAt: ISODate("2024-01-16T14:30:00Z")
    }
  ],
  
  stats: {
    totalBets: 15,
    activeBets: 2,
    totalVolume: {
      USD: NumberDecimal("5420.00"),
      KSH: NumberDecimal("718050.00")
    }
  },
  
  createdAt: ISODate("2024-01-15T10:00:00Z"),
  updatedAt: ISODate("2024-01-25T14:22:00Z")
}
*/


// =====================================================
// GROUP BETS
// =====================================================

db.createCollection("groupBets");

db.groupBets.createIndex({ groupId: 1, status: 1 });
db.groupBets.createIndex({ groupId: 1, createdAt: -1 });

/*
{
  _id: ObjectId("..."),
  groupId: ObjectId("..."),
  type: "winner_takes_all", // winner_takes_all, odd_one_out
  
  title: "Who will arrive last to the party?",
  description: "Annual late-arrival bet",
  status: "settled", // active, closed, pending_confirmation, disputed, settled, cancelled
  
  options: [
    {
      optionId: ObjectId("..."),
      text: "Alex",
      displayOrder: 0,
      voteCount: 1,
      totalStake: {
        USD: NumberDecimal("50.00"),
        KSH: NumberDecimal("0.00")
      }
    },
    {
      optionId: ObjectId("..."),
      text: "Jamie",
      displayOrder: 1,
      voteCount: 1,
      totalStake: {
        USD: NumberDecimal("25.00"),
        KSH: NumberDecimal("0.00")
      }
    }
  ],
  
  minimumStake: NumberDecimal("10.00"),
  
  // Financial tracking
  pools: {
    USD: {
      totalPool: NumberDecimal("100.00"),
      platformFee: NumberDecimal("5.00"),
      prizePoolAfterFees: NumberDecimal("95.00"),
      totalPaidOut: NumberDecimal("95.00")
    },
    KSH: {
      totalPool: NumberDecimal("0.00"),
      platformFee: NumberDecimal("0.00"),
      prizePoolAfterFees: NumberDecimal("0.00"),
      totalPaidOut: NumberDecimal("0.00")
    }
  },
  
  // Winner Takes All specific
  declaredWinnerId: ObjectId("..."),
  declaredBy: ObjectId("..."),
  declaredAt: ISODate("2024-01-25T22:00:00Z"),
  confirmationDeadline: ISODate("2024-01-26T10:00:00Z"),
  
  confirmations: [
    {
      userId: ObjectId("..."),
      action: "confirm", // confirm, disagree
      comment: "Yeah he was 2 hours late 😂",
      createdAt: ISODate("2024-01-25T22:05:00Z")
    }
  ],
  
  // Timing
  createdBy: ObjectId("..."),
  closesAt: null, // Manual close for winner_takes_all
  settledAt: ISODate("2024-01-26T10:00:00Z"),
  
  createdAt: ISODate("2024-01-25T18:00:00Z"),
  updatedAt: ISODate("2024-01-26T10:00:00Z")
}
*/


// =====================================================
// GROUP BET ENTRIES
// =====================================================

db.createCollection("groupBetEntries");

db.groupBetEntries.createIndex({ betId: 1, userId: 1 }, { unique: true });
db.groupBetEntries.createIndex({ userId: 1, placedAt: -1 });

/*
{
  _id: ObjectId("..."),
  betId: ObjectId("..."),
  userId: ObjectId("..."),
  optionId: ObjectId("..."),
  
  stake: NumberDecimal("25.00"),
  currency: "USD",
  payout: NumberDecimal("95.00"),
  isWinner: true,
  
  placedAt: ISODate("2024-01-25T18:30:00Z"),
  settledAt: ISODate("2024-01-26T10:00:00Z")
}
*/


// =====================================================
// ACTIVITY LOGS
// =====================================================

db.createCollection("activityLogs");

db.activityLogs.createIndex({ userId: 1, createdAt: -1 });
db.activityLogs.createIndex({ type: 1, createdAt: -1 });
db.activityLogs.createIndex({ groupId: 1, createdAt: -1 }, { sparse: true });

/*
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  type: "bet_placed", // user_registered, bet_placed, bet_won, deposit_completed, etc.
  
  description: "Placed 50 USD on Poll-Style market",
  
  // Context
  groupId: null,
  betId: ObjectId("..."),
  marketId: ObjectId("..."),
  
  metadata: {
    amount: NumberDecimal("50.00"),
    currency: "USD",
    marketTitle: "Best Nairobi matatu route?"
  },
  
  ipAddress: "196.207.123.45",
  
  createdAt: ISODate("2024-01-25T10:30:00Z")
}
*/


// =====================================================
// AUDIT LOGS (Admin Actions)
// =====================================================

db.createCollection("auditLogs");

db.auditLogs.createIndex({ adminUserId: 1, createdAt: -1 });
db.auditLogs.createIndex({ targetUserId: 1, createdAt: -1 });
db.auditLogs.createIndex({ createdAt: -1 });

/*
{
  _id: ObjectId("..."),
  adminUserId: ObjectId("..."),
  action: "tier_upgrade",
  targetUserId: ObjectId("..."),
  
  oldValue: { tier: "novice" },
  newValue: { tier: "high_roller" },
  reason: "Consistent high-volume betting",
  
  ipAddress: "196.207.123.45",
  userAgent: "Mozilla/5.0...",
  
  createdAt: ISODate("2024-01-25T14:00:00Z")
}
*/


// =====================================================
// COMPLIANCE FLAGS
// =====================================================

db.createCollection("complianceFlags");

db.complianceFlags.createIndex({ userId: 1, status: 1 });
db.complianceFlags.createIndex({ status: 1, flaggedAt: -1 });
db.complianceFlags.createIndex({ type: 1 });

/*
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  
  type: "structuring", // structuring, velocity, unusual_pattern, manual_review
  status: "pending_review", // pending_review, investigating, resolved, escalated
  
  description: "Multiple small deposits detected",
  details: {
    depositCount: 15,
    totalAmount: NumberDecimal("495.00"),
    timeWindow: "2 hours",
    averageAmount: NumberDecimal("33.00")
  },
  
  // Resolution
  reviewedBy: null,
  resolutionNotes: null,
  
  flaggedAt: ISODate("2024-01-25T12:00:00Z"),
  resolvedAt: null
}
*/


// =====================================================
// NOTIFICATIONS
// =====================================================

db.createCollection("notifications");

db.notifications.createIndex({ userId: 1, isRead: 1, createdAt: -1 });
db.notifications.createIndex({ createdAt: -1 });

/*
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  
  type: "bet_won", // bet_won, bet_lost, deposit_confirmed, etc.
  title: "You Won!",
  message: "You won 165.50 USD in 'Best Nairobi matatu route?'",
  
  isRead: false,
  
  // Links
  actionUrl: "/markets/65b1a2b3c4d5e6f7g8h9i0j1",
  relatedId: ObjectId("..."),
  
  createdAt: ISODate("2024-01-25T18:05:00Z"),
  readAt: null
}
*/


// =====================================================
// CURRENCY EXCHANGE RATES (Cached)
// =====================================================

db.createCollection("exchangeRates");

db.exchangeRates.createIndex({ updatedAt: -1 });
db.exchangeRates.createIndex({ "rates.USD": 1, "rates.KSH": 1 });

/*
{
  _id: ObjectId("..."),
  baseCurrency: "USD",
  rates: {
    KSH: NumberDecimal("132.45"),
    USD: NumberDecimal("1.00")
  },
  source: "exchangerate-api.com",
  updatedAt: ISODate("2024-01-25T00:00:00Z")
}
*/


// =====================================================
// APP CONFIGURATION
// =====================================================

db.createCollection("appConfig");

/*
{
  _id: ObjectId("..."),
  key: "tier_limits",
  value: {
    novice: {
      dailyDepositLimit: { USD: 500, KSH: 66225 },
      dailyWithdrawalLimit: { USD: 250, KSH: 33112.50 }
    },
    high_roller: {
      dailyDepositLimit: { USD: 5000, KSH: 662250 },
      dailyWithdrawalLimit: { USD: 1000, KSH: 132450 }
    }
  },
  updatedAt: ISODate("2024-01-25T00:00:00Z")
}

{
  _id: ObjectId("..."),
  key: "platform_fee_percentage",
  value: 5.0,
  updatedAt: ISODate("2024-01-01T00:00:00Z")
}

{
  _id: ObjectId("..."),
  key: "payment_methods",
  value: {
    enabled: ["mpesa", "crypto"],
    mpesa: {
      businessNumber: "123456",
      accountPrefix: "ANTE-"
    },
    crypto: {
      networks: ["USDT-TRC20", "BTC", "ETH"],
      addresses: {
        "USDT-TRC20": "TXyZ123...",
        "BTC": "bc1q...",
        "ETH": "0x..."
      }
    }
  },
  updatedAt: ISODate("2024-01-15T00:00:00Z")
}
*/


// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Function to create a new user with wallet
function createUser(userData) {
  const session = db.getMongo().startSession();
  
  try {
    session.startTransaction();
    
    // Create user
    const userResult = db.users.insertOne({
      ...userData,
      tier: "novice",
      accountStatus: "active",
      twoFactorEnabled: false,
      preferences: {
        theme: "dark",
        currency: "KSH",
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }, { session });
    
    // Create wallet
    db.wallets.insertOne({
      userId: userResult.insertedId,
      balances: {
        USD: {
          available: NumberDecimal("0.00"),
          pending: NumberDecimal("0.00")
        },
        KSH: {
          available: NumberDecimal("0.00"),
          pending: NumberDecimal("0.00")
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }, { session });
    
    session.commitTransaction();
    return userResult.insertedId;
    
  } catch (error) {
    session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}


// CONFIDENTIAL PROPERTY OF ANTE SOCIAL
// MongoDB Schema Version 1.0 | January 2026