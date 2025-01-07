import { useEffect, useRef } from 'react';
import {
  createAmbientSound,
  createConsciousnessSound,
  createTraitSound,
  createQuantumSound,
  createBirthSound
} from '@/utils/soundGenerator';

const useSoundEffect = () => {
  const soundRef = useRef(null);

  const play = (creator) => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
    soundRef.current = creator();
  };

  const stop = () => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current = null;
    }
  };

  return { play, stop };
};

export const useGenesisSound = (phase) => {
  const ambient = useSoundEffect();
  const effect = useSoundEffect();

  useEffect(() => {
    if (!phase) {
      ambient.stop();
      effect.stop();
      return;
    }

    switch (phase) {
      case 'initiation':
        ambient.play(createAmbientSound);
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
        ambient.stop();
        effect.stop();
    }

    return () => {
      // Cleanup when phase changes or component unmounts
      ambient.stop();
      effect.stop();
    };
  }, [phase]);
};