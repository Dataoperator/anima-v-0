import { useState, useCallback } from 'react';
import { PaymentService, PaymentStatus, PaymentType, PaymentDetails } from '@/services/payment';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '@/services/error-tracker';
import { useAuth } from '@/contexts/auth-context';

interface RecoveryState {
  isRecovering: boolean;
  lastError: Error | null;
  recoveryAttempts: number;
}

export const usePaymentRecovery = (paymentService: PaymentService) => {
  const [recoveryState, setRecoveryState] = useState<RecoveryState>({
    isRecovering: false,
    lastError: null,
    recoveryAttempts: 0
  });

  const { principal } = useAuth();
  const errorTracker = ErrorTracker.getInstance();

  const recoverPayment = useCallback(async (payment: PaymentDetails): Promise<boolean> => {
    if (!principal) return false;

    setRecoveryState(prev => ({
      ...prev,
      isRecovering: true,
      recoveryAttempts: prev.recoveryAttempts + 1
    }));

    try {
      // Check if payment is still valid
      if (Date.now() > payment.expiresAt) {
        throw new Error('Payment expired');
      }

      // Attempt to verify payment again
      const verified = await paymentService.verifyPayment(payment.reference);
      if (verified) {
        setRecoveryState(prev => ({
          ...prev,
          isRecovering: false,
          lastError: null
        }));
        return true;
      }

      // If verification fails, try to reinitiate payment
      if (recoveryState.recoveryAttempts < 3) {
        const newPayment = await paymentService.initiatePayment(
          payment.type,
          principal,
          payment.amount
        );

        // Track recovery attempt
        errorTracker.trackError(
          ErrorCategory.PAYMENT,
          new Error('Payment recovery initiated'),
          ErrorSeverity.LOW,
          {
            originalPayment: payment,
            newPayment,
            attempt: recoveryState.recoveryAttempts
          }
        );

        setRecoveryState(prev => ({
          ...prev,
          isRecovering: false,
          lastError: null
        }));

        return true;
      }

      throw new Error('Max recovery attempts exceeded');
    } catch (error) {
      const enhancedError = error instanceof Error ? error : new Error('Payment recovery failed');
      
      setRecoveryState(prev => ({
        ...prev,
        isRecovering: false,
        lastError: enhancedError
      }));

      errorTracker.trackError(
        ErrorCategory.PAYMENT,
        enhancedError,
        ErrorSeverity.HIGH,
        {
          payment,
          recoveryAttempts: recoveryState.recoveryAttempts
        }
      );

      return false;
    }
  }, [principal, paymentService, recoveryState.recoveryAttempts, errorTracker]);

  const clearRecoveryState = useCallback(() => {
    setRecoveryState({
      isRecovering: false,
      lastError: null,
      recoveryAttempts: 0
    });
  }, []);

  return {
    recoverPayment,
    clearRecoveryState,
    recoveryState
  };
};