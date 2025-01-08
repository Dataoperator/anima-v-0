import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { InitializationStage, initializationManager } from '../initialization';

interface UseInitializationResult {
  stage: InitializationStage;
  error: Error | undefined;
  isInitialized: boolean;
  isInitializing: boolean;
  retryInitialization: () => Promise<void>;
}

export function useInitialization(): UseInitializationResult {
  const { identity, isAuthenticated } = useAuth();
  const [stage, setStage] = useState<InitializationStage>(InitializationStage.NotStarted);
  const [error, setError] = useState<Error>();
  const [isInitializing, setIsInitializing] = useState(false);

  const handleStageUpdate = useCallback((newStage: InitializationStage) => {
    setStage(newStage);
  }, []);

  const handleError = useCallback((error: Error) => {
    setError(error);
    setIsInitializing(false);
  }, []);

  const handleComplete = useCallback(() => {
    setIsInitializing(false);
    setError(undefined);
  }, []);

  useEffect(() => {
    if (isAuthenticated && identity) {
      const startInitialization = async () => {
        try {
          setIsInitializing(true);
          setError(undefined);
          await initializationManager.initialize(identity);
        } catch (error) {
          handleError(error as Error);
        }
      };

      initializationManager.on('stageUpdate', handleStageUpdate);
      initializationManager.on('failed', handleError);
      initializationManager.on('initialized', handleComplete);

      startInitialization();

      return () => {
        initializationManager.off('stageUpdate', handleStageUpdate);
        initializationManager.off('failed', handleError);
        initializationManager.off('initialized', handleComplete);
      };
    }
  }, [identity, isAuthenticated, handleStageUpdate, handleError, handleComplete]);

  const retryInitialization = useCallback(async () => {
    if (identity) {
      try {
        setIsInitializing(true);
        setError(undefined);
        initializationManager.reset();
        await initializationManager.initialize(identity);
      } catch (error) {
        handleError(error as Error);
      }
    }
  }, [identity, handleError]);

  return {
    stage,
    error,
    isInitialized: stage === InitializationStage.Complete,
    isInitializing,
    retryInitialization
  };
}