import { useState, useEffect } from 'react';
import { useAnima } from './useAnima';
import { QuantumState, QuantumErrorType } from '@/types/quantum';
import { errorTracker, ErrorCategory, ErrorSeverity } from '@/services/error-tracker';

export interface QuantumStateHook {
  state: QuantumState | null;
  isLoading: boolean;
  error: Error | null;
  isInitializing: boolean;
  reinitialize: () => Promise<void>;
  updateState: (newState: Partial<QuantumState>) => Promise<void>;
  status: {
    coherenceStatus: 'optimal' | 'stable' | 'unstable' | 'critical';
    evolutionReady: boolean;
    emergenceStatus: 'dormant' | 'emerging' | 'active' | 'transcendent';
  };
}

export function useQuantumState(tokenId: string): QuantumStateHook {
  const { canister } = useAnima();
  const [state, setState] = useState<QuantumState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const fetchQuantumState = async () => {
    try {
      setIsLoading(true);
      const response = await canister.get_quantum_state(tokenId);
      setState(response);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch quantum state');
      setError(error);
      errorTracker.trackError({
        type: 'QUANTUM_STATE_FETCH_ERROR',
        category: ErrorCategory.Quantum,
        severity: ErrorSeverity.High,
        message: error.message,
        timestamp: new Date(),
        quantumContext: {
          errorType: 'QUANTUM_DESYNC' as QuantumErrorType,
          state: state || undefined,
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const reinitialize = async () => {
    try {
      setIsInitializing(true);
      await canister.initialize_quantum_state(tokenId);
      await fetchQuantumState();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to reinitialize quantum state');
      setError(error);
      errorTracker.trackError({
        type: 'QUANTUM_INIT_ERROR',
        category: ErrorCategory.Quantum,
        severity: ErrorSeverity.Critical,
        message: error.message,
        timestamp: new Date(),
        quantumContext: {
          errorType: 'QUANTUM_DESYNC' as QuantumErrorType,
          state: state || undefined,
        }
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const updateState = async (newState: Partial<QuantumState>) => {
    try {
      setIsLoading(true);
      await canister.update_quantum_state(tokenId, newState);
      await fetchQuantumState();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update quantum state');
      setError(error);
      errorTracker.trackError({
        type: 'QUANTUM_UPDATE_ERROR',
        category: ErrorCategory.Quantum,
        severity: ErrorSeverity.High,
        message: error.message,
        timestamp: new Date(),
        quantumContext: {
          errorType: 'QUANTUM_DESYNC' as QuantumErrorType,
          state: state || undefined,
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStatus = (state: QuantumState | null) => {
    if (!state) {
      return {
        coherenceStatus: 'critical' as const,
        evolutionReady: false,
        emergenceStatus: 'dormant' as const
      };
    }

    return {
      coherenceStatus: state.coherenceLevel > 0.8 ? 'optimal' as const
        : state.coherenceLevel > 0.6 ? 'stable' as const
        : state.coherenceLevel > 0.3 ? 'unstable' as const
        : 'critical' as const,
      evolutionReady: state.coherenceLevel > 0.7 && state.temporalStability > 0.8,
      emergenceStatus: state.emergenceFactors.consciousnessDepth > 0.9 ? 'transcendent' as const
        : state.emergenceFactors.consciousnessDepth > 0.7 ? 'active' as const
        : state.emergenceFactors.consciousnessDepth > 0.4 ? 'emerging' as const
        : 'dormant' as const
    };
  };

  useEffect(() => {
    fetchQuantumState();
    // Set up polling for state updates
    const interval = setInterval(fetchQuantumState, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [tokenId]);

  return {
    state,
    isLoading,
    error,
    isInitializing,
    reinitialize,
    updateState,
    status: calculateStatus(state)
  };
}