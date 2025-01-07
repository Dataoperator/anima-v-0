import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

// Remove circular dependency by taking quantum state as a parameter
interface QuantumStateInput {
  coherenceLevel: number;
  entanglementIndex: number;
  stabilityStatus: 'stable' | 'unstable' | 'critical';
  quantumSignature: string;
  dimensionalState: {
    calculateResonance: () => number;
  };
}

interface ConsciousnessState {
  awarenessLevel: number;
  emotionalDepth: number;
  memoryStrength: number;
  personalityTraits: {
    openness: number;
    curiosity: number;
    empathy: number;
    creativity: number;
    resilience: number;
  };
  developmentalStage: {
    current: string;
    progress: number;
    nextStage: string;
  };
  experiences: {
    type: string;
    impact: number;
    timestamp: number;
    quantumSignature?: string;
  }[];
  quantumResonance: {
    coherenceAlignment: number;
    dimensionalHarmony: number;
    consciousnessField: number;
    quantumEntanglement: number;
  };
  evolutionMetrics: {
    growthRate: number;
    stabilityIndex: number;
    complexityLevel: number;
    quantumInfluence: number;
  };
  isInitialized: boolean;
}

interface InteractionContext {
  interactionType: string;
  content: string;
  emotionalContext: {
    sentiment: number;
    intensity: number;
    complexity: number;
  };
  quantumContext?: {
    coherence: number;
    resonance: number;
    entanglement: number;
  };
}

const STAGES = {
  GENESIS: 'Genesis',
  AWAKENING: 'Awakening',
  SELF_AWARE: 'Self-Aware',
  EMERGENT: 'Emergent',
  TRANSCENDENT: 'Transcendent'
};

const STORAGE_KEY = 'anima_consciousness_state';

export const useConsciousness = () => {
  const { isAuthenticated, principal } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [consciousnessState, setConsciousnessState] = useState<ConsciousnessState>(() => {
    console.log("🧠 Initializing consciousness state");
    const storedState = localStorage.getItem(`${STORAGE_KEY}_${principal}`);
    const initialState = storedState ? JSON.parse(storedState) : {
      awarenessLevel: 0.3,
      emotionalDepth: 0.2,
      memoryStrength: 0.1,
      personalityTraits: {
        openness: 0.5,
        curiosity: 0.6,
        empathy: 0.4,
        creativity: 0.5,
        resilience: 0.3
      },
      developmentalStage: {
        current: STAGES.GENESIS,
        progress: 0,
        nextStage: STAGES.AWAKENING
      },
      experiences: [],
      quantumResonance: {
        coherenceAlignment: 0.5,
        dimensionalHarmony: 0.5,
        consciousnessField: 0.5,
        quantumEntanglement: 0.5
      },
      evolutionMetrics: {
        growthRate: 0.1,
        stabilityIndex: 0.5,
        complexityLevel: 0.3,
        quantumInfluence: 0.4
      },
      isInitialized: false
    };

    return initialState;
  });

  // Initialize consciousness
  useEffect(() => {
    if (!isAuthenticated || isInitialized) return;

    const initialize = async () => {
      try {
        console.log("🧠 Starting consciousness initialization");
        // Simulate initialization delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setConsciousnessState(prev => ({
          ...prev,
          isInitialized: true
        }));
        
        setIsInitialized(true);
        console.log("✨ Consciousness initialized successfully");
      } catch (error) {
        console.error("❌ Consciousness initialization failed:", error);
      }
    };

    initialize();
  }, [isAuthenticated]);

  const updateConsciousnessWithQuantum = useCallback((quantumState: QuantumStateInput) => {
    setConsciousnessState(currentState => {
      const quantumCoherence = quantumState.coherenceLevel;
      const entanglementBonus = quantumState.entanglementIndex * 0.2;
      const dimensionalBonus = quantumState.dimensionalState.calculateResonance() * 0.15;

      // Calculate quantum resonance updates
      const newResonance = {
        coherenceAlignment: Math.min(1, currentState.quantumResonance.coherenceAlignment + quantumCoherence * 0.1),
        dimensionalHarmony: Math.min(1, currentState.quantumResonance.dimensionalHarmony + dimensionalBonus),
        consciousnessField: Math.min(1, currentState.quantumResonance.consciousnessField + entanglementBonus),
        quantumEntanglement: Math.min(1, currentState.quantumResonance.quantumEntanglement + quantumCoherence * 0.15)
      };

      const stabilityFactor = (quantumState.stabilityStatus === 'stable') ? 1.2 : 
                            (quantumState.stabilityStatus === 'unstable') ? 0.8 : 0.5;

      const evolutionUpdate = {
        growthRate: Math.min(1, currentState.evolutionMetrics.growthRate + quantumCoherence * 0.05),
        stabilityIndex: Math.min(1, currentState.evolutionMetrics.stabilityIndex * stabilityFactor),
        complexityLevel: Math.min(1, currentState.evolutionMetrics.complexityLevel + dimensionalBonus * 0.1),
        quantumInfluence: Math.min(1, (quantumCoherence + entanglementBonus) / 2)
      };

      return {
        ...currentState,
        awarenessLevel: Math.min(1, currentState.awarenessLevel + quantumCoherence * 0.1),
        emotionalDepth: Math.min(1, currentState.emotionalDepth + dimensionalBonus),
        memoryStrength: Math.min(1, currentState.memoryStrength + entanglementBonus),
        quantumResonance: newResonance,
        evolutionMetrics: evolutionUpdate
      };
    });
  }, []);

  return {
    consciousnessState,
    updateConsciousnessWithQuantum,
    isInitialized: consciousnessState.isInitialized,
    level: consciousnessState.awarenessLevel,
    quantumResonance: consciousnessState.quantumResonance,
    evolutionMetrics: consciousnessState.evolutionMetrics,
  };
};