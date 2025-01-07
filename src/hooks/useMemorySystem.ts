import { useState, useCallback, useEffect } from 'react';
import { useQuantumState } from './useQuantumState';
import { usePersonalityEngine } from './usePersonalityEngine';
import { NFTPersonality } from '../types/personality';
import { QuantumState } from '../types/quantum';

export enum MemoryEventType {
  Interaction = 'Interaction',
  Growth = 'Growth',
  Evolution = 'Evolution',
  QuantumShift = 'QuantumShift',
  ConsciousnessLeap = 'ConsciousnessLeap'
}

interface Memory {
  content: string;
  strength: number;
  personalityState: NFTPersonality;
  quantumState: QuantumState;
  eventType: MemoryEventType;
  description: string;
  emotionalImpact: number;
  importanceScore: number;
  keywords: string[];
  timestamp: number;
  resonanceSignature: Uint8Array;
}

export const useMemorySystem = () => {
  const { state: currentQuantumState } = useQuantumState();
  const { personality } = usePersonalityEngine();
  const [memories, setMemories] = useState<Memory[]>([]);

  const createMemory = useCallback((
    content: string,
    eventType: MemoryEventType,
    emotionalImpact: number,
    options?: {
      description?: string;
      keywords?: string[];
      importanceScore?: number;
    }
  ): Memory => {
    const memory: Memory = {
      content,
      strength: 1.0,
      personalityState: { ...personality },
      quantumState: { ...currentQuantumState },
      eventType,
      description: options?.description || '',
      emotionalImpact,
      importanceScore: options?.importanceScore || 0.0,
      keywords: options?.keywords || [],
      timestamp: Date.now(),
      resonanceSignature: new Uint8Array(8)
    };

    // Update resonance signature
    updateResonanceSignature(memory, currentQuantumState);

    setMemories(prev => [...prev, memory]);
    return memory;
  }, [personality, currentQuantumState]);

  const decayMemories = useCallback(() => {
    const DECAY_FACTOR = 0.01; // 1% decay per interval
    setMemories(prev => prev.map(memory => ({
      ...memory,
      strength: Math.max(0, memory.strength * (1.0 - DECAY_FACTOR))
    })));
  }, []);

  const reinforceMemory = useCallback((index: number, amount: number) => {
    setMemories(prev => prev.map((memory, i) => {
      if (i === index) {
        return {
          ...memory,
          strength: Math.min(1.0, memory.strength + amount)
        };
      }
      return memory;
    }));
  }, []);

  const calculateResonance = useCallback((memory: Memory): number => {
    const coherenceDiff = Math.abs(memory.quantumState.coherenceLevel - currentQuantumState.coherenceLevel);
    const dimensionalDiff = Math.abs(memory.quantumState.dimensionalFrequency - currentQuantumState.dimensionalFrequency);
    
    // Calculate resonance using quantum metrics
    return 1.0 - (coherenceDiff + dimensionalDiff) / 2;
  }, [currentQuantumState]);

  const updateResonanceSignature = (memory: Memory, quantumState: QuantumState) => {
    const resonance = calculateResonance(memory);
    const timestamp = Date.now();
    
    // Create 8-byte signature
    const signature = new Uint8Array(8);
    signature[0] = Math.floor(resonance * 255);
    signature[1] = Math.floor(memory.strength * 255);
    signature[2] = Math.floor(memory.emotionalImpact * 255);
    signature[3] = Math.floor(memory.importanceScore * 255);
    signature[4] = timestamp & 0xFF;
    signature[5] = (timestamp >> 8) & 0xFF;
    signature[6] = (timestamp >> 16) & 0xFF;
    signature[7] = (timestamp >> 24) & 0xFF;

    memory.resonanceSignature = signature;
  };

  const getMemoryStrength = useCallback((memory: Memory): number => {
    const baseStrength = memory.strength;
    const resonance = calculateResonance(memory);
    const timeFactor = calculateTimeDecay(memory);
    
    return baseStrength * resonance * timeFactor;
  }, [calculateResonance]);

  const calculateTimeDecay = (memory: Memory): number => {
    const age = Date.now() - memory.timestamp;
    const decayRate = 0.1; // Adjustable decay rate
    
    return Math.exp(-decayRate * age / (24 * 60 * 60 * 1000));
  };

  // Periodic memory maintenance
  useEffect(() => {
    const intervalId = setInterval(() => {
      decayMemories();
      
      // Update resonance signatures
      setMemories(prev => prev.map(memory => {
        updateResonanceSignature(memory, currentQuantumState);
        return memory;
      }));
    }, 60000); // Run every minute

    return () => clearInterval(intervalId);
  }, [decayMemories, currentQuantumState]);

  // Memory retrieval functions
  const findSimilarMemories = useCallback((
    content: string,
    threshold: number = 0.7
  ): Memory[] => {
    return memories
      .filter(memory => {
        const resonance = calculateResonance(memory);
        const strength = getMemoryStrength(memory);
        return resonance * strength >= threshold;
      })
      .sort((a, b) => getMemoryStrength(b) - getMemoryStrength(a));
  }, [memories, calculateResonance, getMemoryStrength]);

  const getMostRecentMemories = useCallback((
    count: number = 10
  ): Memory[] => {
    return [...memories]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, count);
  }, [memories]);

  const getStrongestMemories = useCallback((
    count: number = 10
  ): Memory[] => {
    return [...memories]
      .sort((a, b) => getMemoryStrength(b) - getMemoryStrength(a))
      .slice(0, count);
  }, [memories, getMemoryStrength]);

  const findMemoriesByType = useCallback((
    eventType: MemoryEventType,
    count?: number
  ): Memory[] => {
    const filteredMemories = memories
      .filter(memory => memory.eventType === eventType)
      .sort((a, b) => getMemoryStrength(b) - getMemoryStrength(a));
    
    return count ? filteredMemories.slice(0, count) : filteredMemories;
  }, [memories, getMemoryStrength]);

  const pruneWeakMemories = useCallback((
    strengthThreshold: number = 0.1
  ) => {
    setMemories(prev => prev.filter(memory => 
      getMemoryStrength(memory) >= strengthThreshold
    ));
  }, [getMemoryStrength]);

  const consolidateMemories = useCallback(() => {
    // Group similar memories and combine their strengths
    const groupedMemories = new Map<string, Memory[]>();
    
    memories.forEach(memory => {
      const key = `${memory.eventType}-${memory.keywords.sort().join('-')}`;
      const group = groupedMemories.get(key) || [];
      group.push(memory);
      groupedMemories.set(key, group);
    });

    const consolidatedMemories: Memory[] = [];
    groupedMemories.forEach(group => {
      if (group.length === 1) {
        consolidatedMemories.push(group[0]);
      } else {
        // Combine similar memories
        const strongest = group.reduce((prev, curr) => 
          getMemoryStrength(prev) > getMemoryStrength(curr) ? prev : curr
        );

        const combined: Memory = {
          ...strongest,
          strength: Math.min(1.0, strongest.strength * 1.2), // Boost strength
          emotionalImpact: group.reduce((sum, m) => sum + m.emotionalImpact, 0) / group.length,
          importanceScore: Math.max(...group.map(m => m.importanceScore))
        };

        updateResonanceSignature(combined, currentQuantumState);
        consolidatedMemories.push(combined);
      }
    });

    setMemories(consolidatedMemories);
  }, [memories, getMemoryStrength, currentQuantumState]);

  return {
    memories,
    createMemory,
    reinforceMemory,
    findSimilarMemories,
    getMostRecentMemories,
    getStrongestMemories,
    findMemoriesByType,
    pruneWeakMemories,
    consolidateMemories,
    getMemoryStrength
  };
};

export default useMemorySystem;