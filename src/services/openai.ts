import { ENV } from '@/config/env';
import type { NFTPersonality, Memory } from '@/declarations/anima/anima.did';
import { Message, ValidatedResponse } from '@/types';
import { aiEventBus } from '@/events/ai-event-bus';
import { RateLimiter } from '@/utils/RateLimiter';
import { quantumPromptService } from './prompts/quantum-prompts';
import type { QuantumState } from '@/quantum/types';

export class OpenAIService {
  private static instance: OpenAIService;
  private globalRateLimiter: RateLimiter;
  private userRateLimiter: RateLimiter;

  private constructor() {
    this.globalRateLimiter = new RateLimiter(ENV.OPENAI_RATE_LIMIT_GLOBAL, ENV.OPENAI_RATE_WINDOW);
    this.userRateLimiter = new RateLimiter(ENV.OPENAI_RATE_LIMIT_USER, ENV.OPENAI_RATE_WINDOW);
  }

  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  private async makeRequest(
    messages: Message[],
    userId: string,
    model: string = ENV.OPENAI_MODEL
  ): Promise<any> {
    if (!ENV.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    await this.globalRateLimiter.throttle('global');
    await this.userRateLimiter.throttle(userId);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ENV.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: ENV.OPENAI_MAX_TOKENS,
        top_p: 1,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    return response.json();
  }

  private validateResponse(response: any): ValidatedResponse {
    if (!response.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    const content = response.choices[0].message.content.trim();
    return {
      content,
      model: response.model,
      usage: response.usage,
      created: response.created
    };
  }

  async generateResponse(
    input: string,
    personality: NFTPersonality,
    context: {
      recentMemories?: Memory[];
      emotionalState?: string;
      quantumState?: Partial<QuantumState>;
    },
    userId: string
  ): Promise<ValidatedResponse> {
    aiEventBus.log('Generating quantum-enhanced response');
    const prompt = quantumPromptService.buildQuantumResponsePrompt(
      personality,
      input,
      context
    );

    const messages: Message[] = [
      { role: 'system', content: prompt },
      { role: 'user', content: input }
    ];

    const response = await this.makeRequest(messages, userId);
    return this.validateResponse(response);
  }

  async analyzeEmotion(
    text: string,
    personality: NFTPersonality,
    userId: string,
    currentState?: any
  ): Promise<EmotionalState> {
    aiEventBus.log('Analyzing emotional content');
    const prompt = quantumPromptService.buildEmotionalAnalysisPrompt(
      personality,
      text,
      currentState
    );

    const messages: Message[] = [
      { role: 'system', content: prompt },
      { role: 'user', content: text }
    ];

    const response = await this.makeRequest(messages, userId);
    try {
      const analysis = JSON.parse(response.choices[0].message.content);
      return {
        valence: analysis.valence,
        arousal: analysis.arousal,
        dominance: analysis.dominance,
        quantum_resonance: analysis.quantum_resonance,
        emotional_spectrum: analysis.emotional_spectrum
      };
    } catch (error) {
      aiEventBus.error('Failed to parse emotional analysis', error as Error);
      throw new Error('Failed to parse emotional analysis');
    }
  }

  async evaluateMemoryImportance(
    memory: Memory,
    personality: NFTPersonality,
    quantumState: Partial<QuantumState>,
    userId: string
  ): Promise<number> {
    aiEventBus.log('Evaluating memory importance');
    const prompt = quantumPromptService.buildMemoryImportancePrompt(
      personality,
      memory,
      quantumState
    );

    const messages: Message[] = [
      { role: 'system', content: prompt },
      { role: 'user', content: memory.content }
    ];

    const response = await this.makeRequest(messages, userId);
    try {
      const importance = parseFloat(response.choices[0].message.content);
      return Math.max(0, Math.min(1, importance));
    } catch (error) {
      aiEventBus.error('Failed to parse memory importance', error as Error);
      throw new Error('Failed to evaluate memory importance');
    }
  }

  async processVisualInput(
    imageUrl: string,
    personality: NFTPersonality,
    quantumState: Partial<QuantumState>,
    userId: string
  ): Promise<ValidatedResponse> {
    aiEventBus.log('Processing visual input');
    const prompt = quantumPromptService.buildVisualAnalysisPrompt(
      personality,
      imageUrl,
      quantumState
    );

    const messages: Message[] = [
      { role: 'system', content: prompt },
      {
        role: 'user',
        content: {
          type: 'image_url',
          image_url: imageUrl
        }
      }
    ];

    const response = await this.makeRequest(messages, userId, ENV.OPENAI_VISION_MODEL);
    return this.validateResponse(response);
  }

  getRateLimitStatus(userId: string): {
    global: { current: number; remaining: number; reset: number };
    user: { current: number; remaining: number; reset: number };
  } {
    return {
      global: {
        current: this.globalRateLimiter.getRemainingRequests('global'),
        remaining: ENV.OPENAI_RATE_LIMIT_GLOBAL - this.globalRateLimiter.getRemainingRequests('global'),
        reset: Date.now() + ENV.OPENAI_RATE_WINDOW
      },
      user: {
        current: this.userRateLimiter.getRemainingRequests(userId),
        remaining: ENV.OPENAI_RATE_LIMIT_USER - this.userRateLimiter.getRemainingRequests(userId),
        reset: Date.now() + ENV.OPENAI_RATE_WINDOW
      }
    };
  }

  getStatus(): {
    isConfigured: boolean;
    models: {
      chat: string;
      vision: string;
    };
    rateLimit: {
      global: { current: number; remaining: number; reset: number };
      user: { current: number; remaining: number; reset: number };
    };
  } {
    return {
      isConfigured: !!ENV.OPENAI_API_KEY,
      models: {
        chat: ENV.OPENAI_MODEL,
        vision: ENV.OPENAI_VISION_MODEL
      },
      rateLimit: this.getRateLimitStatus('system')
    };
  }
}

export const openAIService = OpenAIService.getInstance();