import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { walletService, WalletState, SwapParams } from '@/services/wallet.service';

export function useWallet() {
  const { identity, isAuthenticated } = useAuth();
  const [walletState, setWalletState] = useState<WalletState>(walletService.getState());
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeWallet = useCallback(async () => {
    if (!identity || !isAuthenticated) return;

    try {
      setIsInitializing(true);
      setError(null);
      
      const state = await walletService.initialize(identity);
      setWalletState(state);
    } catch (err) {
      console.error('Failed to initialize wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize wallet');
      throw err;
    } finally {
      setIsInitializing(false);
    }
  }, [identity, isAuthenticated]);

  const refreshBalance = useCallback(async () => {
    if (!identity || !isAuthenticated) return;

    try {
      setError(null);
      await walletService.refreshBalance(identity);
      setWalletState(walletService.getState());
    } catch (err) {
      console.error('Failed to refresh balance:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh balance');
      throw err;
    }
  }, [identity, isAuthenticated]);

  const getSwapRate = useCallback(async (direction: 'icpToAnima' | 'animaToIcp') => {
    try {
      return await walletService.getSwapRate(direction);
    } catch (err) {
      console.error('Failed to get swap rate:', err);
      throw err;
    }
  }, []);

  const swapTokens = useCallback(async (params: SwapParams) => {
    if (!identity || !isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      const result = await walletService.swapTokens(params);
      if (result.success) {
        await refreshBalance();
      }
      return result;
    } catch (err) {
      console.error('Failed to swap tokens:', err);
      throw err;
    }
  }, [identity, isAuthenticated, refreshBalance]);

  const mintAnima = useCallback(async (amount: number) => {
    if (!identity || !isAuthenticated) {
      throw new Error('Not authenticated');
    }

    try {
      const result = await walletService.mintAnima(amount);
      if (result.success) {
        await refreshBalance();
      }
      return result;
    } catch (err) {
      console.error('Failed to mint ANIMA:', err);
      throw err;
    }
  }, [identity, isAuthenticated, refreshBalance]);

  useEffect(() => {
    if (isAuthenticated && identity && !walletState.isInitialized) {
      initializeWallet().catch(console.error);
    }
  }, [isAuthenticated, identity, walletState.isInitialized, initializeWallet]);

  // Periodic balance refresh
  useEffect(() => {
    if (!isAuthenticated || !identity) return;

    const intervalId = setInterval(() => {
      refreshBalance().catch(console.error);
    }, 30000); // Every 30 seconds

    return () => clearInterval(intervalId);
  }, [isAuthenticated, identity, refreshBalance]);

  return {
    ...walletState,
    isInitializing,
    error,
    refreshBalance,
    getSwapRate,
    swapTokens,
    mintAnima
  };
}