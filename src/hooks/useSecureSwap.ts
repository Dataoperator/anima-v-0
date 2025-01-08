import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import { secureTransferService } from '../services/icp/secure-transfer.service';

interface SwapState {
  status: 'idle' | 'initiating' | 'awaiting_payment' | 'verifying' | 'minting' | 'completed' | 'failed';
  paymentId?: string;
  error?: string;
  txId?: string;
}

export const useSecureSwap = () => {
  const { principal } = useAuth();
  const [state, setState] = useState<SwapState>({ status: 'idle' });

  // Cleanup monitoring on unmount
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Monitor swap status
  const monitorSwap = useCallback(async (paymentId: string) => {
    try {
      const status = await secureTransferService.getSwapStatus(paymentId);

      switch (status.status) {
        case 'completed':
          // Complete the swap by minting ANIMA
          setState(prev => ({ ...prev, status: 'minting' }));
          const result = await secureTransferService.completeSwap(paymentId);
          
          if (result.success) {
            setState({
              status: 'completed',
              paymentId,
              txId: result.txId
            });
          } else {
            throw new Error(result.error);
          }
          break;

        case 'expired':
          setState({
            status: 'failed',
            paymentId,
            error: 'Payment verification timeout'
          });
          break;

        case 'pending':
          // Check again in 5 seconds
          setTimeout(() => monitorSwap(paymentId), 5000);
          break;

        case 'unknown':
          setState({
            status: 'failed',
            paymentId,
            error: 'Payment not found'
          });
          break;
      }
    } catch (error) {
      setState({
        status: 'failed',
        paymentId,
        error: error instanceof Error ? error.message : 'Monitoring failed'
      });
    }
  }, []);

  // Initiate ICP to ANIMA swap
  const swapICPForANIMA = async (icpAmount: number) => {
    if (!principal) {
      throw new Error('Authentication required');
    }

    try {
      setState({ status: 'initiating' });

      // Convert to bigint (ICP has 8 decimal places)
      const amount = BigInt(Math.floor(icpAmount * 100_000_000));

      // Initiate the swap
      const result = await secureTransferService.initiateSwap(principal, amount);

      if (!result.success || !result.paymentId) {
        throw new Error(result.error || 'Failed to initiate swap');
      }

      setState({
        status: 'awaiting_payment',
        paymentId: result.paymentId
      });

      // Start monitoring the payment
      monitorSwap(result.paymentId);

      return result;
    } catch (error) {
      setState({
        status: 'failed',
        error: error instanceof Error ? error.message : 'Swap failed'
      });
      throw error;
    }
  };

  // Get swap details
  const getSwapDetails = async (paymentId: string) => {
    try {
      return await secureTransferService.getSwapStatus(paymentId);
    } catch (error) {
      console.error('Failed to get swap details:', error);
      return { status: 'unknown' as const };
    }
  };

  // Reset swap state
  const resetSwap = () => {
    setState({ status: 'idle' });
  };

  return {
    swapICPForANIMA,
    getSwapDetails,
    resetSwap,
    state
  };
};

export default useSecureSwap;