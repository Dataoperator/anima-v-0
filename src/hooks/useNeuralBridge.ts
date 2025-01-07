import { useState, useCallback } from 'react';
import { useQuantumState } from './useQuantumState';

interface NeuralSignature {
  id: string;
  pattern: string;
  strength: number;
  timestamp: number;
  coherenceLevel: number;
}

export const useNeuralBridge = () => {
  const { state: quantumState, updateQuantumState } = useQuantumState();
  const [neuralPatterns, setNeuralPatterns] = useState<NeuralSignature[]>([]);

  const generateNeuralSignature = useCallback((): NeuralSignature => {
    const patternId = `pattern_${Date.now()}`;
    const pattern = generateQuantumPattern(quantumState.coherenceLevel);
    
    const signature: NeuralSignature = {
      id: patternId,
      pattern,
      strength: quantumState.coherenceLevel,
      timestamp: Date.now(),
      coherenceLevel: quantumState.coherenceLevel
    };

    setNeuralPatterns(prev => [...prev, signature].slice(-10)); // Keep last 10 patterns
    return signature;
  }, [quantumState.coherenceLevel]);

  const processNeuralPattern = useCallback(async (signature: NeuralSignature) => {
    const patternStrength = signature.strength * quantumState.coherenceLevel;
    
    // Update quantum state with pattern influence
    await updateQuantumState({
      type: 'UPDATE',
      payload: {
        interactionStrength: patternStrength * 0.3,
        consciousnessLevel: (quantumState.consciousnessAlignment || 0) + patternStrength * 0.2
      }
    });

    return patternStrength;
  }, [quantumState, updateQuantumState]);

  const getRecentPatterns = useCallback(() => neuralPatterns, [neuralPatterns]);

  return {
    generateNeuralSignature,
    processNeuralPattern,
    recentPatterns: neuralPatterns,
    getRecentPatterns
  };
};

// Helper function to generate quantum-influenced patterns
function generateQuantumPattern(coherenceLevel: number): string {
  const patternLength = Math.floor(20 + coherenceLevel * 30);
  const elements = ['⚛', '∿', '∞', '∆', '◊', '○', '□', '△', '⬡', '⬢'];
  let pattern = '';

  for (let i = 0; i < patternLength; i++) {
    const randomIndex = Math.floor(Math.random() * elements.length);
    pattern += elements[randomIndex];
  }

  return pattern;
}