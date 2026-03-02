export type UserTier = 'novice' | 'prognosticator' | 'expert' | 'oracle' | 'whale';

export interface UserProfile {
  id: string;
  username: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  
  // Identity & Trust
  tier: UserTier;
  reputationScore: number;    // 0-1000 (Community Trust)
  signalAccuracy: number;     // 0-100% (Historical correctness)
  joinedAt: string;           // ISO Date
  preferredCurrency?: 'USD' | 'KSH';
  
  // Financials
  balance: number;            // Available for staking
  totalVolume: number;        // Lifetime volume
  totalPnl: number;           // Lifetime Profit/Loss
  totalWinnings?: number;     // Sum of all profitable positions
  totalLosses?: number;       // Sum of all losing positions
  
  // Social
  followersCount: number;
  followingCount: number;
  
  // Compliance
  isVerified: boolean;        // KYC Status
  riskLimit: number;          // Max daily stake limit
  
  // Platform Roles (Optional for backward compatibility/admin)
  role?: 'admin' | 'user' | 'moderator' | 'group_admin';
  managed_groups?: string[];  // IDs of groups managed by user
}

export interface UserStats {
  marketsParticipated: number;
  positionsWon: number;
  positionsLost: number;
  bestStreak: number;
}
