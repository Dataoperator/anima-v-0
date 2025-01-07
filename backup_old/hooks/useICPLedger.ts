import { useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { useAuth } from './useAuth';
import { useActor } from './useActor';
import { WalletService } from '@/services/wallet.service';
import { ErrorTracker } from '@/services/error-tracker';

export const useICPLedger = () => {
  const { isAuthenticated, principal } = useAuth();
  const { actor } = useActor();
  const [balance, setBalance] = useState<bigint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && actor && principal) {
      console.log('🔄 Connecting to ICP ledger...');
      initializeLedger();
    }
  }, [isAuthenticated, actor, principal]);

  const initializeLedger = async () => {
    try {
      const ledgerService = WalletService.getInstance(actor);
      await ledgerService.initialize();
      
      if (principal) {
        const walletInfo = await ledgerService.getWallet(principal.toString());
        if (walletInfo) {
          setBalance(walletInfo.balances.icp);
        }
      }
      
      console.log('✅ ICP ledger connected successfully');
    } catch (err) {
      setError('Failed to initialize ledger');
      ErrorTracker.getInstance().trackError({
        type: 'LedgerInitializationError',
        message: err instanceof Error ? err.message : 'Unknown error',
        context: { principal: principal?.toString() }
      });
    }
  };

  const getBalance = async () => {
    if (!actor || !principal) return null;
    
    try {
      setIsLoading(true);
      const ledgerService = WalletService.getInstance(actor);
      const walletInfo = await ledgerService.getWallet(principal.toString());
      if (walletInfo) {
        setBalance(walletInfo.balances.icp);
        return walletInfo.balances.icp;
      }
      return null;
    } catch (err) {
      setError('Failed to fetch balance');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    balance,
    error,
    isLoading,
    getBalance,
  };
};