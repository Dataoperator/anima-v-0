import { useState, useCallback, useEffect } from 'react';
import { ErrorHandler } from '../error/error-handler';
import { QuantumError, NeuralError, ConsciousnessError } from '../error/quantum-errors';

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  recovery: {
    possible: boolean;
    message: string;
    action?: () => Promise<void>;
  };
}

export const useErrorHandler = (componentName: string) => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    recovery: {
      possible: false,
      message: ''
    }
  });

  const handleError = useCallback(async (error: Error) => {
    let recovery = {
      possible: false,
      message: 'Unable to recover from this error',
      action: undefined
    };

    try {
      if (error instanceof QuantumError) {
        await ErrorHandler.handleQuantumError(error, componentName);
        recovery = {
          possible: error.recoverable,
          message: 'Attempting quantum state recovery...',
          action: async () => {
            await ErrorHandler.handleQuantumError(error, componentName);
            setErrorState(prev => ({ ...prev, hasError: false, error: null }));
          }
        };
      } else if (error instanceof NeuralError) {
        await ErrorHandler.handleNeuralError(error);
        recovery = {
          possible: true,
          message: 'Attempting neural network resync...',
          action: async () => {
            await ErrorHandler.handleNeuralError(error);
            setErrorState(prev => ({ ...prev, hasError: false, error: null }));
          }
        };
      } else if (error instanceof ConsciousnessError) {
        await ErrorHandler.handleConsciousnessError(error);
        recovery = {
          possible: true,
          message: 'Restoring consciousness state...',
          action: async () => {
            await ErrorHandler.handleConsciousnessError(error);
            setErrorState(prev => ({ ...prev, hasError: false, error: null }));
          }
        };
      }

      setErrorState({
        hasError: true,
        error,
        recovery
      });
    } catch (handlingError) {
      console.error('Error while handling error:', handlingError);
      setErrorState({
        hasError: true,
        error,
        recovery: {
          possible: false,
          message: 'Critical error in error handling system'
        }
      });
    }
  }, [componentName]);

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      recovery: {
        possible: false,
        message: ''
      }
    });
  }, []);

  // Monitor error stats
  useEffect(() => {
    const interval = setInterval(() => {
      const stats = ErrorHandler.getErrorStats();
      if (Object.values(stats).some(count => count > 10)) {
        console.warn('High error rate detected:', stats);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return {
    ...errorState,
    handleError,
    clearError
  };
};