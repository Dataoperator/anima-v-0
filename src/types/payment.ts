import { Principal } from '@dfinity/principal';

export interface PaymentResult {
  height: bigint;
  transactionId: string;
}

export interface QuantumSignature {
  resonance: number;
  coherence: number;
  timestamp: number;
  transactionHash: string;
}

export interface PaymentVerification {
  verified: boolean;
  timestamp: bigint;
  status: 'pending' | 'confirmed' | 'failed';
  quantumSignature: QuantumSignature | null;
}

export interface PaymentParams {
  amount: bigint;
  memo?: bigint;
  toCanister: Principal;
}

export interface TransactionReceipt {
  height: bigint;
  transactionId: string;
  quantum: QuantumSignature;
  verified: boolean;
  timestamp: bigint;
}

export type QuantumSignedReceipt = TransactionReceipt;

export interface TransactionError {
  type: 'PAYMENT_ERROR';
  message: string;
  timestamp: number;
  quantum?: {
    resonance?: number;
    coherence?: number;
    stability?: number;
  };
}

export interface PaymentStatus {
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: bigint;
  receipt?: TransactionReceipt;
  quantumVerified: boolean;
}