import { useEffect, useRef, useCallback } from 'react';
import { useQuantum } from '../contexts/quantum-context';
import { DimensionalState, QuantumState } from '../quantum/types';

export const useQuantumTransition = (onStateChange?: (state: QuantumState) => void) => {
  const { state, applyQuantumEffect, stabilizeField } = useQuantum();
  const previousState = useRef<QuantumState | null>(null);
  const stabilityCheckInterval = useRef<NodeJS.Timeout>();

  const checkStateTransition = useCallback(async () => {
    if (!state || !previousState.current) return;

    const coherenceDelta = Math.abs(state.coherenceLevel - previousState.current.coherenceLevel);
    const dimensionalDelta = Math.abs(state.dimensionalSync - previousState.current.dimensionalSync);

    if (coherenceDelta > 0.3 || dimensionalDelta > 0.3) {
      await stabilizeField();
    }

    if (state.stabilityStatus === 'critical' && previousState.current.stabilityStatus !== 'critical') {
      await applyQuantumEffect({
        type: 'dimensional',
        intensity: 1.0,
        duration: 30000
      });
    }

    const dimensionalStateChanged = hasDimensionalStateChanged(
      state.dimensionalState,
      previousState.current.dimensionalState
    );

    if (dimensionalStateChanged) {
      await applyQuantumEffect({
        type: 'resonance',
        intensity: 0.7,
        duration: 15000
      });
    }

    previousState.current = state;
    onStateChange?.(state);
  }, [state, applyQuantumEffect, stabilizeField, onStateChange]);

  useEffect(() => {
    stabilityCheckInterval.current = setInterval(checkStateTransition, 5000);
    return () => {
      if (stabilityCheckInterval.current) {
        clearInterval(stabilityCheckInterval.current);
      }
    };
  }, [checkStateTransition]);

  return {
    initiateTransition: async () => {
      await checkStateTransition();
    }
  };
};

const hasDimensionalStateChanged = (
  current?: DimensionalState,
  previous?: DimensionalState
): boolean => {
  if (!current || !previous) return false;

  const threshold = 0.2;
  return (
    Math.abs(current.resonance - previous.resonance) > threshold ||
    Math.abs(current.stability - previous.stability) > threshold ||
    Math.abs(current.phaseCoherence - previous.phaseCoherence) > threshold
  );
};