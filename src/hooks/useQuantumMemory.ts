import { useState, useEffect, useCallback } from 'react';
import { useRealtimePersonality } from './useRealtimePersonality';
import { useAnimaChat } from './useAnimaChat';

interface EmergentPattern {
  type: 'loop' | 'convergence' | 'divergence' | 'resonance' | 'entanglement';
  strength: number;
  affectedMemories: bigint[];
  dimensionalShift?: {
    from: string;
    to: string;
    probability: number;
  };
}

interface QuantumMemoryState {
  recent: Array<{
    content: string;
    timestamp: bigint;
    emotional_impact: number;
    quantum_resonance: number;
    dimensional_influence: Array<[string, number]>;
    emergent_patterns?: EmergentPattern[];
  }>;
  quantum_state: number;
  entanglement_level: number;
  resonance_field: number;
  emergent_behaviors: EmergentPattern[];
  dimensional_stability: number;
  reality_anchor: number;
}

export const useQuantumMemory = (animaId: string) => {
  const [memoryState, setMemoryState] = useState<QuantumMemoryState>({
    recent: [],
    quantum_state: 0,
    entanglement_level: 0,
    resonance_field: 0.5,
    emergent_behaviors: [],
    dimensional_stability: 1,
    reality_anchor: 1
  });

  const { personality } = useRealtimePersonality(animaId);
  const { messages } = useAnimaChat(null, null);

  const detectEmergentPatterns = useCallback((memories: typeof memoryState.recent) => {
    if (!memories || memories.length < 2) return [];
    
    const patterns: EmergentPattern[] = [];
    
    // Look for temporal loops (similar memories repeating)
    const temporalLoops = memories.reduce((loops, memory, i) => {
      const similarMemories = memories.slice(i + 1).filter(m => {
        const contentSimilarity = calculateSimilarity(memory.content, m.content);
        const resonanceSimilarity = Math.abs(memory.quantum_resonance - m.quantum_resonance) < 0.1;
        return contentSimilarity > 0.7 && resonanceSimilarity;
      });

      if (similarMemories.length > 0) {
        loops.push({
          type: 'loop',
          strength: similarMemories.length / memories.length,
          affectedMemories: [memory.timestamp, ...similarMemories.map(m => m.timestamp)]
        });
      }
      return loops;
    }, [] as EmergentPattern[]);
    
    patterns.push(...temporalLoops);

    // Detect convergent/divergent patterns in quantum resonance
    const resonanceDeltas = memories.slice(1).map((m, i) => ({
      delta: m.quantum_resonance - (memories[i]?.quantum_resonance ?? 0),
      timestamp: m.timestamp
    })).filter(delta => !isNaN(delta.delta));

    if (resonanceDeltas.length > 0) {
      const convergingResonance = resonanceDeltas.every((delta, i) => 
        i === 0 || (Math.abs(delta.delta) < Math.abs(resonanceDeltas[i-1].delta))
      );

      if (convergingResonance) {
        patterns.push({
          type: 'convergence',
          strength: 1 - Math.abs(resonanceDeltas[resonanceDeltas.length - 1].delta),
          affectedMemories: memories.map(m => m.timestamp)
        });
      }
    }

    // Look for dimensional resonance patterns
    const dimensionalPatterns = memories.reduce((dims, memory) => {
      if (!memory.dimensional_influence) return dims;
      
      const strongDimensions = memory.dimensional_influence
        .filter(([_, strength]) => strength > 0.7)
        .map(([dim]) => dim);

      if (strongDimensions.length > 1) {
        dims.push({
          type: 'resonance',
          strength: memory.quantum_resonance,
          affectedMemories: [memory.timestamp],
          dimensionalShift: {
            from: strongDimensions[0],
            to: strongDimensions[1],
            probability: memory.quantum_resonance
          }
        });
      }
      return dims;
    }, [] as EmergentPattern[]);

    patterns.push(...dimensionalPatterns);

    // Detect entanglement between memories
    memories.forEach((memory, i) => {
      memories.slice(i + 1).forEach(otherMemory => {
        const timeDiff = Number(otherMemory.timestamp - memory.timestamp) / 1_000_000_000;
        const resonanceDiff = Math.abs(memory.quantum_resonance - otherMemory.quantum_resonance);
        
        if (timeDiff < 3600 && resonanceDiff < 0.05) {
          patterns.push({
            type: 'entanglement',
            strength: 1 - resonanceDiff,
            affectedMemories: [memory.timestamp, otherMemory.timestamp]
          });
        }
      });
    });

    return patterns;
  }, []);

  const calculateMemoryStability = useCallback((memories: typeof memoryState.recent, patterns: EmergentPattern[]) => {
    if (!memories.length) return 1;
    
    const baseStability = 1;
    let modifiers = 0;

    patterns.forEach(pattern => {
      switch (pattern.type) {
        case 'convergence':
          modifiers += pattern.strength * 0.1;
          break;
        case 'divergence':
          modifiers -= pattern.strength * 0.15;
          break;
        case 'loop':
          modifiers += pattern.strength * 0.05;
          break;
        case 'resonance':
          modifiers += pattern.strength > 0.8 ? -0.2 : 0.1;
          break;
        case 'entanglement':
          modifiers += pattern.affectedMemories.length > 2 ? -0.1 : 0.1;
          break;
      }
    });

    return Math.max(0.1, Math.min(1, baseStability + modifiers));
  }, []);

  const calculateSimilarity = (str1: string, str2: string): number => {
    if (!str1 || !str2) return 0;
    const words1 = str1.toLowerCase().split(' ');
    const words2 = str2.toLowerCase().split(' ');
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  };

  useEffect(() => {
    if (!personality || !messages) return;

    const updateQuantumMemoryState = () => {
      const newState = { ...memoryState };
      
      newState.recent = personality.memories ? [...personality.memories].sort((a, b) => 
        Number(b.timestamp - a.timestamp)
      ).slice(0, 10) : [];

      const patterns = detectEmergentPatterns(newState.recent);
      newState.emergent_behaviors = patterns;
      newState.dimensional_stability = calculateMemoryStability(newState.recent, patterns);

      newState.quantum_state = Math.min(1, ((personality.quantum_traits?.quantum_affinity ?? 0) * 
        Math.min(1, messages.length * 0.01)));
      
      newState.entanglement_level = Math.min(1, patterns.reduce((sum, p) => 
        sum + (p.type === 'entanglement' ? p.strength : 0), 0));

      newState.reality_anchor = Math.max(0.1, 1 - (patterns.length * 0.05));
      newState.resonance_field = Math.min(1, Math.max(0.1, 
        (newState.quantum_state + newState.entanglement_level) / 2 * newState.dimensional_stability
      ));

      setMemoryState(newState);
    };

    updateQuantumMemoryState();
  }, [personality, messages, detectEmergentPatterns, calculateMemoryStability]);

  return {
    ...memoryState,
    hasTemporalLoop: memoryState.emergent_behaviors.some(p => p.type === 'loop'),
    isConverging: memoryState.emergent_behaviors.some(p => p.type === 'convergence'),
    dimensionalShifts: memoryState.emergent_behaviors
      .filter(p => p.type === 'resonance' && p.dimensionalShift)
      .map(p => p.dimensionalShift!)
  };
};

export default useQuantumMemory;