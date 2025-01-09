import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './auth-context';
import { useQuantum } from './quantum-context';
import { NeuralSignature } from '../neural/types';

interface NeuralContextType {
  neuralState: NeuralState | null;
  isInitialized: boolean;
  isProcessing: boolean;
  initializeNeuralPatterns: () => Promise<void>;
  processInteraction: (data: InteractionData) => Promise<void>;
  synchronizeStates: () => Promise<void>;
}

interface NeuralState {
  signature: NeuralSignature;
  patternStrength: number;
  stabilityIndex: number;
  evolutionState: string;
  lastSync: number;
}

interface InteractionData {
  type: string;
  intensity: number;
  duration: number;
}

const NeuralContext = createContext<NeuralContextType | null>(null);

export const NeuralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { identity } = useAuth();
  const { state: quantumState } = useQuantum();
  const [neuralState, setNeuralState] = useState<NeuralState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const initializeNeuralPatterns = async () => {
    if (!identity || !quantumState || isInitialized || isProcessing) return;

    setIsProcessing(true);
    try {
      const newState: NeuralState = {
        signature: {
          pattern_id: `NP_${Date.now()}`,
          strength: quantumState.coherenceLevel,
          coherence: quantumState.coherenceLevel,
          timestamp: BigInt(Date.now()),
          complexity: 0.1,
          evolution_potential: 1.0,
          quantum_resonance: quantumState.coherenceLevel,
          dimensional_alignment: 1.0,
          pattern_stability: 1.0,
        },
        patternStrength: quantumState.coherenceLevel,
        stabilityIndex: 1.0,
        evolutionState: 'initialized',
        lastSync: Date.now()
      };

      setNeuralState(newState);
      setIsInitialized(true);
    } catch (error) {
      console.error('Neural initialization failed:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const processInteraction = async (data: InteractionData) => {
    if (!isInitialized || !neuralState || isProcessing) {
      throw new Error('Neural system not ready');
    }

    setIsProcessing(true);
    try {
      const updatedState = {
        ...neuralState,
        patternStrength: Math.min(1, neuralState.patternStrength + data.intensity * 0.1),
        lastSync: Date.now()
      };

      setNeuralState(updatedState);
    } finally {
      setIsProcessing(false);
    }
  };

  const synchronizeStates = async () => {
    if (!isInitialized || !neuralState || !quantumState || isProcessing) {
      throw new Error('Systems not ready for synchronization');
    }

    setIsProcessing(true);
    try {
      const updatedState = {
        ...neuralState,
        patternStrength: (neuralState.patternStrength + quantumState.coherenceLevel) / 2,
        stabilityIndex: quantumState.coherenceLevel,
        lastSync: Date.now()
      };

      setNeuralState(updatedState);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <NeuralContext.Provider value={{
      neuralState,
      isInitialized,
      isProcessing,
      initializeNeuralPatterns,
      processInteraction,
      synchronizeStates
    }}>
      {children}
    </NeuralContext.Provider>
  );
};

export const useNeural = () => {
  const context = useContext(NeuralContext);
  if (!context) {
    throw new Error('useNeural must be used within a NeuralProvider');
  }
  return context;
};