import { OpenAIService, aiEventBus } from '@/services/openai';
import { ENV } from '@/config/env';
import type { NFTPersonality, Memory } from '@/declarations/anima/anima.did';

describe('OpenAIService', () => {
  let openAIService: ReturnType<typeof OpenAIService.getInstance>;
  const mockUserId = 'test-user-id';
  
  const mockPersonality: NFTPersonality = {
    traits: {
      curiosity: 0.8,
      empathy: 0.7,
      creativity: 0.9
    }
  };

  const mockMemories: Memory[] = [
    { content: 'First interaction with user', timestamp: BigInt(Date.now()), importance: 0.8 },
    { content: 'Learned about quantum mechanics', timestamp: BigInt(Date.now()), importance: 0.9 }
  ];

  beforeEach(() => {
    openAIService = OpenAIService.getInstance();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Rate Limiting', () => {
    it('should respect user rate limits', async () => {
      const promises = Array(ENV.USER_RATE_LIMIT_REQUESTS + 1)
        .fill(null)
        .map(() => openAIService.generateResponse('test', mockPersonality, mockUserId));

      await expect(Promise.all(promises)).rejects.toThrow('User rate limit exceeded');
    });

    it('should respect global rate limits', async () => {
      const promises = Array(ENV.RATE_LIMIT_REQUESTS + 1)
        .fill(null)
        .map((_, i) => openAIService.generateResponse('test', mockPersonality, `user-${i}`));

      await expect(Promise.all(promises)).rejects.toThrow('Global rate limit exceeded');
    });
  });

  describe('Vision API', () => {
    it('should handle avatar visual input', async () => {
      const mockResponse = {
        choices: [{
          message: { content: 'I see a digital avatar with glowing elements.' },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 50, completion_tokens: 80, total_tokens: 130 }
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await openAIService.processVisualInput(
        'https://example.com/avatar.png',
        mockPersonality,
        mockUserId
      );

      expect(result.content).toBe('I see a digital avatar with glowing elements.');
      expect(result.confidence).toBeGreaterThan(0.5);
    });
  });

  describe('Emotional Analysis', () => {
    it('should analyze emotional content', async () => {
      const mockResponse = {
        choices: [{
          message: { content: '{"valence": 0.8, "arousal": 0.6, "dominance": 0.7}' },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 40, completion_tokens: 20, total_tokens: 60 }
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await openAIService.analyzeEmotion(
        'I feel excited about learning quantum mechanics!',
        mockPersonality,
        mockUserId
      );

      expect(result.valence).toBe(0.8);
      expect(result.arousal).toBe(0.6);
      expect(result.dominance).toBe(0.7);
    });
  });

  describe('Memory Importance', () => {
    it('should evaluate memory importance', async () => {
      const mockResponse = {
        choices: [{
          message: { content: '0.85' },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 30, completion_tokens: 10, total_tokens: 40 }
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await openAIService.evaluateMemoryImportance(
        mockMemories[0],
        mockPersonality,
        mockUserId
      );

      expect(result).toBe(0.85);
    });
  });

  describe('Error Recovery', () => {
    it('should retry on recoverable errors', async () => {
      const mockError = { error: { message: 'model_overloaded' } };
      const mockSuccess = {
        choices: [{ message: { content: 'Success!' }, finish_reason: 'stop' }],
        usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 }
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: false, json: () => Promise.resolve(mockError) })
        .mockResolvedValueOnce({ ok: false, json: () => Promise.resolve(mockError) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockSuccess) });

      const result = await openAIService.generateResponse('test', mockPersonality, mockUserId);
      expect(result.content).toBe('Success!');
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should not retry on non-recoverable errors', async () => {
      const mockError = { error: { message: 'invalid_api_key' } };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve(mockError)
      });

      await expect(
        openAIService.generateResponse('test', mockPersonality, mockUserId)
      ).rejects.toThrow();
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Response Validation', () => {
    it('should validate and enhance responses', async () => {
      const mockResponse = {
        choices: [{
          message: { content: 'I feel energized and ready to explore quantum realms!' },
          finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 50, completion_tokens: 70, total_tokens: 120 }
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await openAIService.generateResponse(
        'Tell me about your current state',
        mockPersonality,
        mockUserId
      );

      expect(result.content).toBeTruthy();
      expect(result.emotionalState).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.tokenUsage).toBeDefined();
    });
  });

  describe('Event Logging', () => {
    it('should log important events', async () => {
      const logSpy = jest.fn();
      aiEventBus.addListener(logSpy);

      const mockResponse = {
        choices: [{ message: { content: 'Test' }, finish_reason: 'stop' }],
        usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 }
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      await openAIService.generateResponse('test', mockPersonality, mockUserId);
      expect(logSpy).toHaveBeenCalled();
      aiEventBus.removeListener(logSpy);
    });
  });
});