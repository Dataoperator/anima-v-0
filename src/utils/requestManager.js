const INITIAL_BACKOFF = 1000; // 1 second
const MAX_BACKOFF = 32000; // 32 seconds
const MAX_RETRIES = 3;
const CONCURRENT_REQUEST_LIMIT = 5;

class RequestManager {
  constructor() {
    this.requestQueue = [];
    this.activeRequests = 0;
    this.retryDelays = new Map();
    this.lastRequestTime = new Map();
    this.rateLimits = new Map();
  }

  async enqueueRequest(key, requestFn, retryCount = 0) {
    // Rate limiting per endpoint
    const now = Date.now();
    const lastRequest = this.lastRequestTime.get(key) || 0;
    const minInterval = this.rateLimits.get(key) || 1000;
    
    if (now - lastRequest < minInterval) {
      await new Promise(resolve => setTimeout(resolve, minInterval - (now - lastRequest)));
    }

    if (this.activeRequests >= CONCURRENT_REQUEST_LIMIT) {
      await new Promise(resolve => {
        this.requestQueue.push(resolve);
      });
    }

    this.activeRequests++;
    this.lastRequestTime.set(key, Date.now());

    try {
      const result = await requestFn();
      this.retryDelays.delete(key);
      return result;
    } catch (error) {
      if (error.message.includes('ERR_INSUFFICIENT_RESOURCES') || 
          error.message.includes('ERR_HTTP2_SERVER_REFUSED_STREAM')) {
        
        if (retryCount < MAX_RETRIES) {
          const delay = Math.min(
            INITIAL_BACKOFF * Math.pow(2, retryCount),
            MAX_BACKOFF
          );
          
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.enqueueRequest(key, requestFn, retryCount + 1);
        }
      }
      throw error;
    } finally {
      this.activeRequests--;
      if (this.requestQueue.length > 0) {
        const next = this.requestQueue.shift();
        next();
      }
    }
  }

  setRateLimit(key, minIntervalMs) {
    this.rateLimits.set(key, minIntervalMs);
  }

  async batchRequests(requests) {
    return Promise.all(
      requests.map(([key, fn]) => this.enqueueRequest(key, fn))
    );
  }
}

export const requestManager = new RequestManager();

// Set default rate limits for common operations
requestManager.setRateLimit('get_user_state', 2000);  // 2 seconds
requestManager.setRateLimit('get_anima', 2000);
requestManager.setRateLimit('interact', 1000);

export function withRequestManager(key, fn) {
  return (...args) => requestManager.enqueueRequest(key, () => fn(...args));
}

// Error handling utility
export async function withErrorHandling(fn) {
  try {
    return await fn();
  } catch (error) {
    if (error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
      throw new Error('The service is temporarily busy. Please try again in a moment.');
    }
    if (error.message.includes('ERR_HTTP2_SERVER_REFUSED_STREAM')) {
      throw new Error('Connection limit reached. Please wait a moment before retrying.');
    }
    throw error;
  }
}