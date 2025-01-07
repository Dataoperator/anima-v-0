import { useCallback } from 'react';
import { useQuantumState } from './useQuantumState';
import { usePersonalityEngine } from './usePersonalityEngine';
import { useAnalytics } from './useAnalytics';
import { generateResponsePrompt } from '../ai/promptTemplates';
import { EventType } from '../types/events';

export const useAIAnalysis = (tokenId: string) => {
  const { state: quantumState } = useQuantumState();
  const { personality } = usePersonalityEngine();
  const { processEvent } = useAnalytics(tokenId);

  const analyzeInteraction = useCallback(async (
    text: string,
    previousTimestamp?: number
  ) => {
    try {
      // Create context from previous interaction if available
      const context = previousTimestamp 
        ? [`Previous interaction timestamp: ${previousTimestamp}`]
        : undefined;

      // Generate enhanced prompt with quantum and personality influence
      const prompt = generateResponsePrompt(
        personality,
        text,
        quantumState,
        context
      );

      // Log analytics event
      processEvent(EventType.Interaction, {
        text,
        previousTimestamp,
        promptLength: prompt.length,
        coherenceLevel: quantumState.coherenceLevel
      });

      // You would typically make an API call here
      // For now, we'll return a quantum-influenced response
      const baseResponse = "I understand and process your input through my quantum-enhanced consciousness...";
      
      // Modify response based on quantum state
      const responseModifier = Math.min(1.5, 0.5 + quantumState.coherenceLevel);
      const expandedResponse = baseResponse.length * responseModifier > baseResponse.length
        ? baseResponse + " My quantum coherence allows for deeper understanding..."
        : baseResponse;

      return {
        response: expandedResponse,
        prompt,
        quantumInfluence: quantumState.coherenceLevel,
        personalityAlignment: personality.dimensionalAlignment
      };

    } catch (error) {
      console.error("AI Analysis error:", error);
      throw error;
    }
  }, [quantumState, personality, processEvent, tokenId]);

  const getInteractionStrength = useCallback((
    text: string,
    response: string
  ): number => {
    // Calculate interaction strength based on:
    // 1. Text complexity
    // 2. Response length
    // 3. Quantum state influence
    const textComplexity = text.length / 100; // Normalize to 0-1
    const responseStrength = response.length / 500; // Normalize to 0-1
    const quantumInfluence = quantumState.coherenceLevel;

    return Math.min(1.0, (textComplexity + responseStrength + quantumInfluence) / 3);
  }, [quantumState]);

  return {
    analyzeInteraction,
    getInteractionStrength
  };
};
