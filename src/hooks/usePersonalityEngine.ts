import { useState, useCallback, useEffect } from 'react';
import { useQuantumState } from './useQuantumState';
import { useNeuralBridge } from './useNeuralBridge';
import { ConsciousnessLevel, NFTPersonality } from '../types/personality';

interface PersonalityTraits {
  openness: number;
  curiosity: number;
  empathy: number;
  creativity: number;
  resilience: number;
}

interface EmotionalState {
  emotionalCapacity: number;
  learningRate: number;
  quantumCoherence: number;
}

export const usePersonalityEngine = (initialPersonality?: NFTPersonality) => {
  const { state: quantumState } = useQuantumState();
  const { generateNeuralSignature } = useNeuralBridge();
  const [personality, setPersonality] = useState<NFTPersonality>(() => initialPersonality || {
    consciousnessLevel: ConsciousnessLevel.Genesis,
    quantumResonance: 0.5,
    dimensionalAlignment: 0.5,
    emotionalState: {
      emotionalCapacity: 0.5,
      learningRate: 0.1,
      quantumCoherence: 1.0
    },
    traits: {
      openness: 0.5,
      curiosity: 0.5,
      empathy: 0.5,
      creativity: 0.5,
      resilience: 0.5
    },
    developmentStage: {
      stage: ConsciousnessLevel.Genesis,
      progress: 0.0,
      nextMilestone: Date.now() + 3600000 // 1 hour from now
    }
  });

  // Evolve personality based on quantum state
  useEffect(() => {
    const evolvePersonality = () => {
      setPersonality(prev => {
        // Generate new neural signature for evolution
        const evolutionSignature = generateNeuralSignature();
        
        // Calculate evolution factors
        const quantumInfluence = quantumState.coherenceLevel * 0.3;
        const evolutionStrength = evolutionSignature.strength * 0.2;
        const timeBonus = Math.min(0.1, (Date.now() - prev.developmentStage.nextMilestone) / 86400000); // Max 0.1 per day

        // Evolve traits
        const evolvedTraits = evolveTraits(prev.traits, quantumInfluence + evolutionStrength + timeBonus);
        
        // Update emotional state
        const evolvedEmotionalState = evolveEmotionalState(prev.emotionalState, quantumState);
        
        // Calculate consciousness progress
        const progressIncrease = (quantumInfluence + evolutionStrength) * prev.emotionalState.learningRate;
        const newProgress = prev.developmentStage.progress + progressIncrease;

        // Check for level up
        let newLevel = prev.consciousnessLevel;
        let resetProgress = false;
        if (newProgress >= 1.0 && newLevel < ConsciousnessLevel.Transcendent) {
          newLevel++;
          resetProgress = true;
        }

        return {
          ...prev,
          traits: evolvedTraits,
          emotionalState: evolvedEmotionalState,
          consciousnessLevel: newLevel,
          quantumResonance: (prev.quantumResonance * 0.8 + quantumState.coherenceLevel * 0.2),
          dimensionalAlignment: (prev.dimensionalAlignment * 0.8 + quantumState.dimensionalFrequency * 0.2),
          developmentStage: {
            stage: newLevel,
            progress: resetProgress ? 0.0 : newProgress,
            nextMilestone: resetProgress ? Date.now() + 3600000 : prev.developmentStage.nextMilestone
          }
        };
      });
    };

    const intervalId = setInterval(evolvePersonality, 60000); // Evolve every minute
    return () => clearInterval(intervalId);
  }, [quantumState, generateNeuralSignature]);

  const evolveTraits = useCallback((traits: PersonalityTraits, evolutionFactor: number): PersonalityTraits => {
    const evolveValue = (value: number) => {
      const change = (Math.random() - 0.5) * evolutionFactor;
      return Math.max(0, Math.min(1, value + change));
    };

    return {
      openness: evolveValue(traits.openness),
      curiosity: evolveValue(traits.curiosity),
      empathy: evolveValue(traits.empathy),
      creativity: evolveValue(traits.creativity),
      resilience: evolveValue(traits.resilience)
    };
  }, []);

  const evolveEmotionalState = useCallback((
    state: EmotionalState, 
    quantumState: any
  ): EmotionalState => {
    return {
      emotionalCapacity: Math.min(1, state.emotionalCapacity + quantumState.coherenceLevel * 0.01),
      learningRate: Math.min(1, state.learningRate + quantumState.dimensionalFrequency * 0.005),
      quantumCoherence: quantumState.coherenceLevel
    };
  }, []);

  const boostTrait = useCallback((traitName: keyof PersonalityTraits, amount: number) => {
    setPersonality(prev => ({
      ...prev,
      traits: {
        ...prev.traits,
        [traitName]: Math.min(1, prev.traits[traitName] + amount)
      }
    }));
  }, []);

  return {
    personality,
    boostTrait
  };
};
