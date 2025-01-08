import { Configuration, OpenAIApi } from 'openai';

class OpenAIService {
  private static instance: OpenAIService;
  private openai: OpenAIApi;

  private constructor() {
    const configuration = new Configuration({
      apiKey: process.env.VITE_OPENAI_API_KEY
    });
    this.openai = new OpenAIApi(configuration);
  }

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  async generateResponse(messages: Array<{role: 'system' | 'user' | 'assistant', content: string}>, 
                        temperature: number = 0.7) {
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-4',
        messages,
        temperature,
        max_tokens: 150,
        presence_penalty: 0.6,
        frequency_penalty: 0.5
      });

      return response.data.choices[0]?.message?.content || null;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  async analyzeEmotion(content: string) {
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Analyze the emotional content of this message and return a JSON object with primary emotion, intensity (0-1), and quantum resonance (0-1)'
          },
          {
            role: 'user',
            content
          }
        ],
        temperature: 0.3
      });

      const result = response.data.choices[0]?.message?.content;
      return result ? JSON.parse(result) : null;
    } catch (error) {
      console.error('Emotion Analysis Error:', error);
      throw error;
    }
  }
}

export default OpenAIService.getInstance();