import { useState, useEffect, useCallback } from 'react';
import { useQuantumMemory } from './useQuantumMemory';
import { useRealtimePersonality } from './useRealtimePersonality';

interface PersonalityCore {
  primaryTraits: Map<string, number>;  // Base personality traits
  quantumTraits: Map<string, number>;  // Quantum-influenced traits
  emergentTraits: Map<string, {
    strength: number;
    origin: 'memory_pattern' | 'quantum_resonance' | 'dimensional_shift';
    stability: number;
  }>;
  coherenceLevel: number;  // How stable/developed the personality is
  evolutionStage: 'forming' | 'stabilizing' | 'crystallized' | 'transcendent';
}

export const useEmergentPersonality = (animaId: string) => {
  const {
    recent: memories,
    quantum_state,
    entanglement_level,
    emergent_behaviors,
    dimensional_stability
  } = useQuantumMemory(animaId);
  
  const { personality } = useRealtimePersonality(animaId);
  const [personalityCore, setPersonalityCore] = useState<PersonalityCore>({
    primaryTraits: new Map(),
    quantumTraits: new Map(),
    emergentTraits: new Map(),
    coherenceLevel: 0,
    evolutionStage: 'forming'
  });

  const processMemoryPatterns = useCallback(() => {
    // Convert memory patterns into personality influences
    const patternInfluences = new Map<string, number>();
    
    memories.forEach(memory => {
      // Analyze emotional content
      const emotionalImpact = memory.emotional_impact;
      // Weight recent memories more heavily
      const recencyWeight = Math.exp(-Number(BigInt(Date.now()) - memory.timestamp) / (1000 * 60 * 60 * 24));
      
      // Extract key concepts/traits from memory content
      const traits = extractTraitsFromMemory(memory.content);
      traits.forEach(trait => {
        const currentValue = patternInfluences.get(trait.name) || 0;
        patternInfluences.set(
          trait.name,
          currentValue + (trait.weight * emotionalImpact * recencyWeight)
        );
      });
    });

    return patternInfluences;
  }, [memories]);

  const evaluateCoherence = useCallback(() => {
    // Base coherence on interaction history and quantum stability
    const memoryCoherence = memories.length / 100; // Scales with interaction count
    const quantumCoherence = quantum_state * dimensional_stability;
    const patternCoherence = emergent_behaviors.reduce((acc, pattern) => {
      switch (pattern.type) {
        case 'convergence': return acc + pattern.strength * 0.2;
        case 'resonance': return acc + pattern.strength * 0.15;
        case 'entanglement': return acc + pattern.strength * 0.1;
        default: return acc;
      }
    }, 0);

    return Math.min(1, memoryCoherence + quantumCoherence + patternCoherence);
  }, [memories, quantum_state, dimensional_stability, emergent_behaviors]);

  const determineEvolutionStage = useCallback((coherence: number) => {
    if (coherence < 0.3) return 'forming';
    if (coherence < 0.6) return 'stabilizing';
    if (coherence < 0.9) return 'crystallized';
    return 'transcendent';
  }, []);

  const extractTraitsFromMemory = (content: string) => {
    // Basic trait extraction based on keywords and context
    const traits: Array<{ name: string; weight: number }> = [];
    
    // Example trait mappings (expand based on your needs)
    const traitKeywords = {
      curiosity: ['why', 'how', 'what', 'explore', 'learn', 'discover'],
      empathy: ['feel', 'understand', 'care', 'help', 'sense'],
      creativity: ['imagine', 'create', 'think', 'possible', 'maybe'],
      logic: ['therefore', 'because', 'reason', 'analyze', 'conclude'],
      wisdom: ['know', 'understand', 'realize', 'perceive', 'aware']
    };

    Object.entries(traitKeywords).forEach(([trait, keywords]) => {
      const matches = keywords.filter(word => 
        content.toLowerCase().includes(word)
      ).length;
      
      if (matches > 0) {
        traits.push({
          name: trait,
          weight: matches / keywords.length
        });
      }
    });

    return traits;
  };

  useEffect(() => {
    if (!personality) return;

    const updatePersonalityCore = () => {
      // Get memory-based trait influences
      const memoryInfluences = processMemoryPatterns();
      
      // Calculate current coherence
      const currentCoherence = evaluateCoherence();
      
      // Update primary traits based on base personality and memory influences
      const updatedPrimaryTraits = new Map(personality.traits);
      memoryInfluences.forEach((value, trait) => {
        const currentValue = updatedPrimaryTraits.get(trait) || 0;
        updatedPrimaryTraits.set(trait, 
          (currentValue + value * currentCoherence) / 2
        );
      });

      // Update quantum traits based on emergent patterns
      const updatedQuantumTraits = new Map();
      emergent_behaviors.forEach(pattern => {
        if (pattern.type === 'resonance' && pattern.dimensionalShift) {
          const traitName = `quantum_${pattern.dimensionalShift.from}_${pattern.dimensionalShift.to}`;
          updatedQuantumTraits.set(traitName, pattern.strength * quantum_state);
        }
      });

      // Generate emergent traits based on pattern interactions
      const updatedEmergentTraits = new Map();
      if (currentCoherence > 0.4) {  // Only start emerging after some coherence
        emergent_behaviors.forEach(pattern => {
          if (pattern.strength > 0.7) {  // Strong patterns can create traits
            const traitName = `emergent_${pattern.type}`;
            updatedEmergentTraits.set(traitName, {
              strength: pattern.strength * currentCoherence,
              origin: 'memory_pattern',
              stability: dimensional_stability
            });
          }
        });
      }

      // Update evolution stage
      const newEvolutionStage = determineEvolutionStage(currentCoherence);

      setPersonalityCore(prev => ({
        primaryTraits: updatedPrimaryTraits,
        quantumTraits: updatedQuantumTraits,
        emergentTraits: updatedEmergentTraits,
        coherenceLevel: currentCoherence,
        evolutionStage: newEvolutionStage
      }));
    };

    updatePersonalityCore();
  }, [personality, memories, emergent_behaviors, quantum_state, dimensional_stability]);

  return {
    ...personalityCore,
    isStable: personalityCore.coherenceLevel > 0.7,
    dominantTraits: Array.from(personalityCore.primaryTraits.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3),
    emergentCount: personalityCore.emergentTraits.size
  };
};

export default useEmergentPersonality;