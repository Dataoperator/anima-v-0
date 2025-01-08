interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface EmotionAnalysis {
  primaryEmotion: string;
  intensity: number;
  quantumResonance: number;
}

class OpenAIService {
  private static instance: OpenAIService;
  private apiEndpoint: string;

  private constructor() {
    this.apiEndpoint = process.env.VITE_API_ENDPOINT || 'https://api.ic0.app';
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  async generateResponse(messages: Message[], temperature: number = 0.7): Promise<string | null> {
    try {
      const response = await fetch(`${this.apiEndpoint}/anima/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          temperature,
          maxTokens: 150,
          presencePenalty: 0.6,
          frequencyPenalty: 0.5
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.result || null;
    } catch (error) {
      console.error('AI Generation Error:', error);
      throw error;
    }
  }

  async analyzeEmotion(content: string): Promise<EmotionAnalysis | null> {
    try {
      const response = await fetch(`${this.apiEndpoint}/anima/analyze-emotion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.analysis || null;
    } catch (error) {
      console.error('Emotion Analysis Error:', error);
      throw error;
    }
  }
}

export default OpenAIService.getInstance();