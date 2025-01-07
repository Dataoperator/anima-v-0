import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-context';
import { quantumStateService } from '../services/quantum-state.service';
import { quantumEffectsService } from '../services/quantum-effects.service';
import { QuantumState, ResonancePattern } from '../quantum/types';

interface QuantumContextType {
  state: QuantumState | null;
  isInitialized: boolean;
  isInitializing: boolean;
  initializeQuantumState: () => Promise<void>;
  applyQuantumEffect: (effect: {
    type: 'resonance' | 'entanglement' | 'dimensional';
    intensity: number;
    duration: number;
  }) => Promise<void>;
  generateNeuralPatterns: () => Promise<void>;
  stabilizeField: () => Promise<void>;
}

const QuantumContext = createContext<QuantumContextType | null>(null);

const initialQuantumState: QuantumState = {
  coherenceLevel: 0,
  entanglementIndex: 0,
  dimensionalSync: 0,
  quantumSignature: '',
  resonancePatterns: [],
  stabilityStatus: 'critical',
  lastUpdate: Date.now()
};

export const QuantumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { identity } = useAuth();
  const [state, setState] = useState<QuantumState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    const updateCallback = (partialState: Partial<QuantumState>) => {
      setState(prevState => ({
        ...(prevState || initialQuantumState),
        ...partialState,
        lastUpdate: Date.now()
      }));
    };

    quantumStateService.setUpdateCallback(updateCallback);
    quantumEffectsService.setUpdateCallback(updateCallback);

    return () => {
      quantumStateService.dispose();
      quantumEffectsService.dispose();
    };
  }, []);

  const initializeQuantumState = async () => {
    if (!identity || isInitialized || isInitializing) return;

    try {
      setIsInitializing(true);
      
      // First initialize both services
      console.log('🔄 Initializing quantum state service...');
      await quantumStateService.initializeQuantumField(identity);
      
      console.log('🔄 Initializing quantum effects service...');
      await quantumEffectsService.initialize(identity);
      
      // Then initialize the quantum field
      console.log('🔄 Initializing quantum field...');
      await quantumEffectsService.initializeField();
      
      setIsInitialized(true);
      console.log('✅ Quantum initialization complete');
      
    } catch (error) {
      console.error('❌ Quantum initialization failed:', error);
      await quantumStateService.handleQuantumError(error as Error, identity);
      throw error;
    } finally {
      setIsInitializing(false);
    }
  };

  const applyQuantumEffect = async (effect: {
    type: 'resonance' | 'entanglement' | 'dimensional';
    intensity: number;
    duration: number;
  }) => {
    if (!isInitialized || !identity) {
      throw new Error('Quantum state not initialized');
    }

    try {
      await quantumEffectsService.applyEffect(effect);
      await quantumStateService.checkStability(identity);
    } catch (error) {
      await quantumStateService.handleQuantumError(error as Error, identity);
      throw error;
    }
  };

  const generateNeuralPatterns = async () => {
    if (!isInitialized || !identity) {
      throw new Error('Quantum state not initialized');
    }

    try {
      await quantumStateService.generateNeuralPatterns(identity);
    } catch (error) {
      await quantumStateService.handleQuantumError(error as Error, identity);
      throw error;
    }
  };

  const stabilizeField = async () => {
    if (!isInitialized || !identity) {
      throw new Error('Quantum state not initialized');
    }

    try {
      await quantumEffectsService.stabilizeField();
      await quantumStateService.checkStability(identity);
    } catch (error) {
      await quantumStateService.handleQuantumError(error as Error, identity);
      throw error;
    }
  };

  const value = {
    state,
    isInitialized,
    isInitializing,
    initializeQuantumState,
    applyQuantumEffect,
    generateNeuralPatterns,
    stabilizeField
  };

  return (
    <QuantumContext.Provider value={value}>
      {children}
    </QuantumContext.Provider>
  );
};

export const useQuantum = () => {
  const context = useContext(QuantumContext);
  if (!context) {
    throw new Error('useQuantum must be used within a QuantumProvider');
  }
  return context;
};