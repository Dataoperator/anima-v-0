import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuantum } from '@/contexts/quantum-context';
import { useICPLedger } from './useICPLedger';
import { ErrorTracker } from '@/error/quantum_error';
import { treasuryService } from '@/services/treasury.service';

const GENESIS_FEE = BigInt(100_000_000); // 1 ICP
const MIN_QUANTUM_COHERENCE = 0.7;

export const useGenesisInitialization = () => {
  const { ledger, error: ledgerError } = useICPLedger();
  const { state: quantumState } = useQuantum();
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const navigate = useNavigate();
  const errorTracker = ErrorTracker.getInstance();

  const checkPrerequisites = useCallback(async () => {
    setIsChecking(true);
    setError(null);

    try {
      console.log('🔍 Checking genesis prerequisites...');

      // Check ledger connection
      if (!ledger) {
        throw new Error('ICP ledger not connected');
      }

      // Check quantum stability
      if (!quantumState || quantumState.coherenceLevel < MIN_QUANTUM_COHERENCE) {
        throw new Error('Quantum field not stable enough for genesis');
      }

      // Check ICP balance
      const balance = await ledger.getBalance();
      console.log('💰 Current balance:', Number(balance) / 100_000_000, 'ICP');
      
      if (balance < GENESIS_FEE) {
        throw new Error(`Insufficient ICP balance. Need at least 1 ICP for genesis. Current balance: ${Number(balance) / 100_000_000} ICP`);
      }

      // Process treasury transfer
      console.log('💎 Processing treasury transfer...');
      const transferResult = await treasuryService.processGenesisFee(ledger);
      
      if (!transferResult.success) {
        throw new Error('Treasury transfer failed');
      }

      setTransactionId(transferResult.transactionId || null);

      // Verify transfer
      if (transferResult.transactionId) {
        const verified = await treasuryService.verifyTransfer(transferResult.transactionId);
        if (!verified) {
          throw new Error('Failed to verify treasury transfer');
        }
      }

      // All checks passed
      console.log('✅ All genesis prerequisites met');
      console.log('🎟️ Transaction ID:', transferResult.transactionId);
      
      // Navigate to genesis with transaction info
      navigate('/genesis', {
        state: {
          transactionId: transferResult.transactionId,
          treasuryTransfer: true
        }
      });

    } catch (err) {
      console.error('❌ Genesis prerequisites check failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify genesis requirements';
      setError(errorMessage);
      
      await errorTracker.trackError({
        errorType: 'GENESIS_PREREQ',
        severity: 'HIGH',
        context: 'Genesis Initialization',
        error: err instanceof Error ? err : new Error(errorMessage)
      });
    } finally {
      setIsChecking(false);
    }
  }, [ledger, quantumState, navigate]);

  return {
    checkPrerequisites,
    isChecking,
    error: error || ledgerError,
    isReady: !!ledger && !!quantumState && quantumState.coherenceLevel >= MIN_QUANTUM_COHERENCE,
    transactionId
  };
};