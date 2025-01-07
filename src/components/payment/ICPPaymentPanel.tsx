import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useWallet } from '@/contexts/WalletContext';
import { Principal } from '@dfinity/principal';
import { motion } from 'framer-motion';
import { useQuantumState } from '@/hooks/useQuantumState';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '@/services/error-tracker';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface ICPPaymentPanelProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  amount?: bigint;
}

export const ICPPaymentPanel: React.FC<ICPPaymentPanelProps> = ({
  onSuccess,
  onError,
  amount = BigInt(100000000), // Default 1 ICP
}) => {
  const { identity } = useAuth();
  const { balance, spend, error: walletError, refreshBalance } = useWallet();
  const { quantumState } = useQuantumState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const errorTracker = ErrorTracker.getInstance();

  useEffect(() => {
    if (identity) {
      refreshBalance();
    }
  }, [identity, refreshBalance]);

  const handlePayment = async () => {
    if (!identity || isProcessing) return;

    setIsProcessing(true);
    setTransactionError(null);

    try {
      const transaction = await spend(
        amount,
        `ANIMA_MINT_${Date.now()}_${quantumState?.coherence || 1.0}`
      );

      if (transaction.status === 'completed') {
        await refreshBalance();
        onSuccess?.();
      } else {
        throw new Error('Transaction failed to complete');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setTransactionError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      
      errorTracker.trackError(
        ErrorCategory.PAYMENT,
        err instanceof Error ? err : new Error(errorMessage),
        ErrorSeverity.HIGH,
        {
          amount: amount.toString(),
          quantumCoherence: quantumState?.coherence.toString(),
          principal: identity.getPrincipal().toString()
        }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const insufficientFunds = balance !== null && balance < amount;
  const isStable = quantumState?.coherence >= 0.7;

  return (
    <div className="space-y-4">
      {/* Balance Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-white/10"
      >
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Balance</span>
          <span className="text-xl font-medium">
            {balance === null ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              `${Number(balance) / 100000000} ICP`
            )}
          </span>
        </div>

        <div className="mt-2 flex justify-between items-center">
          <span className="text-gray-400">Quantum State</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isStable ? 'bg-green-400' : 'bg-yellow-400'
            }`} />
            <span className="text-sm">
              {isStable ? 'Stable' : 'Stabilizing'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Error Messages */}
      {(transactionError || walletError) && (
        <Alert variant="destructive">
          {transactionError || walletError}
        </Alert>
      )}

      {/* Payment Button */}
      <div className="space-y-4">
        <Button
          onClick={handlePayment}
          disabled={isProcessing || insufficientFunds || !isStable}
          className="w-full relative bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <span>Pay {Number(amount) / 100000000} ICP</span>
          )}
        </Button>

        {insufficientFunds && (
          <Alert>
            <p className="text-sm">
              Insufficient balance. You need at least {Number(amount) / 100000000} ICP to mint.
            </p>
            <Button
              variant="link"
              className="mt-2 text-purple-400"
              onClick={() => window.open('https://nns.ic0.app/', '_blank')}
            >
              Add Funds →
            </Button>
          </Alert>
        )}

        {!isStable && (
          <Alert>
            <p className="text-sm">
              Quantum state is currently stabilizing. Please wait a moment before minting.
            </p>
          </Alert>
        )}
      </div>
    </div>
  );
};