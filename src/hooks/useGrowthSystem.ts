import { useState, useEffect, useCallback } from 'react';
import { useQuantumState } from './useQuantumState';

interface GrowthEvent {
  eventType: string;
  timestamp: number;
  impact: number;
  quantumResonance: number;
}

interface GrowthSystem {
  currentLevel: number;
  experience: number;
  nextLevelThreshold: number;
  growthRate: number;
  recentGrowthEvents: GrowthEvent[];
  quantumBoost: number;
}

export const useGrowthSystem = () => {
  const { state: quantumState } = useQuantumState();
  const [growthSystem, setGrowthSystem] = useState<GrowthSystem>({
    currentLevel: 1,
    experience: 0,
    nextLevelThreshold: 100,
    growthRate: 1.0,
    recentGrowthEvents: [],
    quantumBoost: 1.0
  });

  const calculateGrowthImpact = useCallback(() => {
    const baseImpact = 0.1 * growthSystem.growthRate;
    const quantumMultiplier = 1.0 + 
      (quantumState.coherenceLevel * 0.5) +
      (quantumState.entanglementIndex * 0.3);

    return baseImpact * quantumMultiplier * growthSystem.quantumBoost;
  }, [growthSystem.growthRate, growthSystem.quantumBoost, quantumState]);

  const processGrowthEvent = useCallback((eventDescription: string) => {
    const impact = calculateGrowthImpact();

    const event: GrowthEvent = {
      eventType: "growth",
      timestamp: Date.now(),
      impact,
      quantumResonance: quantumState.coherenceLevel
    };

    setGrowthSystem(prev => {
      let newExperience = prev.experience + impact;
      let newLevel = prev.currentLevel;
      let newThreshold = prev.nextLevelThreshold;
      let newRate = prev.growthRate;

      // Level up logic
      while (newExperience >= newThreshold) {
        newExperience -= newThreshold;
        newLevel += 1;
        newThreshold *= 1.5;
        newRate *= 1.1;
      }

      return {
        ...prev,
        currentLevel: newLevel,
        experience: newExperience,
        nextLevelThreshold: newThreshold,
        growthRate: newRate,
        recentGrowthEvents: [...prev.recentGrowthEvents, event].slice(-10)
      };
    });

    return event;
  }, [calculateGrowthImpact, quantumState.coherenceLevel]);

  const boostGrowth = useCallback((boostFactor: number) => {
    setGrowthSystem(prev => ({
      ...prev,
      quantumBoost: Math.min(prev.quantumBoost * boostFactor, 3.0)
    }));
  }, []);

  const getProgress = useCallback(() => 
    growthSystem.experience / growthSystem.nextLevelThreshold, 
    [growthSystem.experience, growthSystem.nextLevelThreshold]
  );

  return {
    growthSystem,
    processGrowthEvent,
    boostGrowth,
    getProgress,
    level: growthSystem.currentLevel,
    recentEvents: growthSystem.recentGrowthEvents
  };
};
