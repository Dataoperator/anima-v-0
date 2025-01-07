import { useState } from 'react';
import { useWallet } from './useWallet';
import { useQuantum } from './useQuantum';
import { Principal } from '@dfinity/principal';

export interface SwapParams {
  fromAmount: bigint;
  expectedAmount: bigint;
  slippage: number;
  coherenceBonus: number;
}

export interface QuoteParams {
  fromAmount: bigint;
  coherenceBonus: number;
}

export interface SwapState {
  status: 'idle' | 'quoting' | 'swapping' | 'success' | 'error';
  lastQuote?: {
    fromAmount: bigint;
    toAmount: bigint;
    rate: number;
    timestamp: number;
  };
  lastSwap?: {
    fromAmount: bigint;
    toAmount: bigint;
    timestamp: number;
    txId: string;
  };
}

export const BASE_RATE = 1000; // 1 ICP = 1000 ANIMA

export const useSwap = () => {
  const { wallet, animaActor } = useWallet();
  const { quantumState, updateQuantumState } = useQuantum();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [swapState, setSwapState] = useState<SwapState>({ status: 'idle' });

  const getQuote = async (params: QuoteParams): Promise<bigint> => {
    if (!wallet?.principal || !animaActor) {
      throw new Error('Wallet not initialized');
    }

    setSwapState(prev => ({ ...prev, status: 'quoting' }));

    try {
      // Calculate ANIMA amount with quantum bonus
      const baseAmount = params.fromAmount * BigInt(BASE_RATE);
      const bonusAmount = baseAmount * BigInt(Math.floor(params.coherenceBonus * 100)) / 100n;
      const totalAmount = baseAmount + bonusAmount;

      // Store quote for reference
      setSwapState(prev => ({
        ...prev,
        status: 'idle',
        lastQuote: {
          fromAmount: params.fromAmount,
          toAmount: totalAmount,
          rate: Number(totalAmount) / Number(params.fromAmount),
          timestamp: Date.now()
        }
      }));

      return totalAmount;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get quote');
      setSwapState(prev => ({ ...prev, status: 'error' }));
      throw err;
    }
  };

  const swap = async (params: SwapParams) => {
    if (!wallet?.principal || !animaActor) {
      throw new Error('Wallet not initialized');
    }

    setIsLoading(true);
    setError(null);
    setSwapState(prev => ({ ...prev, status: 'swapping' }));

    try {
      // Calculate allowed slippage
      const minReceived = params.expectedAmount - 
        (params.expectedAmount * BigInt(Math.floor(params.slippage * 100))) / 10000n;

      // Transfer ICP to swap contract
      const icpTransferResult = await animaActor.icrc1_transfer({
        from: { owner: wallet.principal, subaccount: [] },
        to: { owner: Principal.fromText(process.env.SWAP_CONTRACT_ID || ''), subaccount: [] },
        amount: params.fromAmount,
        fee: [],
        memo: [],
        created_at_time: []
      });

      if ('Err' in icpTransferResult) {
        throw new Error('ICP transfer failed');
      }

      // Execute swap
      const swapResult = await animaActor.quantum_swap({
        amount: params.fromAmount,
        min_received: minReceived,
        coherence_bonus: params.coherenceBonus
      });

      if ('Err' in swapResult) {
        throw new Error(swapResult.Err);
      }

      // Update quantum state
      await updateQuantumState({
        ...quantumState!,
        coherence: Math.max(0, quantumState!.coherence - 0.1) // Small coherence cost for swapping
      });

      setSwapState(prev => ({
        ...prev,
        status: 'success',
        lastSwap: {
          fromAmount: params.fromAmount,
          toAmount: swapResult.Ok.received_amount,
          timestamp: Date.now(),
          txId: swapResult.Ok.transaction_id
        }
      }));

      return swapResult.Ok;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Swap failed');
      setSwapState(prev => ({ ...prev, status: 'error' }));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const validateSwap = (params: SwapParams): string | null => {
    if (!wallet?.balances?.icp) {
      return 'Wallet not connected';
    }

    if (params.fromAmount > wallet.balances.icp) {
      return 'Insufficient ICP balance';
    }

    if (params.fromAmount <= 0n) {
      return 'Invalid amount';
    }

    // Check if quote is fresh (less than 30 seconds old)
    if (swapState.lastQuote) {
      const quoteAge = Date.now() - swapState.lastQuote.timestamp;
      if (quoteAge > 30000) {
        return 'Quote expired';
      }
    }

    return null;
  };

  const getExpectedRate = (coherenceBonus: number): number => {
    return BASE_RATE * (1 + coherenceBonus);
  };

  return {
    swap,
    getQuote,
    validateSwap,
    getExpectedRate,
    swapState,
    isLoading,
    error
  };
};

export default useSwap;