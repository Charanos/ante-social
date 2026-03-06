export type MarketType =
  | 'consensus'
  | 'reflex'
  | 'ladder'
  | 'betrayal'
  | 'prisoner_dilemma'
  | 'divergence'
  | 'syndicate';

export type MarketStatus = 'active' | 'suspended' | 'resolved' | 'disputed';

export type OracleType = 'manual' | 'automated' | 'community_consensus';

export interface Market {
  id: string;
  title: string;
  description: string;
  image: string;
  type: MarketType;
  category: string;
  
  // Financials
  poolAmount: number;     // Total liquidity in the market
  volume: number;         // Total volume traded
  minStake: number;       // Minimum position size
  maxStake?: number;      // Optional cap
  
  // Timeline
  createdAt: string;      // ISO Date
  endsAt: string;         // ISO Date
  
  // Market Mechanics
  status: MarketStatus;
  oracleType: OracleType;
  resolutionCriteria: string; // Detailed text explaining how outcome is verified
  
  // Signal Data (Frontend Visualization)
  probability: number;        // Current implied probability (0-100)
  signalStrength: number;     // 0-100 score of market activity/velocity
  priceHistory: number[];     // Array of prices for sparkline (ProbabilityTrend)
  
  // Social Stats
  participantCount: number;
  commentCount: number;
  shareCount: number;

  tags: string[];
  winningOutcomeId?: string;
  isFeatured?: boolean;
  buyInCurrency?: string;
  isRecurring?: boolean;
  outcomes?: Array<{
    _id?: string;
    optionText: string;
    mediaUrl?: string;
    mediaType?: string;
    participantCount?: number;
    totalAmount?: number;
  }>;
  // Legacy/UI Aliases
  options?: Array<{
    id: string;
    option_text: string;
    votes: number;
    total_amount: number;
    percentage: number;
    image: string;
    icon?: any;
    pool_amount?: number;
  }>;
  buy_in_amount?: number;
  total_pool?: number;
  participant_count?: number;
  close_date?: string;
}

export type PositionStatus = 'active' | 'settled' | 'cancelled';

export interface Position {
  id: string;
  marketId: string;
  userId: string;
  title?: string; // Cache title for ticket/history display
  type?: string; 
  outcome: string;        // The specific outcome predicted (e.g., "Yes", "Option A")
  stakeAmount: number;
  entryPrice: number;     // Implied probability at entry
  currentValue: number;   // Current market value of the position
  potentialWin?: number;   // Expected return if correctly predicted
  
  status: PositionStatus;
  pnl?: number;           // Profit/Loss if settled
  
  openedAt: string;       // ISO Date
}
