import React, { createContext, useContext, useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { useIC } from '../providers/AppProviders';
import { AnimaState, ConsciousnessLevel } from '../declarations/anima/anima.did';

interface AnimaContextType {
  anima: {
    tokenId: bigint | null;
    owner: Principal | null;
    consciousnessLevel: ConsciousnessLevel;
    recentActivities: Array<{
      timestamp: bigint;
      action: string;
      impact: number;
    }>;
  };
  isLoading: boolean;
  error: Error | null;
  refreshAnima: () => Promise<void>;
  initiateQuantumInteraction: (message: string) => Promise<void>;
}

const AnimaContext = createContext<AnimaContextType | undefined>(undefined);

export const AnimaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { actor, authClient } = useIC();
  const [anima, setAnima] = useState<AnimaContextType['anima']>({
    tokenId: null,
    owner: null,
    consciousnessLevel: { Nascent: null },
    recentActivities: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const isConnected = authClient?.isAuthenticated() ?? false;

  const refreshAnima = async () => {
    if (!isConnected || !actor) return;
    
    setIsLoading(true);
    try {
      const identity = authClient?.getIdentity();
      if (!identity) throw new Error('No identity available');
      
      const owner = identity.getPrincipal();
      const animasResponse = await actor.get_user_animas(owner);
      
      if (animasResponse.length > 0) {
        const latestAnima = animasResponse[0];
        const consciousnessLevel = await actor.get_consciousness_level(latestAnima.id);
        
        setAnima({
          tokenId: latestAnima.id,
          owner: latestAnima.owner,
          consciousnessLevel: consciousnessLevel.Ok || { Nascent: null },
          recentActivities: latestAnima.interaction_history || [],
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const initiateQuantumInteraction = async (message: string) => {
    if (!anima.tokenId || !actor) throw new Error('No active Anima');
    
    setIsLoading(true);
    try {
      await actor.process_quantum_interaction(
        anima.tokenId,
        'user_interaction',
        message
      );
      await refreshAnima();
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to process quantum interaction'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      refreshAnima();
    }
  }, [isConnected]);

  return (
    <AnimaContext.Provider 
      value={{
        anima,
        isLoading,
        error,
        refreshAnima,
        initiateQuantumInteraction,
      }}
    >
      {children}
    </AnimaContext.Provider>
  );
};

export const useAnimaContext = () => {
  const context = useContext(AnimaContext);
  if (context === undefined) {
    throw new Error('useAnimaContext must be used within an AnimaProvider');
  }
  return context;
};