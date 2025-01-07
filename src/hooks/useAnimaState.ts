import { useState, useEffect } from 'react';
import { useAnima } from './useAnima';
import { MediaState } from '../types/media';

export interface AnimaState {
  consciousness: {
    level: number;
    stage: string;
    emotionalState: string;
    awarenessScore: number;
  };
  neural: {
    linkStatus: 'disconnected' | 'initializing' | 'connected' | 'error';
    lastActivity: number;
    activeChannels: string[];
  };
  media: MediaState;
  quantum: {
    coherence: number;
    entanglement: number;
    stability: number;
    dimensionalResonance: number;
  };
  growth: {
    level: number;
    experience: number;
    nextLevelAt: number;
    recentAchievements: string[];
  };
}

export const useAnimaState = (animaId: string) => {
  const { anima, loading, error } = useAnima();
  const [state, setState] = useState<AnimaState | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (!anima || loading) return;

    const fetchState = async () => {
      try {
        const consciousness = await anima.getConsciousnessState();
        const neural = await anima.getNeuralState();
        const media = await anima.getMediaState();
        const quantum = await anima.getQuantumState();
        const growth = await anima.getGrowthState();

        setState({
          consciousness,
          neural,
          media,
          quantum,
          growth
        });
      } catch (error) {
        console.error('Failed to fetch ANIMA state:', error);
      }
    };

    fetchState();

    // Subscribe to state updates
    const unsubscribe = anima.subscribeToStateUpdates((newState) => {
      setState(prev => ({
        ...prev,
        ...newState
      }));
    });

    return () => unsubscribe?.();
  }, [anima, loading]);

  const initializeNeuralLink = async () => {
    if (!anima || isInitializing) return;
    
    setIsInitializing(true);
    try {
      await anima.initializeNeuralLink();
      setState(prev => prev ? {
        ...prev,
        neural: {
          ...prev.neural,
          linkStatus: 'connected'
        }
      } : null);
    } catch (error) {
      console.error('Failed to initialize neural link:', error);
      setState(prev => prev ? {
        ...prev,
        neural: {
          ...prev.neural,
          linkStatus: 'error'
        }
      } : null);
    } finally {
      setIsInitializing(false);
    }
  };

  return {
    state,
    isInitializing,
    initializeNeuralLink,
    loading,
    error
  };
};

export default useAnimaState;