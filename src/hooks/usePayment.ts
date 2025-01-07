import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useQuantumState } from '@/hooks/useQuantumState';
import { Principal } from '@dfinity/principal';
import { PaymentResult, PaymentVerification, PaymentParams, TransactionReceipt, QuantumSignedReceipt } from '../types/payment';
import { ErrorTracker } from '../error/quantum_error';

const PAYMENT_AMOUNTS = {
  Genesis: BigInt(100_000_000), // 1 ICP
  Evolution: BigInt(50_000_000), // 0.5 ICP
  Feature: BigInt(25_000_000),  // 0.25 ICP
  Quantum: BigInt(75_000_000),  // 0.75 ICP
};

const VERIFICATION_RETRIES = 3;
const VERIFICATION_INTERVAL = 2000;
const BALANCE_BUFFER = BigInt(10_000_000); // 0.1 ICP safety buffer

export const usePayment = () => {
  const { actor, principal } = useAuth();
  const { quantumState, updateQuantumState } = useQuantumState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTransaction, setLastTransaction] = useState<PaymentResult | null>(null);
  const [transactionReceipts] = useState<Map<string, TransactionReceipt>>(new Map());

  const generateQuantumSignature = useCallback(async (transaction: PaymentResult): Promise<QuantumSignedReceipt> => {
    if (!quantumState) throw new Error('Quantum state not initialized');

    const quantumSignature = {
      resonance: quantumState.resonance,
      coherence: quantumState.coherenceLevel,
      timestamp: Date.now(),
      transactionHash: `${transaction.height}-${Date.now()}-${Math.random()}`
    };

    return {
      ...transaction,
      quantum: quantumSignature,
      verified: true,
      timestamp: BigInt(Date.now())
    };
  }, [quantumState]);

  const validateBalance = useCallback(async (amount: bigint): Promise<boolean> => {
    try {
      const balance = await getBalance();
      const requiredAmount = amount + BALANCE_BUFFER;
      
      if (balance < requiredAmount) {
        throw new Error(`Insufficient balance. Need ${Number(requiredAmount) / 100_000_000} ICP (including buffer)`);
      }

      const stateValid = await validateQuantumState();
      if (!stateValid) {
        throw new Error('Quantum state unstable for transaction');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }, []);

  const validateQuantumState = useCallback(async (): Promise<boolean> => {
    if (!quantumState) return false;
    
    const minCoherence = 0.7;
    const minResonance = 0.6;

    return quantumState.coherenceLevel >= minCoherence && 
           quantumState.resonance >= minResonance;
  }, [quantumState]);

  const getBalance = useCallback(async (): Promise<bigint> => {
    if (!actor || !principal) {
      throw new Error('Not authenticated');
    }

    try {
      const balance = await actor.icrc1_balance_of({
        owner: Principal.fromText(principal),
        subaccount: [],
      });
      return balance;
    } catch (err) {
      console.error('Balance check failed:', err);
      throw new Error('Failed to fetch balance');
    }
  }, [actor, principal]);

  const initiatePayment = useCallback(async ({
    amount,
    memo = BigInt(Date.now()),
    toCanister
  }: PaymentParams): Promise<PaymentResult> => {
    if (!actor || !principal) {
      throw new Error('Not authenticated');
    }

    setIsProcessing(true);
    setError(null);

    try {
      await validateBalance(amount);

      const result = await actor.icrc2_transfer({
        amount,
        to: { owner: toCanister, subaccount: [] },
        fee: [],
        memo: [memo],
        from_subaccount: [],
        created_at_time: [BigInt(Date.now())],
      });

      if ('Err' in result) {
        throw new Error(JSON.stringify(result.Err));
      }

      const payment: PaymentResult = {
        height: result.Ok,
        transactionId: result.Ok.toString(),
      };

      const signedReceipt = await generateQuantumSignature(payment);
      transactionReceipts.set(payment.transactionId, signedReceipt);

      setLastTransaction(payment);
      return payment;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      ErrorTracker.getInstance().trackError({
        type: 'PAYMENT_ERROR',
        message: errorMessage,
        timestamp: Date.now(),
        quantum: quantumState
      });
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [actor, principal, validateBalance, generateQuantumSignature, quantumState]);

  const verifyPayment = useCallback(async (height: bigint): Promise<PaymentVerification> => {
    if (!actor) {
      throw new Error('Not authenticated');
    }

    let retries = VERIFICATION_RETRIES;
    
    while (retries > 0) {
      try {
        const result = await actor.verify_payment(height);
        
        if ('Ok' in result) {
          const quantumSignedResult = await generateQuantumSignature({
            height,
            transactionId: height.toString()
          });

          const verificationResult: PaymentVerification = {
            verified: true,
            timestamp: result.Ok.timestamp,
            status: 'confirmed',
            quantumSignature: quantumSignedResult.quantum
          };

          return verificationResult;
        }

        if (retries === 1) {
          return {
            verified: false,
            timestamp: BigInt(Date.now()),
            status: 'failed',
            quantumSignature: null
          };
        }

        await new Promise(resolve => setTimeout(resolve, VERIFICATION_INTERVAL));
        retries--;
        
      } catch (err) {
        if (retries === 1) {
          throw new Error('Payment verification failed');
        }
        await new Promise(resolve => setTimeout(resolve, VERIFICATION_INTERVAL));
        retries--;
      }
    }

    return {
      verified: false,
      timestamp: BigInt(Date.now()),
      status: 'failed',
      quantumSignature: null
    };
  }, [actor, generateQuantumSignature]);

  const getTransactionReceipt = useCallback((transactionId: string): TransactionReceipt | undefined => {
    return transactionReceipts.get(transactionId);
  }, [transactionReceipts]);

  const getPaymentAmount = useCallback((type: keyof typeof PAYMENT_AMOUNTS) => {
    return PAYMENT_AMOUNTS[type];
  }, []);

  const getTransactionStatus = useCallback(async (transactionId: string) => {
    if (!actor) {
      throw new Error('Not authenticated');
    }

    try {
      const status = await actor.get_transaction_status(transactionId);
      const receipt = transactionReceipts.get(transactionId);
      
      return {
        ...status,
        receipt,
        quantumVerified: receipt?.quantum ? true : false
      };
    } catch (err) {
      console.error('Failed to get transaction status:', err);
      throw new Error('Transaction status check failed');
    }
  }, [actor]);

  return {
    initiatePayment,
    verifyPayment,
    getBalance,
    getPaymentAmount,
    getTransactionStatus,
    getTransactionReceipt,
    isProcessing,
    error,
    lastTransaction,
  };
};

export type PaymentHook = ReturnType<typeof usePayment>;