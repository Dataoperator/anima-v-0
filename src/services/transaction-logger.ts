import { Principal } from '@dfinity/principal';
import { hash } from '@dfinity/agent';

export interface TransactionRecord {
  id: Uint8Array;
  principal: string;
  amount: string;
  type: string;
  timestamp: bigint;
  status: TransactionStatus;
  verificationSteps: VerificationStep[];
  retryCount: number;
  metadata: Record<string, any>;
  blockHeight?: bigint;
  error?: TransactionError;
  completionTimestamp?: bigint;
}

export interface VerificationStep {
  step: string;
  success: boolean;
  timestamp: bigint;
  details: Record<string, any>;
}

export interface TransactionError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

export type TransactionStatus = 
  | 'INITIATED'
  | 'PROCESSING'
  | 'PENDING_VERIFICATION'
  | 'COMPLETED'
  | 'FAILED'
  | 'TIMEOUT';

export class TransactionLogger {
  private static instance: TransactionLogger;
  private transactions: Map<string, TransactionRecord> = new Map();

  private constructor() {}

  static getInstance(): TransactionLogger {
    if (!TransactionLogger.instance) {
      TransactionLogger.instance = new TransactionLogger();
    }
    return TransactionLogger.instance;
  }

  static generateTransactionId(principal: Principal, timestamp: bigint, amount: bigint): Uint8Array {
    const data = new TextEncoder().encode(
      `${principal.toString()}-${timestamp}-${amount}`
    );
    return hash(data);
  }

  createTransactionRecord(
    principal: Principal,
    amount: bigint,
    type: string,
    metadata: Record<string, any> = {}
  ): TransactionRecord {
    const timestamp = BigInt(Date.now() * 1000000); // Convert to nanoseconds
    const txId = TransactionLogger.generateTransactionId(principal, timestamp, amount);
    
    const record: TransactionRecord = {
      id: txId,
      principal: principal.toString(),
      amount: amount.toString(),
      type,
      timestamp,
      status: 'INITIATED',
      verificationSteps: [],
      retryCount: 0,
      metadata
    };

    this.transactions.set(txId.toString(), record);
    return record;
  }

  logVerificationStep(
    record: TransactionRecord,
    step: string,
    success: boolean,
    details: Record<string, any> = {}
  ): TransactionRecord {
    const verificationStep: VerificationStep = {
      step,
      success,
      timestamp: BigInt(Date.now() * 1000000),
      details
    };

    record.verificationSteps.push(verificationStep);
    this.transactions.set(record.id.toString(), record);
    return record;
  }

  updateTransactionStatus(
    record: TransactionRecord,
    status: TransactionStatus,
    details: Record<string, any> = {}
  ): TransactionRecord {
    record.status = status;
    record.metadata = { ...record.metadata, ...details };
    this.transactions.set(record.id.toString(), record);
    return record;
  }

  finalizeTransaction(
    record: TransactionRecord,
    success: boolean,
    blockHeight?: bigint,
    error?: TransactionError
  ): TransactionRecord {
    record.status = success ? 'COMPLETED' : 'FAILED';
    record.completionTimestamp = BigInt(Date.now() * 1000000);
    
    if (blockHeight) {
      record.blockHeight = blockHeight;
    }
    
    if (error) {
      record.error = error;
    }

    this.transactions.set(record.id.toString(), record);
    return record;
  }

  getTransaction(txId: Uint8Array): TransactionRecord | undefined {
    return this.transactions.get(txId.toString());
  }

  getPendingTransactions(): TransactionRecord[] {
    return Array.from(this.transactions.values())
      .filter(tx => ['INITIATED', 'PROCESSING', 'PENDING_VERIFICATION'].includes(tx.status));
  }

  getTransactionsByPrincipal(principal: Principal): TransactionRecord[] {
    return Array.from(this.transactions.values())
      .filter(tx => tx.principal === principal.toString());
  }

  clearOldTransactions(maxAgeMs: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    for (const [id, record] of this.transactions.entries()) {
      const recordAge = now - Number(record.timestamp / BigInt(1000000));
      if (recordAge > maxAgeMs && record.status !== 'PENDING_VERIFICATION') {
        this.transactions.delete(id);
      }
    }
  }
}