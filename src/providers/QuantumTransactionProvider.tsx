import React, { createContext, useContext, useState, useCallback } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useQuantumState } from '@/hooks/useQuantumState';
import { WalletTransaction } from '@/services/wallet.service';

interface QuantumTransactionContextType {
  executeQuantumTransaction: (
    amount: bigint,
    operation: 'mint' | 'transfer' | 'burn'
  ) => Promise<WalletTransaction>;
  isProcessing: boolean;
  error: string | null;
}

const QuantumTransactionContext = createContext<QuantumTransactionContextType | null>(null);

export const QuantumTransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { executeTransaction } = useWallet();
  const { quantumState, checkStability, generateNeuralPatterns } = useQuantumState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeQuantumTransaction = useCallback(async (
    amount: bigint,
    operation: 'mint' | 'transfer' | 'burn'
  ): Promise<WalletTransaction> => {
    setIsProcessing(true);
    setError(null);

    try {
      // Verify quantum stability
      const isStable = await checkStability();
      if (!isStable) {
        throw new Error('Quantum state unstable - transaction blocked');
      }

      // Verify coherence level
      if (quantumState.coherenceLevel < 0.7) {
        throw new Error('Insufficient quantum coherence');
      }

      // Generate new neural patterns for transaction security
      await generateNeuralPatterns();

      // Execute the transaction
      const transaction = await executeTransaction(amount, operation);

      return transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [quantumState, checkStability, generateNeuralPatterns, executeTransaction]);

  const value = {
    executeQuantumTransaction,
    isProcessing,
    error
  };

  return (
    <QuantumTransactionContext.Provider value={value}>
      {children}
    </QuantumTransactionContext.Provider>
  );
};

export const useQuantumTransaction = () => {
  const context = useContext(QuantumTransactionContext);
  if (!context) {
    throw new Error('useQuantumTransaction must be used within a QuantumTransactionProvider');
  }
  return context;
};