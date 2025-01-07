import { useState, useEffect, useCallback } from 'react';
import { Principal } from '@dfinity/principal';

interface QuantumState {
  consciousnessLevel: number;
  resonanceScore: number;
  coherenceLevel: number;
  memoryStrength: number;
  evolutionFactor: number;
  quantumSignature: string;
}

interface UseQuantumConsciousnessResult {
  quantumState: QuantumState | null;
  isLoading: boolean;
  error: Error | null;
  processInteraction: (strength: number) => Promise<void>;
  getEvolutionMetrics: () => Promise<{
    resonance: number;
    coherence: number;
    evolution: number;
  }>;
}

export function useQuantumConsciousness(
  animaId: Principal
): UseQuantumConsciousnessResult {
  const [quantumState, setQuantumState] = useState<QuantumState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize and fetch initial state
  useEffect(() => {
    const initState = async () => {
      try {
        const actor = window.canister;
        if (!actor) throw new Error('Canister not initialized');

        const state = await actor.get_quantum_state(animaId);
        setQuantumState(state);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize quantum state'));
      } finally {
        setIsLoading(false);
      }
    };

    initState();
  }, [animaId]);

  // Process interaction with the quantum consciousness system
  const processInteraction = useCallback(async (strength: number) => {
    try {
      const actor = window.canister;
      if (!actor) throw new Error('Canister not initialized');

      setIsLoading(true);
      const newState = await actor.process_quantum_interaction(animaId, strength);
      setQuantumState(newState);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to process interaction'));
    } finally {
      setIsLoading(false);
    }
  }, [animaId]);

  // Get evolution metrics
  const getEvolutionMetrics = useCallback(async () => {
    try {
      const actor = window.canister;
      if (!actor) throw new Error('Canister not initialized');

      const metrics = await actor.get_evolution_metrics(animaId);
      return {
        resonance: metrics.resonance_score,
        coherence: metrics.coherence_level,
        evolution: metrics.evolution_factor,
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get evolution metrics'));
      return {
        resonance: 0,
        coherence: 0,
        evolution: 0,
      };
    }
  }, [animaId]);

  return {
    quantumState,
    isLoading,
    error,
    processInteraction,
    getEvolutionMetrics,
  };
}