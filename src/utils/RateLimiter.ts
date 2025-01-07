export class RateLimiter {
  private requests: Map<string, number[]>;
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs = 60000, maxRequests = 50) {
    this.requests = new Map();
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  async throttle(key: string): Promise<void> {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      const oldestRequest = validRequests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(time => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}