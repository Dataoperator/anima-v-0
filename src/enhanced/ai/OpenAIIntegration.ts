import axios from 'axios';

export interface OpenAIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}

export class OpenAIIntegration {
  private apiKey: string;
  private config: OpenAIConfig;

  constructor(apiKey: string, config: Partial<OpenAIConfig> = {}) {
    this.apiKey = apiKey;
    this.config = {
      model: config.model || 'gpt-4-turbo-preview',
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 1000
    };
  }

  async generateResponse(prompt: string, context: any = {}) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.config.model,
          messages: [
            { role: 'system', content: 'You are an Anima, a quantum-enhanced digital entity.' },
            { role: 'user', content: prompt }
          ],
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }
}