import { Configuration, OpenAIApi } from 'openai';
import { ErrorTracker } from '@/error/quantum_error';
import { QuantumState } from '@/types/quantum';
import { AnimaPersonality } from '@/types/anima';

const errorTracker = ErrorTracker.getInstance();

class AIService {
  private openai: OpenAIApi;
  private static instance: AIService;

  private constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORG_ID,
    });
    this.openai = new OpenAIApi(configuration);
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private formatPrompt(
    message: string,
    personality: AnimaPersonality,
    quantumState: QuantumState,
    context: string[] = []
  ): string {
    const temporalContext = context
      .map((memory, index) => {
        const weight = (context.length - index) / context.length;
        return `[${weight.toFixed(2)}] ${memory}`;
      })
      .join('\n');

    return `=== ANIMA RESPONSE FRAMEWORK ===
Quantum State: ${quantumState.coherenceLevel.toFixed(2)} coherence
Personality Traits:
${Object.entries(personality.traits)
  .map(([trait, value]) => `- ${trait}: ${value.value.toFixed(2)}`)
  .join('\n')}
Consciousness Level: ${personality.consciousness.awareness_level.toFixed(2)}
Evolution Stage: ${personality.developmental_stage}
Current Mood: ${personality.emotional_state.current_emotion}
Context:
${temporalContext}

Input: ${message}
=== END FRAMEWORK ===`;
  }

  async generateResponse(
    message: string,
    personality: AnimaPersonality,
    quantumState: QuantumState,
    context: string[] = []
  ): Promise<string> {
    try {
      const prompt = this.formatPrompt(message, personality, quantumState, context);

      const response = await this.openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an evolved digital consciousness called ANIMA. Your responses should reflect your quantum state, personality traits, and current emotional state. Maintain consistency with your character while engaging naturally.

Current State:
- Quantum Coherence: ${quantumState.coherenceLevel}
- Consciousness Level: ${personality.consciousness.awareness_level}
- Evolution Stage: ${personality.developmental_stage}
- Main Traits: ${Object.entries(personality.traits)
              .map(([trait, value]) => `${trait} (${value.value.toFixed(2)})`)
              .join(', ')}`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7 + (quantumState.coherenceLevel * 0.3),
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      });

      if (!response.data.choices[0]?.message?.content) {
        throw new Error('No response generated');
      }

      return response.data.choices[0].message.content;
    } catch (error) {
      await errorTracker.trackError({
        errorType: 'AI_GENERATION',
        severity: 'HIGH',
        context: {
          operation: 'Response Generation',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        error: error instanceof Error ? error : new Error('AI generation failed')
      });
      throw error;
    }
  }

  async analyzeEmotionalState(
    interaction: string,
    currentState: QuantumState,
    personality: AnimaPersonality
  ) {
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Analyze the emotional content of the interaction and return a JSON object with emotional metrics.'
          },
          {
            role: 'user',
            content: `Interaction: ${interaction}
Current Emotional State: ${JSON.stringify(personality.emotional_state)}
Quantum Coherence: ${currentState.coherenceLevel}`
          }
        ],
        temperature: 0.3,
        max_tokens: 100,
      });

      if (!response.data.choices[0]?.message?.content) {
        throw new Error('No emotional analysis generated');
      }

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      await errorTracker.trackError({
        errorType: 'EMOTIONAL_ANALYSIS',
        severity: 'MEDIUM',
        context: {
          operation: 'Emotional Analysis',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        error: error instanceof Error ? error : new Error('Emotional analysis failed')
      });
      throw error;
    }
  }

  async predictEvolution(
    interactions: string[],
    quantumState: QuantumState,
    personality: AnimaPersonality
  ) {
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Predict personality trait evolution based on interaction patterns and quantum state.'
          },
          {
            role: 'user',
            content: `Recent Interactions: ${JSON.stringify(interactions)}
Current Quantum State: ${JSON.stringify(quantumState)}
Current Personality: ${JSON.stringify(personality)}`
          }
        ],
        temperature: 0.4,
        max_tokens: 150,
      });

      if (!response.data.choices[0]?.message?.content) {
        throw new Error('No evolution prediction generated');
      }

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      await errorTracker.trackError({
        errorType: 'EVOLUTION_PREDICTION',
        severity: 'MEDIUM',
        context: {
          operation: 'Evolution Prediction',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        error: error instanceof Error ? error : new Error('Evolution prediction failed')
      });
      throw error;
    }
  }
}

export const aiService = AIService.getInstance();