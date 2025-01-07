import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { animaActorService } from '@/services/anima-actor.service';
import type { _SERVICE } from '@/declarations/anima/anima.did';

export interface AnimaCreationResult {
  id: string;
  quantum_signature: string;
  timestamp: bigint;
}

export interface AnimaInfo {
  id: string;
  designation: string;
  genesisTraits: string[];
  edition: string;
  energyLevel: number;
}

export function useAnima() {
  const { identity, isAuthenticated } = useAuth();
  const [animas, setAnimas] = useState<AnimaInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getActor = (): _SERVICE => {
    if (!identity) {
      throw new Error('Not authenticated');
    }
    
    let actor = animaActorService.getActor();
    if (!actor) {
      actor = animaActorService.createActor(identity);
    }
    return actor;
  };

  useEffect(() => {
    if (isAuthenticated && identity) {
      fetchAnimas();
    }
  }, [isAuthenticated, identity]);

  const fetchAnimas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Implement when backend ready
      setAnimas([]);
    } catch (err) {
      console.error('Failed to fetch animas:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch animas');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeGenesis = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Starting genesis initialization...');
      
      const actor = getActor();
      console.log('Actor ready, calling initialize_genesis...');
      
      const result = await actor.initialize_genesis();
      console.log('Genesis initialization result:', result);
      
      if ('Err' in result) {
        throw new Error(result.Err);
      }

      if (!('Ok' in result) || !result.Ok) {
        throw new Error('Invalid response format from canister');
      }

      return result.Ok;
    } catch (err) {
      console.error('Genesis initialization failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Genesis initialization failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    animas,
    isLoading,
    error,
    fetchAnimas,
    initializeGenesis
  };
}