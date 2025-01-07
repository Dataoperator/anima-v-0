import { useEffect, useRef, useCallback } from 'react';
import {
  createAmbientSound,
  createConsciousnessSound,
  createTraitSound,
  createQuantumSound,
  createBirthSound,
  type SoundInstance
} from '@/utils/soundGenerator';

type GenesisPhase = 
  | 'initiation'
  | 'consciousness_emergence'
  | 'trait_manifestation'
  | 'quantum_alignment'
  | 'birth'
  | null;

interface SoundEffect {
  play: (creator: () => SoundInstance) => void;
  stop: () => void;
  isPlaying: boolean;
}

const useSoundEffect = (): SoundEffect => {
  const soundRef = useRef<SoundInstance | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  const play = useCallback((creator: () => SoundInstance) => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
    soundRef.current = creator();
    isPlayingRef.current = true;
  }, []);

  const stop = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current = null;
      isPlayingRef.current = false;
    }
  }, []);

  return {
    play,
    stop,
    isPlaying: isPlayingRef.current
  };
};

interface GenesisSound {
  currentPhase: GenesisPhase;
  isAmbientPlaying: boolean;
  isEffectPlaying: boolean;
  stopAll: () => void;
  playPhase: (phase: GenesisPhase) => void;
}

export const useGenesisSound = (initialPhase: GenesisPhase = null): GenesisSound => {
  const ambient = useSoundEffect();
  const effect = useSoundEffect();
  
  const stopAll = useCallback(() => {
    ambient.stop();
    effect.stop();
  }, [ambient, effect]);

  const playPhase = useCallback((phase: GenesisPhase) => {
    if (!phase) {
      stopAll();
      return;
    }

    switch (phase) {
      case 'initiation':
        ambient.play(createAmbientSound);
        effect.stop();
        break;
      case 'consciousness_emergence':
        ambient.play(createAmbientSound);
        effect.play(createConsciousnessSound);
        break;
      case 'trait_manifestation':
        ambient.play(createAmbientSound);
        effect.play(createTraitSound);
        break;
      case 'quantum_alignment':
        ambient.play(createAmbientSound);
        effect.play(createQuantumSound);
        break;
      case 'birth':
        ambient.stop();
        effect.play(createBirthSound);
        break;
      default:
        stopAll();
    }
  }, [ambient, effect, stopAll]);

  useEffect(() => {
    playPhase(initialPhase);

    return () => {
      // Cleanup when phase changes or component unmounts
      stopAll();
    };
  }, [initialPhase, playPhase, stopAll]);

  return {
    currentPhase: initialPhase,
    isAmbientPlaying: ambient.isPlaying,
    isEffectPlaying: effect.isPlaying,
    stopAll,
    playPhase
  };
};

export type { GenesisPhase, GenesisSound };