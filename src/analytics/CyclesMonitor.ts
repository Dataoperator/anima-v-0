import { Principal } from '@dfinity/principal';

export interface CyclesMetrics {
  balance: bigint;
  timestamp: Date;
  consumed: bigint;
  refunded: bigint;
  allocated: bigint;
  canisterId: Principal;
}

export interface CyclesProjection {
  currentBalance: bigint;
  burnRate: bigint;
  projectedDepletion: Date | null;
  recommendedTopUp: bigint;
  minimumRequired: bigint;
  safetyThreshold: bigint;
}

export interface CyclesUsagePattern {
  peakUsage: bigint;
  averageDaily: bigint;
  projectedMonthly: bigint;
  spikePeriods: { timestamp: Date; amount: bigint }[];
}

class CyclesMonitor {
  private metricsHistory: Map<string, CyclesMetrics[]> = new Map();
  private usagePatterns: Map<string, CyclesUsagePattern> = new Map();
  private static readonly MINIMUM_CYCLES = BigInt(100_000_000_000); // 100B cycles
  private static readonly SAFETY_MULTIPLIER = BigInt(3); // 3x minimum as safety buffer
  private static readonly DEPLETION_WARNING_DAYS = 7; // Warning when < 7 days of cycles left
  
  public async recordMetrics(metrics: CyclesMetrics): Promise<void> {
    const canisterId = metrics.canisterId.toText();
    const history = this.metricsHistory.get(canisterId) || [];
    
    history.push(metrics);
    if (history.length > 1000) history.shift(); // Keep last 1000 records
    
    this.metricsHistory.set(canisterId, history);
    await this.updateUsagePattern(canisterId);
  }

  public getProjection(canisterId: Principal): CyclesProjection {
    const history = this.metricsHistory.get(canisterId.toText()) || [];
    if (history.length < 2) {
      return {
        currentBalance: BigInt(0),
        burnRate: BigInt(0),
        projectedDepletion: null,
        recommendedTopUp: BigInt(0),
        minimumRequired: CyclesMonitor.MINIMUM_CYCLES,
        safetyThreshold: CyclesMonitor.MINIMUM_CYCLES * CyclesMonitor.SAFETY_MULTIPLIER
      };
    }

    const latest = history[history.length - 1];
    const burnRate = this.calculateBurnRate(history);
    
    const daysUntilDepletion = Number(latest.balance) / Number(burnRate);
    const projectedDepletion = new Date(
      Date.now() + daysUntilDepletion * 24 * 60 * 60 * 1000
    );

    const recommendedTopUp = this.calculateRecommendedTopUp(burnRate, latest.balance);

    return {
      currentBalance: latest.balance,
      burnRate,
      projectedDepletion: daysUntilDepletion > 0 ? projectedDepletion : null,
      recommendedTopUp,
      minimumRequired: CyclesMonitor.MINIMUM_CYCLES,
      safetyThreshold: CyclesMonitor.MINIMUM_CYCLES * CyclesMonitor.SAFETY_MULTIPLIER
    };
  }

  public async analyzeTrends(canisterId: Principal): Promise<{
    cycleTrend: number;
    consumptionTrend: number;
    refundTrend: number;
  }> {
    const history = this.metricsHistory.get(canisterId.toText()) || [];
    if (history.length < 2) return { cycleTrend: 0, consumptionTrend: 0, refundTrend: 0 };

    const recent = history.slice(-10); // Last 10 records
    
    const cycleTrend = this.calculateTrend(
      recent.map(m => Number(m.balance))
    );
    
    const consumptionTrend = this.calculateTrend(
      recent.map(m => Number(m.consumed))
    );
    
    const refundTrend = this.calculateTrend(
      recent.map(m => Number(m.refunded))
    );

    return { cycleTrend, consumptionTrend, refundTrend };
  }

  public getUsagePattern(canisterId: Principal): CyclesUsagePattern | undefined {
    return this.usagePatterns.get(canisterId.toText());
  }

  private async updateUsagePattern(canisterId: string): Promise<void> {
    const history = this.metricsHistory.get(canisterId) || [];
    if (history.length < 2) return;

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dailyMetrics = history.filter(m => m.timestamp >= oneDayAgo);
    
    const peakUsage = dailyMetrics.reduce(
      (max, m) => m.consumed > max ? m.consumed : max,
      BigInt(0)
    );

    const averageDaily = dailyMetrics.reduce(
      (sum, m) => sum + m.consumed, BigInt(0)
    ) / BigInt(dailyMetrics.length || 1);

    const projectedMonthly = averageDaily * BigInt(30);

    const spikes = this.detectUsageSpikes(history);

    const pattern: CyclesUsagePattern = {
      peakUsage,
      averageDaily,
      projectedMonthly,
      spikePeriods: spikes
    };

    this.usagePatterns.set(canisterId, pattern);
  }

  private detectUsageSpikes(history: CyclesMetrics[]): { timestamp: Date; amount: bigint }[] {
    if (history.length < 3) return [];

    const stdDev = this.calculateStandardDeviation(
      history.map(m => Number(m.consumed))
    );

    const mean = history.reduce(
      (sum, m) => sum + Number(m.consumed), 0
    ) / history.length;

    return history
      .filter(m => Number(m.consumed) > mean + 2 * stdDev)
      .map(m => ({
        timestamp: m.timestamp,
        amount: m.consumed
      }));
  }

  private calculateStandardDeviation(values: number[]): number {
    const mean = values.reduce((a, b) => a + b) / values.length;
    const squareDiffs = values.map(value => {
      const diff = value - mean;
      return diff * diff;
    });
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    return ((lastValue - firstValue) / firstValue) * 100;
  }

  private calculateBurnRate(history: CyclesMetrics[]): bigint {
    const recent = history.slice(-24); // Last 24 records
    if (recent.length < 2) return BigInt(0);

    const totalConsumed = recent.reduce(
      (sum, m) => sum + m.consumed - m.refunded, BigInt(0)
    );

    return totalConsumed / BigInt(recent.length);
  }

  private calculateRecommendedTopUp(burnRate: bigint, currentBalance: bigint): bigint {
    const projectedNeed = burnRate * BigInt(30); // 30 days of cycles
    const safetyBuffer = projectedNeed * CyclesMonitor.SAFETY_MULTIPLIER;
    
    if (currentBalance < safetyBuffer) {
      return safetyBuffer - currentBalance;
    }
    
    return BigInt(0);
  }
}

export const cyclesMonitor = new CyclesMonitor();