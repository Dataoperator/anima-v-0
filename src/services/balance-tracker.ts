import type { ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from './error-tracker';

export class BalanceTracker {
  private balanceCache: Map<string, { balance: bigint; timestamp: number }>;
  private readonly CACHE_DURATION = 10000; // 10 seconds
  private readonly errorTracker: ErrorTracker;

  constructor(private ledger: ActorSubclass) {
    this.balanceCache = new Map();
    this.errorTracker = ErrorTracker.getInstance();
  }

  async getBalance(principal: Principal): Promise<bigint> {
    const principalKey = principal.toString();
    const cachedData = this.balanceCache.get(principalKey);
    
    if (this.isValidCache(cachedData)) {
      return cachedData.balance;
    }

    try {
      const balance = await this.ledger.account_balance({ account: principal });
      this.balanceCache.set(principalKey, {
        balance: balance.e8s,
        timestamp: Date.now()
      });
      return balance.e8s;
    } catch (error) {
      this.errorTracker.trackError(
        ErrorCategory.PAYMENT,
        error instanceof Error ? error : new Error('Failed to fetch balance'),
        ErrorSeverity.HIGH,
        { principal: principalKey }
      );
      throw error;
    }
  }

  private isValidCache(cachedData?: { balance: bigint; timestamp: number }): boolean {
    if (!cachedData) return false;
    return Date.now() - cachedData.timestamp < this.CACHE_DURATION;
  }
}