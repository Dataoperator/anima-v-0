export interface StakingTier {
  name: string;
  requirement: number;
  apy: number;
  lockPeriod: number;
  bonuses: {
    coherenceBoost: number;
    evolutionSpeed: number;
    priorityFeatures: boolean;
  };
}

export interface StakingStats {
  totalStaked: number;
  currentTier: string | null;
  nextTier: string | null;
  rewards: {
    pendingRewards: number;
    lastClaimTime: number;
    nextClaimTime: number;
  };
  lockEndTime: number | null;
}

export interface StakingAction {
  type: 'stake' | 'unstake' | 'claim';
  amount?: number;
  tier?: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  txHash: string;
}

export interface StakingRewards {
  daily: number;
  monthly: number;
  yearly: number;
  lastCalculated: number;
}

export interface UnstakePreview {
  amount: number;
  penaltyAmount: number | null;
  penaltyReason?: string;
  remainingLockTime?: number;
}