import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';
import { WalletService, WalletTransaction } from '@/services/icp/wallet.service';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '@/services/error-tracker';

interface WalletContextType {
  balance: bigint | null;
  address: string | null;
  isLoading: boolean;
  error: string | null;
  transactions: WalletTransaction[];
  deposit: (amount: bigint) => Promise<WalletTransaction>;
  withdraw: (amount: bigint, toAddress: string) => Promise<WalletTransaction>;
  spend: (amount: bigint, memo: string) => Promise<WalletTransaction>;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { identity } = useAuth();
  const [service, setService] = useState<WalletService | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const errorTracker = ErrorTracker.getInstance();

  useEffect(() => {
    if (!identity) return;

    const initializeWallet = async () => {
      try {
        const walletService = WalletService.getInstance(identity);
        await walletService.initialize();
        
        setService(walletService);
        setBalance(walletService.getBalance());
        setAddress(walletService.getAddress());
        
        const history = await walletService.loadTransactionHistory();
        setTransactions(history);
        
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to initialize wallet';
        setError(errorMsg);
        errorTracker.trackError(
          ErrorCategory.WALLET,
          err instanceof Error ? err : new Error(errorMsg),
          ErrorSeverity.CRITICAL,
          { identity: identity.getPrincipal().toString() }
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeWallet();
  }, [identity]);

  const refreshBalance = async () => {
    if (!service) return;

    try {
      const newBalance = await service.refreshBalance();
      setBalance(newBalance);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to refresh balance';
      setError(errorMsg);
    }
  };

  const deposit = async (amount: bigint) => {
    if (!service) throw new Error('Wallet not initialized');

    try {
      const transaction = await service.deposit(amount);
      setTransactions(prev => [transaction, ...prev]);
      await refreshBalance();
      return transaction;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Deposit failed';
      setError(errorMsg);
      throw err;
    }
  };

  const withdraw = async (amount: bigint, toAddress: string) => {
    if (!service) throw new Error('Wallet not initialized');

    try {
      const transaction = await service.withdraw(amount, toAddress);
      setTransactions(prev => [transaction, ...prev]);
      await refreshBalance();
      return transaction;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Withdrawal failed';
      setError(errorMsg);
      throw err;
    }
  };

  const spend = async (amount: bigint, memo: string) => {
    if (!service) throw new Error('Wallet not initialized');

    try {
      const transaction = await service.spend(amount, memo);
      setTransactions(prev => [transaction, ...prev]);
      await refreshBalance();
      return transaction;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMsg);
      throw err;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        address,
        isLoading,
        error,
        transactions,
        deposit,
        withdraw,
        spend,
        refreshBalance
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};