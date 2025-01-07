import { useState, useCallback, useContext } from 'react';
import { useActor } from './useActor';
import { toast } from '@/components/ui/use-toast';

export const useQuantumState = (animaId) => {
  const [isObserving, setIsObserving] = useState(false);
  const [isEntangling, setIsEntangling] = useState(false);
  const actor = useActor();

  const observeState = useCallback(async () => {
    if (!actor || !animaId) return null;
    setIsObserving(true);
    
    try {
      const state = await actor.observe_quantum_state(animaId);
      return state;
    } catch (error) {
      toast({
        title: "Quantum Observation Failed",
        description: "The quantum state collapsed during observation.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsObserving(false);
    }
  }, [actor, animaId]);

  const initiateEntanglement = useCallback(async (targetId) => {
    if (!actor || !animaId) return false;
    setIsEntangling(true);
    
    try {
      const result = await actor.attempt_quantum_entanglement(animaId, targetId);
      
      if ('Ok' in result) {
        toast({
          title: "Quantum Entanglement Successful",
          description: "A new quantum connection has been established.",
        });
        return true;
      } else {
        toast({
          title: "Entanglement Failed",
          description: "Unable to establish quantum connection.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Entanglement Error",
        description: "An unexpected error occurred during entanglement.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsEntangling(false);
    }
  }, [actor, animaId]);

  const getMetrics = useCallback(async () => {
    if (!actor || !animaId) return null;
    
    try {
      const metrics = await actor.get_quantum_metrics(animaId);
      return metrics;
    } catch (error) {
      console.error('Failed to fetch quantum metrics:', error);
      return null;
    }
  }, [actor, animaId]);

  return {
    observeState,
    initiateEntanglement,
    getMetrics,
    isObserving,
    isEntangling,
  };
};
