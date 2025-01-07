import { useCallback } from 'react';
import { 
  createAmbientSound, 
  createConsciousnessSound, 
  createQuantumSound,
  type SoundInstance
} from '@/utils/soundGenerator';

type SoundType = 'success' | 'hover' | 'quantum' | 'consciousness' | 'ambient';

interface SoundOptions {
  volume?: number;
  pitch?: number;
  duration?: number;
}

const createSound = (type: SoundType, options: SoundOptions = {}): SoundInstance => {
  switch (type) {
    case 'success':
      return createQuantumSound({
        frequency: 880,
        duration: options.duration || 0.3,
        volume: options.volume || 0.5
      });
    case 'hover':
      return createQuantumSound({
        frequency: 440,
        duration: options.duration || 0.1,
        volume: options.volume || 0.2
      });
    case 'quantum':
      return createQuantumSound(options);
    case 'consciousness':
      return createConsciousnessSound(options);
    case 'ambient':
      return createAmbientSound(options);
    default:
      return createQuantumSound(options);
  }
};

export const useSound = () => {
  const playSound = useCallback((type: SoundType, options: SoundOptions = {}) => {
    const sound = createSound(type, options);
    sound.play();
    return sound;
  }, []);

  const playSuccess = useCallback((options: SoundOptions = {}) => {
    return playSound('success', options);
  }, [playSound]);

  const playHover = useCallback((options: SoundOptions = {}) => {
    return playSound('hover', options);
  }, [playSound]);

  const playQuantum = useCallback((options: SoundOptions = {}) => {
    return playSound('quantum', options);
  }, [playSound]);

  const playConsciousness = useCallback((options: SoundOptions = {}) => {
    return playSound('consciousness', options);
  }, [playSound]);

  const playAmbient = useCallback((options: SoundOptions = {}) => {
    return playSound('ambient', options);
  }, [playSound]);

  return {
    playSound,
    playSuccess,
    playHover,
    playQuantum,
    playConsciousness,
    playAmbient
  };
};

export type { SoundType, SoundOptions, SoundInstance };