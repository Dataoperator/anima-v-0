import { Principal } from '@dfinity/principal';

export interface WalletState {
    balance: bigint;
    transactions: WalletTransaction[];
    quantumMetrics: WalletQuantumMetrics;
    status: WalletStatus;
    lastSync: number;
}

export interface WalletTransaction {
    id: string;
    type: TransactionType;
    amount: bigint;
    timestamp: number;
    status: TransactionStatus;
    memo?: string;
    quantumMetrics: WalletQuantumMetrics;
    retryCount: number;
}

export interface WalletQuantumMetrics {
    coherenceLevel: number;
    stabilityIndex: number;
    entanglementFactor: number;
    stabilityStatus: StabilityStatus;
}

export interface QuantumTransactionMetrics {
    preTransactionCoherence: number;
    postTransactionCoherence: number;
    stabilityDelta: number;
    quantumSignature: string;
}

export type TransactionType = 'withdrawal' | 'spend' | 'mint';
export type TransactionStatus = 'pending' | 'completed' | 'failed';
export type StabilityStatus = 'stable' | 'unstable' | 'critical';
export type WalletStatus = 'active' | 'locked' | 'maintenance' | 'quantum_unstable';

export interface WalletConfig {
    minStabilityThreshold: number;
    maxRetryAttempts: number;
    retryInterval: number;
    autoStabilize: boolean;
    quantumProtection: boolean;
    syncInterval: number;
    maxPendingTransactions: number;
}

export interface TransactionError {
    code: string;
    message: string;
    timestamp: number;
    transactionId: string;
    recoverable: boolean;
    quantumState?: WalletQuantumMetrics;
}

export interface WalletRecoveryOptions {
    stabilizeFirst: boolean;
    maxAttempts: number;
    intervalBetweenAttempts: number;
    requireQuantumAlignment: boolean;
}

export interface StabilityCheckResult {
    isStable: boolean;
    currentMetrics: WalletQuantumMetrics;
    recommendations: StabilityRecommendation[];
    canProceed: boolean;
}

export interface StabilityRecommendation {
    type: 'quantum_realignment' | 'coherence_boost' | 'entanglement_reset' | 'stability_wait';
    priority: number;
    expectedImpact: number;
    timeToImplement: number;
}

export interface WalletEventEmitter {
    on(event: WalletEventType, callback: (data: any) => void): void;
    off(event: WalletEventType, callback: (data: any) => void): void;
    emit(event: WalletEventType, data: any): void;
}

export type WalletEventType = 
    | 'transaction_initiated'
    | 'transaction_completed'
    | 'transaction_failed'
    | 'stability_changed'
    | 'quantum_shift'
    | 'balance_updated'
    | 'error'
    | 'recovery_started'
    | 'recovery_completed';

export interface WalletAnalytics {
    totalTransactions: number;
    successRate: number;
    averageStability: number;
    quantumMetricsHistory: WalletQuantumMetrics[];
    failurePatterns: {
        type: string;
        frequency: number;
        lastOccurrence: number;
    }[];
    recoveryStats: {
        attempts: number;
        successes: number;
        averageRecoveryTime: number;
    };
}

export interface QuantumProtectionSettings {
    enabled: boolean;
    minCoherence: number;
    minStability: number;
    autoRecover: boolean;
    maxQuantumDrift: number;
    stabilizationThreshold: number;
    entanglementProtection: boolean;
}