import { useSecureSwap } from './useSecureSwap';
import { useAuth } from '@/contexts/auth-context';
import { useQuantumState } from '@/hooks/useQuantumState';
import { PaymentResult, PaymentVerification, PaymentParams } from '../types/payment';

const PAYMENT_AMOUNTS = {
  Genesis: BigInt(100_000_000), // 1 ICP
  Evolution: BigInt(50_000_000), // 0.5 ICP
  Feature: BigInt(25_000_000),  // 0.25 ICP
  Quantum: BigInt(75_000_000),  // 0.75 ICP
};

export const usePayment = () => {
  const { principal } = useAuth();
  const { quantumState } = useQuantumState();
  const { 
    swapICPForANIMA, 
    getSwapDetails, 
    state: swapState, 
    resetSwap 
  } = useSecureSwap();

  const initiatePayment = async (params: PaymentParams): Promise<PaymentResult> => {
    if (!principal) {
      throw new Error('Not authenticated');
    }

    // Convert amount to ICP decimal format
    const icpAmount = Number(params.amount) / 100_000_000;
    
    const result = await swapICPForANIMA(icpAmount);
    
    if (!result.success) {
      throw new Error(result.error || 'Payment failed');
    }

    return {
      height: BigInt(Date.now()),
      transactionId: result.paymentId!,
      status: swapState.status
    };
  };

  const verifyPayment = async (paymentId: string): Promise<PaymentVerification> => {
    const status = await getSwapDetails(paymentId);

    return {
      verified: status.status === 'completed',
      timestamp: BigInt(Date.now()),
      status: status.status === 'completed' ? 'confirmed' : 'pending',
      quantumSignature: quantumState ? {
        resonance: quantumState.resonance,
        coherence: quantumState.coherenceLevel,
        timestamp: Date.now(),
        transactionHash: paymentId
      } : null
    };
  };

  const getPaymentAmount = (type: keyof typeof PAYMENT_AMOUNTS) => {
    return PAYMENT_AMOUNTS[type];
  };

  return {
    initiatePayment,
    verifyPayment,
    getPaymentAmount,
    isProcessing: swapState.status !== 'idle' && swapState.status !== 'completed',
    error: swapState.error,
    lastTransaction: swapState.paymentId ? {
      height: BigInt(0), // Legacy compatibility
      transactionId: swapState.paymentId,
      status: swapState.status
    } : null,
    resetPayment: resetSwap
  };
};

export type PaymentHook = ReturnType<typeof usePayment>;