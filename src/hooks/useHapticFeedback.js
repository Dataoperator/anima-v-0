import { useEffect, useCallback, useRef } from 'react';
import { hapticFeedback } from '@/utils/haptics';
import { supportsHaptics } from '@/utils/deviceDetection';

export const useHapticFeedback = (phase, enabled = true) => {
  const lastPhase = useRef(null);
  const isSupported = supportsHaptics();

  const triggerHaptic = useCallback(() => {
    if (!enabled || !isSupported) return;

    switch (phase) {
      case 'initiation':
        hapticFeedback.initiation();
        break;
      case 'consciousness_emergence':
        hapticFeedback.consciousness();
        break;
      case 'trait_manifestation':
        hapticFeedback.trait();
        break;
      case 'quantum_alignment':
        hapticFeedback.quantum();
        break;
      case 'birth':
        hapticFeedback.birth();
        break;
      default:
        break;
    }
  }, [phase, enabled, isSupported]);

  useEffect(() => {
    if (phase !== lastPhase.current) {
      triggerHaptic();
      lastPhase.current = phase;
    }
  }, [phase, triggerHaptic]);

  return {
    isSupported,
    triggerSuccess: hapticFeedback.success,
    triggerError: hapticFeedback.error,
    stopHaptics: hapticFeedback.stop
  };
};