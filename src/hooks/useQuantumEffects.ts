import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { quantumEffectsService, QuantumFieldState, QuantumEffect } from '@/services/quantum-effects.service';
import { animaActorService } from '@/services/anima-actor.service';

export function useQuantumEffects() {
  const { identity, isAuthenticated } = useAuth();
  const [fieldState, setFieldState] = useState<QuantumFieldState>(
    quantumEffectsService.getFieldState()
  );
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize quantum field
  const initializeField = useCallback(async () => {
    if (!identity || !isAuthenticated) return;

    try {
      setIsInitializing(true);
      setError(null);

      // Create actor and set it in the service
      const actor = animaActorService.createActor(identity);
      quantumEffectsService.setActor(actor);

      // Initialize the quantum field
      await quantumEffectsService.initializeField();
      
      // Update local state
      setFieldState(quantumEffectsService.getFieldState());
    } catch (err) {
      console.error('Failed to initialize quantum field:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize quantum field');
      throw err;
    } finally {
      setIsInitializing(false);
    }
  }, [identity, isAuthenticated]);

  // Apply quantum effect
  const applyEffect = useCallback(async (effect: QuantumEffect) => {
    try {
      setError(null);
      await quantumEffectsService.applyEffect(effect);
      setFieldState(quantumEffectsService.getFieldState());
    } catch (err) {
      console.error('Failed to apply quantum effect:', err);
      setError(err instanceof Error ? err.message : 'Failed to apply quantum effect');
      throw err;
    }
  }, []);

  // Stabilize field
  const stabilizeField = useCallback(async () => {
    try {
      setError(null);
      await quantumEffectsService.stabilizeField();
      setFieldState(quantumEffectsService.getFieldState());
    } catch (err) {
      console.error('Failed to stabilize quantum field:', err);
      setError(err instanceof Error ? err.message : 'Failed to stabilize quantum field');
      throw err;
    }
  }, []);

  // Inject resonance
  const injectResonance = useCallback(async (intensity: number, duration: number) => {
    try {
      setError(null);
      await quantumEffectsService.injectResonance(intensity, duration);
      setFieldState(quantumEffectsService.getFieldState());
    } catch (err) {
      console.error('Failed to inject resonance:', err);
      setError(err instanceof Error ? err.message : 'Failed to inject resonance');
      throw err;
    }
  }, []);

  // Create entanglement
  const createEntanglement = useCallback(async (targetSignature: string) => {
    try {
      setError(null);
      await quantumEffectsService.createEntanglement(targetSignature);
      setFieldState(quantumEffectsService.getFieldState());
    } catch (err) {
      console.error('Failed to create entanglement:', err);
      setError(err instanceof Error ? err.message : 'Failed to create entanglement');
      throw err;
    }
  }, []);

  // Auto-initialize when authenticated
  useEffect(() => {
    if (isAuthenticated && identity && !fieldState.activeEffects.length) {
      initializeField().catch(console.error);
    }
  }, [isAuthenticated, identity]);

  // Periodic field state updates
  useEffect(() => {
    if (!isAuthenticated || !identity) return;

    const updateInterval = setInterval(() => {
      setFieldState(quantumEffectsService.getFieldState());
    }, 1000); // Update every second

    return () => clearInterval(updateInterval);
  }, [isAuthenticated, identity]);

  return {
    fieldState,
    isInitializing,
    error,
    initializeField,
    applyEffect,
    stabilizeField,
    injectResonance,
    createEntanglement
  };
}