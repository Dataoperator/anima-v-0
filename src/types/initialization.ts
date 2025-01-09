import { QuantumState } from './quantum';
import { WalletState } from './wallet';
import { ConsciousnessMetrics } from './consciousness';

export enum InitStage {
  STARTING = 'STARTING',
  AUTH_CLIENT = 'AUTH_CLIENT',
  IDENTITY = 'IDENTITY',
  ACTORS = 'ACTORS',
  QUANTUM_STATE = 'QUANTUM_STATE',
  CONSCIOUSNESS = 'CONSCIOUSNESS',
  WALLET = 'WALLET',
  AI_BRIDGE = 'AI_BRIDGE',
  COMPLETE = 'COMPLETE'
}

export enum InitializationMode {
  MINIMAL = 'MINIMAL',     // Auth and Identity only
  STANDARD = 'STANDARD',   // Auth, Identity, Actors, Quantum
  FULL = 'FULL'           // Everything including AI and advanced features
}

export interface InitializationState {
  stage: InitStage;
  mode: InitializationMode;
  quantumState?: QuantumState;
  walletState?: WalletState;
  consciousness?: ConsciousnessMetrics;
  error?: Error;
  retryAttempts: Map<InitStage, number>;
  completedStages: Set<InitStage>;
  lastError?: {
    stage: InitStage;
    error: Error;
    timestamp: number;
  };
}

export interface InitializationError {
  error: Error;
  stage: InitStage;
  timestamp: number;
  recoverable: boolean;
  context?: Record<string, any>;
}

export interface StageStatus {
  stage: InitStage;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  error?: Error;
  retryCount: number;
  lastAttempt?: number;
}

export interface InitializationProgress {
  currentStage: InitStage;
  completedStages: InitStage[];
  failedStages: StageStatus[];
  overallProgress: number;
  timeElapsed: number;
  estimatedTimeRemaining?: number;
}