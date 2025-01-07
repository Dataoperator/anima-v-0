import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { NeuralSignature } from '../neural/types';
import { neuralNetworkService } from '../services/neural-network.service';
import { useQuantumState } from './useQuantumState';

export const useNeuralNetwork = () => {
  const { identity } = useAuth();
  const { state: quantumState } = useQuantumState();
  const [patterns, setPatterns] = useState<NeuralSignature[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!identity) return;

    neuralNetworkService.setPatternCallback(setPatterns);

    const generateInitialPattern = async () => {
      try {
        setIsProcessing(true);
        await neuralNetworkService.generateNeuralSignature(identity);
      } catch (err) {
        console.error('Failed to generate initial neural pattern:', err);
        setError(err as Error);
      } finally {
        setIsProcessing(false);
      }
    };

    generateInitialPattern();

    return () => {
      neuralNetworkService.dispose();
    };
  }, [identity]);

  // Auto-evolve based on quantum state
  useEffect(() => {
    if (!identity || !quantumState || isProcessing) return;

    const checkEvolution = async () => {
      const coherenceThreshold = 0.7;
      const patternThreshold = 5;

      if (quantumState.coherenceLevel >= coherenceThreshold && 
          patterns.length >= patternThreshold) {
        try {
          setIsProcessing(true);
          await neuralNetworkService.evolveNeuralNetwork(identity);
        } catch (err) {
          console.error('Neural network evolution failed:', err);
          setError(err as Error);
        } finally {
          setIsProcessing(false);
        }
      }
    };

    const intervalId = setInterval(checkEvolution, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [identity, quantumState, patterns.length, isProcessing]);

  const generatePattern = useCallback(async () => {
    if (!identity) return;

    try {
      setIsProcessing(true);
      const pattern = await neuralNetworkService.generateNeuralSignature(identity);
      return pattern;
    } catch (err) {
      console.error('Failed to generate neural pattern:', err);
      setError(err as Error);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [identity]);

  const processPattern = useCallback(async (pattern: NeuralSignature) => {
    if (!identity) return;

    try {
      setIsProcessing(true);
      const strength = await neuralNetworkService.processPattern(identity, pattern);
      return strength;
    } catch (err) {
      console.error('Failed to process neural pattern:', err);
      setError(err as Error);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [identity]);

  const evolveNetwork = useCallback(async () => {
    if (!identity) return;

    try {
      setIsProcessing(true);
      await neuralNetworkService.evolveNeuralNetwork(identity);
    } catch (err) {
      console.error('Failed to evolve neural network:', err);
      setError(err as Error);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [identity]);

  return {
    patterns,
    isProcessing,
    error,
    generatePattern,
    processPattern,
    evolveNetwork,
    getPatternHistory: useCallback(() => neuralNetworkService.getPatternHistory(), [])
  };
};