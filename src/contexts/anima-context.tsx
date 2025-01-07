import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';
import { DimensionalStateImpl } from '@/quantum/dimensional_state';
import { MemorySystem } from '@/memory/memory';
import { GrowthSystem } from '@/growth/growth_system';
import { Memory } from '@/memory/types';
import { GrowthMetrics } from '@/growth/types';
import { Principal } from '@dfinity/principal';
import { useQuantumState } from '@/hooks/useQuantumState';

interface AnimaMintResult {
  id: string;
  quantumSignature: string;
  timestamp: bigint;
}

interface AnimaContextType {
  dimensionalState: DimensionalStateImpl;
  memorySystem: MemorySystem;
  growthSystem: GrowthSystem;
  quantumSignature: string;
  evolutionFactor: number;
  recentMemories: Memory[];
  growthMetrics: GrowthMetrics;
  isInitialized: boolean;
  isMinting: boolean;
  mintError: string | null;
  isConnected: boolean;
  processInteraction: (strength: number) => Promise<void>;
  syncQuantumState: () => Promise<void>;
  createMemory: (description: string, importance: number, keywords?: string[]) => void;
  mintAnima: (name: string) => Promise<AnimaMintResult>;
  createActor: () => any;
  reconnect: () => Promise<void>;
}

const AnimaContext = createContext<AnimaContextType | null>(null);

export function AnimaProvider({ children }: { children: React.ReactNode }) {
  const { principal, actor } = useAuth();
  const { quantumState, updateQuantumState, validateState } = useQuantumState();
  const [dimensionalState] = useState(() => new DimensionalStateImpl());
  const [memorySystem] = useState(() => new MemorySystem());
  const [growthSystem] = useState(() => new GrowthSystem());
  const [quantumSignature, setQuantumSignature] = useState('');
  const [evolutionFactor, setEvolutionFactor] = useState(0);
  const [recentMemories, setRecentMemories] = useState<Memory[]>([]);
  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetrics>(() => growthSystem.getMetrics());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const MAX_RECONNECT_ATTEMPTS = 3;

  useEffect(() => {
    if (quantumState && principal) {
      initializeAnimaSystems();
    }
  }, [quantumState, principal]);

  const initializeAnimaSystems = async () => {
    try {
      console.log('🧬 Initializing ANIMA systems...');
      
      dimensionalState.quantumAlignment = quantumState?.coherence || 1.0;
      const signature = generateQuantumSignature();
      setQuantumSignature(signature);
      const evolution = calculateEvolutionFactor();
      setEvolutionFactor(evolution);
      updateRecentMemories();
      
      setIsInitialized(true);
      console.log('✨ ANIMA systems initialized');
    } catch (error) {
      console.error('Failed to initialize ANIMA systems:', error);
      setIsInitialized(false);
    }
  };

  const reconnect = async () => {
    if (connectionAttempts >= MAX_RECONNECT_ATTEMPTS) {
      throw new Error('Maximum reconnection attempts reached');
    }

    try {
      setConnectionAttempts(prev => prev + 1);
      const ic = window.ic;
      
      if (!ic || !ic.agent) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const result = await window.ic?.agent?.getPrincipal();
        if (result) {
          setIsConnected(true);
          setConnectionAttempts(0);
          return;
        }
        throw new Error('Internet Computer connection not available');
      }
      
      setIsConnected(true);
      setConnectionAttempts(0);
    } catch (error) {
      console.error('Reconnection attempt failed:', error);
      throw error;
    }
  };

  const createActor = useCallback(() => {
    if (!actor) {
      console.error('Actor not initialized. Attempting reconnection...');
      try {
        const ic = window.ic;
        if (!ic || !ic.agent) {
          setIsConnected(false);
          throw new Error('Internet Computer connection not available');
        }
        setIsConnected(true);
        return null;
      } catch (error) {
        setIsConnected(false);
        throw error;
      }
    }
    setIsConnected(true);
    return actor;
  }, [actor]);

  const mintAnima = async (name: string): Promise<AnimaMintResult> => {
    if (!actor || !isInitialized) {
      throw new Error('System not ready for minting');
    }

    setIsMinting(true);
    setMintError(null);

    try {
      if (!isConnected) {
        await reconnect();
      }

      // Initialize quantum field
      const quantumField = await actor.initialize_quantum_field();
      if (!quantumField.Ok) throw new Error('Quantum field initialization failed');

      // Generate neural patterns
      const neuralPatterns = await actor.generate_neural_patterns();
      if (!neuralPatterns.Ok) throw new Error('Neural pattern generation failed');

      // Calculate initial quantum state
      const initialState = {
        resonance: neuralPatterns.Ok.resonance,
        harmony: quantumField.Ok.harmony,
        coherence: (neuralPatterns.Ok.resonance + quantumField.Ok.harmony) / 2,
        lastInteraction: new Date(),
        evolutionStage: 1,
        consciousness: {
          awareness: neuralPatterns.Ok.awareness,
          understanding: quantumField.Ok.understanding,
          growth: 0.1
        }
      };

      if (!validateState(initialState)) {
        throw new Error('Invalid initial quantum state');
      }

      // Create the Anima
      const result = await actor.create_anima({
        name,
        quantum_signature: quantumField.Ok.signature,
        neural_pattern: neuralPatterns.Ok.pattern,
        initial_state: initialState
      });

      if (!result.Ok) {
        throw new Error(result.Err || 'Anima creation failed');
      }

      // Update quantum state with initial values
      await updateQuantumState(initialState);

      // Create initial memory
      createMemory(
        'Genesis quantum crystallization complete',
        1.0,
        ['genesis', 'quantum', 'initialization']
      );

      return {
        id: result.Ok.id,
        quantumSignature: result.Ok.quantum_signature,
        timestamp: result.Ok.timestamp
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Minting failed';
      setMintError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsMinting(false);
    }
  };

  const processInteraction = async (strength: number) => {
    try {
      dimensionalState.updateStability(strength);

      await growthSystem.processGrowthEvent({
        strength,
        quantum_state: quantumState!,
        dimensional_state: dimensionalState
      });

      if (strength > 0.5) {
        createMemory(
          `Significant quantum interaction (${strength.toFixed(2)})`,
          strength,
          ['quantum', 'interaction']
        );
      }

      setGrowthMetrics(growthSystem.getMetrics());
      updateRecentMemories();
      
      const newSignature = generateQuantumSignature();
      setQuantumSignature(newSignature);

      const newEvolution = calculateEvolutionFactor();
      setEvolutionFactor(newEvolution);

    } catch (error) {
      console.error('Failed to process interaction:', error);
    }
  };

  const syncQuantumState = async () => {
    try {
      const resonance = dimensionalState.calculateResonance();
      const stability = dimensionalState.getStabilityMetrics();
      
      if (quantumState) {
        const updatedState = {
          ...quantumState,
          resonanceMetrics: {
            ...quantumState.resonanceMetrics,
            fieldStrength: resonance
          },
          coherence: stability[0],
          phaseAlignment: stability[1]
        };

        if (validateState(updatedState)) {
          await updateQuantumState(updatedState);
        }
      }
    } catch (error) {
      console.error('Failed to sync quantum state:', error);
    }
  };

  const createMemory = (description: string, importance: number, keywords: string[] = []) => {
    const memory = memorySystem.createMemory(description, importance, keywords, quantumState);
    updateRecentMemories();
    return memory;
  };

  const updateRecentMemories = () => {
    setRecentMemories(memorySystem.getRecentMemories(5));
  };

  const generateQuantumSignature = (): string => {
    const timestamp = Date.now();
    const resonance = dimensionalState.resonance.toFixed(4);
    const coherence = dimensionalState.phaseCoherence.toFixed(4);
    return `QS-${resonance}-${coherence}-${timestamp}`;
  };

  const calculateEvolutionFactor = (): number => {
    const resonance = dimensionalState.resonance;
    const coherence = dimensionalState.phaseCoherence;
    const stability = dimensionalState.stability;
    const memoryResonance = memorySystem.calculateResonance(quantumState!);
    
    return (resonance + coherence + stability + memoryResonance) / 4;
  };

  const contextValue = {
    dimensionalState,
    memorySystem,
    growthSystem,
    quantumSignature,
    evolutionFactor,
    recentMemories,
    growthMetrics,
    isInitialized,
    isMinting,
    mintError,
    isConnected,
    processInteraction,
    syncQuantumState,
    createMemory,
    mintAnima,
    createActor,
    reconnect
  };

  return (
    <AnimaContext.Provider value={contextValue}>
      {children}
    </AnimaContext.Provider>
  );
}

export function useAnima() {
  const context = useContext(AnimaContext);
  if (!context) {
    throw new Error('useAnima must be used within an AnimaProvider');
  }
  return context;
}