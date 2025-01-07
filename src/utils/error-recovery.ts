import { aiEventBus } from '@/services/openai';

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

export interface RetryState {
  attempt: number;
  lastError: Error | null;
  startTime: number;
}

export class ErrorRecoveryManager {
  private static readonly DEFAULT_CONFIG: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2
  };

  private static readonly RECOVERABLE_ERRORS = new Set([
    'rate_limit_exceeded',
    'model_overloaded',
    'context_length_exceeded',
    'internal_server_error',
    'service_unavailable',
    'gateway_timeout',
    'connection_error',
    'network_error',
    'timeout'
  ]);

  private config: RetryConfig;
  private state: RetryState;

  constructor(config: Partial<RetryConfig> = {}) {
    this.config = { ...ErrorRecoveryManager.DEFAULT_CONFIG, ...config };
    this.state = {
      attempt: 0,
      lastError: null,
      startTime: Date.now()
    };
  }

  public async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string = 'operation'
  ): Promise<T> {
    while (this.state.attempt < this.config.maxAttempts) {
      try {
        if (this.state.attempt > 0) {
          const delay = this.calculateDelay();
          aiEventBus.log(`Retrying ${context} (attempt ${this.state.attempt + 1}/${this.config.maxAttempts}) after ${delay}ms`);
          await this.delay(delay);
        }

        const result = await operation();
        if (this.state.attempt > 0) {
          aiEventBus.log(`Successfully recovered ${context} after ${this.state.attempt} retries`);
        }
        return result;

      } catch (error) {
        this.state.lastError = error instanceof Error ? error : new Error(String(error));
        this.state.attempt++;

        if (!this.isRecoverable(this.state.lastError) || this.state.attempt >= this.config.maxAttempts) {
          aiEventBus.log(`Failed to recover ${context} after ${this.state.attempt} attempts: ${this.state.lastError.message}`);
          throw this.state.lastError;
        }
      }
    }

    throw this.state.lastError || new Error('Maximum retry attempts reached');
  }

  private calculateDelay(): number {
    const exponentialDelay = this.config.baseDelay * Math.pow(this.config.backoffFactor, this.state.attempt - 1);
    const jitter = Math.random() * 1000;
    return Math.min(exponentialDelay + jitter, this.config.maxDelay);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private isRecoverable(error: Error): boolean {
    return ErrorRecoveryManager.RECOVERABLE_ERRORS.has(this.getErrorType(error));
  }

  private getErrorType(error: Error): string {
    const message = error.message.toLowerCase();
    return ErrorRecoveryManager.RECOVERABLE_ERRORS.values()
      .find(type => message.includes(type.toLowerCase())) || 'unknown';
  }

  public getRetryStats(): {
    attempts: number;
    totalTime: number;
    lastError: string | null;
    canRetry: boolean;
  } {
    return {
      attempts: this.state.attempt,
      totalTime: Date.now() - this.state.startTime,
      lastError: this.state.lastError?.message || null,
      canRetry: this.state.attempt < this.config.maxAttempts
    };
  }

  public reset(): void {
    this.state = {
      attempt: 0,
      lastError: null,
      startTime: Date.now()
    };
  }
}

export const createErrorRecoveryManager = (config?: Partial<RetryConfig>) => 
  new ErrorRecoveryManager(config);