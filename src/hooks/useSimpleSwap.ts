import { useState } from 'react';
import { Principal } from '@dfinity/principal';
import { simpleTransferService } from '../services/icp/simple-transfer.service';
import { useAuth } from './useAuth';

export const useSimpleSwap = () => {
  const { principal } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const swapICPForANIMA = async (icpAmount: number) => {
    if (!principal) {
      throw new Error('Authentication required');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert number to bigint (ICP has 8 decimal places)
      const amount = BigInt(Math.floor(icpAmount * 100_000_000));
      
      // Perform the swap
      const result = await simpleTransferService.swapICPToANIMA(
        principal,
        amount
      );

      if (!result.success) {
        throw new Error(result.error || 'Swap failed');
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Swap failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getBalances = async () => {
    if (!principal) {
      throw new Error('Authentication required');
    }

    try {
      const [icpBalance, animaBalance] = await Promise.all([
        simpleTransferService.getICPBalance(principal),
        simpleTransferService.getANIMABalance(principal)
      ]);

      return {
        icp: Number(icpBalance) / 100_000_000, // Convert to decimal
        anima: Number(animaBalance) / 100_000_000
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get balances';
      setError(message);
      throw err;
    }
  };

  return {
    swapICPForANIMA,
    getBalances,
    isLoading,
    error
  };
};