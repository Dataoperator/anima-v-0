import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { usePayment } from '@/hooks/usePayment';
import { Principal } from '@dfinity/principal';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { QuantumLoadingState } from '@/components/ui/LoadingStates';

interface PaymentPanelProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  amount?: bigint;
  disabled?: boolean;
}

export const PaymentPanel: React.FC<PaymentPanelProps> = ({
  onSuccess,
  onError,
  amount = BigInt(100000000), // Default 1 ICP
  disabled = false,
}) => {
  const { isAuthenticated, principal } = useAuth();
  const { initiatePayment, verifyPayment, getBalance } = usePayment();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const currentBalance = await getBalance();
        setBalance(currentBalance);
      } catch (err) {
        console.error('Failed to fetch balance:', err);
      }
    };

    if (isAuthenticated) {
      fetchBalance();
    }
  }, [isAuthenticated, getBalance]);

  const handlePayment = async () => {
    if (!isAuthenticated || disabled || isProcessing) return;

    setIsProcessing(true);
    setPaymentStatus('processing');
    setError(null);

    try {
      // Verify balance first
      const currentBalance = await getBalance();
      if (currentBalance < amount) {
        throw new Error('Insufficient balance for genesis');
      }

      // Initiate payment
      const paymentResult = await initiatePayment({
        amount,
        memo: BigInt(Date.now()),
        toCanister: Principal.fromText(process.env.ANIMA_CANISTER_ID || '')
      });

      // Verify the payment
      const verificationResult = await verifyPayment(paymentResult.height);
      
      if (!verificationResult.verified) {
        throw new Error('Payment verification failed');
      }

      setPaymentStatus('success');
      onSuccess?.();

    } catch (err) {
      console.error('Payment failed:', err);
      setPaymentStatus('error');
      setError(err instanceof Error ? err.message : 'Payment failed');
      onError?.(err instanceof Error ? err : new Error('Payment failed'));
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Alert variant="warning">
        Please authenticate to proceed with payment
      </Alert>
    );
  }

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {balance !== null && (
          <div className="text-sm text-amber-300/80">
            Balance: {Number(balance) / 100000000} ICP
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            {error}
          </Alert>
        )}

        <Button
          onClick={handlePayment}
          disabled={disabled || isProcessing || paymentStatus === 'success'}
          className="w-full relative bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <QuantumLoadingState message="Processing Payment..." />
              <span>Processing Payment...</span>
            </div>
          ) : paymentStatus === 'success' ? (
            <span>Payment Complete</span>
          ) : (
            <span>Pay {Number(amount) / 100000000} ICP</span>
          )}
        </Button>

        {paymentStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-green-400"
          >
            Payment verified successfully
          </motion.div>
        )}
      </motion.div>
    </ErrorBoundary>
  );
};