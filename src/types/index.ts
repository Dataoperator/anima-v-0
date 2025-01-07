import { Principal } from '@dfinity/principal';

export interface AnimaNFT {
  name: string;
  token_id: bigint;
  metadata: {
    evolution_level: number;
  };
  quantum_state: {
    coherence: number;
    stability: number;
    entanglement: number;
  };
}

export interface WaveformProps {
  type?: 'sine' | 'square' | 'sawtooth';
  amplitude?: number;
  frequency?: number;
  className?: string;
}

export interface PaymentContextType {
  balance: bigint | null;
  loading: boolean;
  error: string | null;
  formatICP: (amount: bigint) => string;
  getBalance: () => Promise<void>;
}

// Re-export common types
export * from './payment';
export * from './media';
export * from './auth';
