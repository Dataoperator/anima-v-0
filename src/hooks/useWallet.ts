import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { initializationOrchestrator, InitializationMode } from '../services/initialization-orchestrator';
import { walletService } from '../services/wallet.service';
import { WalletState } from '@/types/wallet';

export const useWallet = () => {
  const { principal } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletState, setWalletState] = useState<WalletState | null>(null);

  const initializeWallet = useCallback(async () => {
    if (!principal) return;

    setIsLoading(true);
    setError(null);

    try {
      // Ensure wallet features are initialized
      await initializationOrchestrator.ensureFeatureInitialized(InitializationMode.FULL);
      
      // Initialize wallet
      const state = await walletService.getState();
      setWalletState(state);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize wallet';
      setError(message);
      console.error('Wallet initialization failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [principal]);

  const refreshBalance = useCallback(async () => {
    if (!principal || !walletState?.isInitialized) return;

    try {
      await walletService.refreshBalance(principal);
      setWalletState(walletService.getState());
    } catch (err) {
      console.error('Balance refresh failed:', err);
    }
  }, [principal, walletState?.isInitialized]);

  // Only initialize when component that needs wallet mounts
  useEffect(() => {
    if (principal && !walletState) {
      initializeWallet();
    }
  }, [principal, walletState, initializeWallet]);

  // Set up periodic balance refresh
  useEffect(() => {
    if (!walletState?.isInitialized) return;

    const interval = setInterval(refreshBalance, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [refreshBalance, walletState?.isInitialized]);

  return {
    wallet: walletState,
    isLoading,
    error,
    refreshBalance,
    initialize: initializeWallet
  };
};

export default useWallet;