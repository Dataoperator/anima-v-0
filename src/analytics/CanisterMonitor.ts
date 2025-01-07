import { Principal } from '@dfinity/principal';

export interface CanisterMetrics {
  memorySize: bigint;
  heapSize: bigint;
  cycles: bigint;
  updateCalls: bigint;
  queryCalls: bigint;
  instructionsCount: bigint;
  timestamp: Date;
  canisterId: Principal;
}

export interface CanisterHealth {
  status: 'Healthy' | 'Warning' | 'Critical';
  uptime: number;
  lastUpdate: Date;
  errorCount: number;
  memoryUtilization: number;
  cyclesPerDay: bigint;
}

class CanisterMonitor {
  private metricsHistory: Map<string, CanisterMetrics[]> = new Map();
  private healthStatus: Map<string, CanisterHealth> = new Map();
  private static readonly MEMORY_THRESHOLD = 0.9; // 90% memory usage warning
  private static readonly CYCLES_THRESHOLD = BigInt(1_000_000_000_000); // 1T cycles
  
  public async recordMetrics(metrics: CanisterMetrics): Promise<void> {
    const canisterId = metrics.canisterId.toText();
    const history = this.metricsHistory.get(canisterId) || [];
    
    history.push(metrics);
    if (history.length > 1000) history.shift(); // Keep last 1000 records
    
    this.metricsHistory.set(canisterId, history);
    await this.updateHealth(canisterId);
  }

  public getHealth(canisterId: Principal): CanisterHealth | undefined {
    return this.healthStatus.get(canisterId.toText());
  }

  public getMetricsHistory(
    canisterId: Principal,
    timeRange: { start: Date; end: Date }
  ): CanisterMetrics[] {
    const history = this.metricsHistory.get(canisterId.toText()) || [];
    return history.filter(
      m => m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
    );
  }

  public async analyzeTrends(canisterId: Principal): Promise<{
    memoryTrend: number;
    cyclesTrend: number;
    callVolumeTrend: number;
  }> {
    const history = this.metricsHistory.get(canisterId.toText()) || [];
    if (history.length < 2) return { memoryTrend: 0, cyclesTrend: 0, callVolumeTrend: 0 };

    const recent = history.slice(-10); // Last 10 records
    
    const memoryTrend = this.calculateTrend(
      recent.map(m => Number(m.memorySize))
    );
    
    const cyclesTrend = this.calculateTrend(
      recent.map(m => Number(m.cycles))
    );
    
    const callVolumeTrend = this.calculateTrend(
      recent.map(m => Number(m.updateCalls + m.queryCalls))
    );

    return { memoryTrend, cyclesTrend, callVolumeTrend };
  }

  public getPerformanceMetrics(canisterId: Principal): {
    avgResponseTime: number;
    successRate: number;
    errorRate: number;
  } {
    const history = this.metricsHistory.get(canisterId.toText()) || [];
    const health = this.healthStatus.get(canisterId.toText());

    if (!history.length || !health) {
      return { avgResponseTime: 0, successRate: 0, errorRate: 0 };
    }

    const totalCalls = Number(history[history.length - 1].updateCalls + 
                            history[history.length - 1].queryCalls);
    
    const errorRate = health.errorCount / totalCalls * 100;
    
    return {
      avgResponseTime: this.calculateAverageResponseTime(history),
      successRate: 100 - errorRate,
      errorRate
    };
  }

  private async updateHealth(canisterId: string): Promise<void> {
    const history = this.metricsHistory.get(canisterId) || [];
    if (!history.length) return;

    const latest = history[history.length - 1];
    const oldestInDay = history.find(
      m => m.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    const cyclesPerDay = oldestInDay 
      ? latest.cycles - oldestInDay.cycles 
      : BigInt(0);

    const memoryUtilization = Number(latest.memorySize) / 
                            (4 * 1024 * 1024 * 1024); // 4GB max

    let status: CanisterHealth['status'] = 'Healthy';
    
    if (memoryUtilization > CanisterMonitor.MEMORY_THRESHOLD || 
        latest.cycles < CanisterMonitor.CYCLES_THRESHOLD) {
      status = 'Warning';
    }

    if (memoryUtilization > 0.95 || latest.cycles < BigInt(100_000_000_000)) {
      status = 'Critical';
    }

    const health: CanisterHealth = {
      status,
      uptime: this.calculateUptime(history),
      lastUpdate: latest.timestamp,
      errorCount: this.countErrors(history),
      memoryUtilization,
      cyclesPerDay
    };

    this.healthStatus.set(canisterId, health);
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    return ((lastValue - firstValue) / firstValue) * 100;
  }

  private calculateUptime(history: CanisterMetrics[]): number {
    if (history.length < 2) return 100;
    
    const timeRanges = history.slice(1).map((metrics, i) => {
      const timeDiff = metrics.timestamp.getTime() - 
                      history[i].timestamp.getTime();
      return timeDiff <= 300000 ? timeDiff : 0; // Count gaps <= 5 minutes
    });

    const totalTime = history[history.length - 1].timestamp.getTime() - 
                     history[0].timestamp.getTime();
    
    return (timeRanges.reduce((sum, time) => sum + time, 0) / totalTime) * 100;
  }

  private countErrors(history: CanisterMetrics[]): number {
    return history.filter(m => 
      m.memorySize > BigInt(3.8 * 1024 * 1024 * 1024) || // >3.8GB memory
      m.cycles < BigInt(100_000_000_000) // <100B cycles
    ).length;
  }

  private calculateAverageResponseTime(history: CanisterMetrics[]): number {
    if (history.length < 2) return 0;
    
    const timestamps = history.map(m => m.timestamp.getTime());
    const intervals = timestamps.slice(1).map((time, i) => 
      time - timestamps[i]
    );
    
    return intervals.reduce((sum, time) => sum + time, 0) / intervals.length;
  }
}

export const canisterMonitor = new CanisterMonitor();