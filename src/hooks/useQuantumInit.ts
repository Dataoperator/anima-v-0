import { useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';
import { useActor } from './useActor';

export const useQuantumInit = (animaId?: string) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { getActor } = useActor();

  useEffect(() => {
    const initQuantumState = async () => {
      if (!animaId) return;
      
      try {
        const actor = await getActor();
        await actor.initialize_quantum_state(animaId);
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize quantum state:', err);
        setError(err as Error);
      }
    };

    initQuantumState();
  }, [animaId, getActor]);

  return {
    isInitialized,
    error,
  };
};