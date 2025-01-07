import { Principal } from '@dfinity/principal';

export interface SystemMetrics {
  timestamp: Date;
  memory: {
    total: bigint;
    used: bigint;
    heap: bigint;
    stable: bigint;
  };
  cycles: {
    balance: bigint;
    consumed: bigint;
    refunded: bigint;
  };
  performance: {
    responseTime: number;
    throughput: number;
    errorRate: number;
    successRate: number;
  };
  canister: {
    id: Principal;
    version: string;
    uptime: number;
    status: 'Running' | 'Stopping' | 'Stopped';
  };
}

export interface HealthStatus {
  overall: HealthLevel;
  components: {
    memory: ComponentHealth;
    cycles: ComponentHealth;
    performance: ComponentHealth;
    security: ComponentHealth;
    network: ComponentHealth;
  };
}

export interface ComponentHealth {
  status: HealthLevel;
  details: string;
  metrics: Record<string, number>;
  timestamp: Date;
}

export type HealthLevel = 'Healthy' | 'Warning' | 'Critical';

class SystemHealthMonitor {
  private metricsHistory: SystemMetrics[] = [];
  private currentHealth: HealthStatus | null = null;
  private static readonly MEMORY_WARNING = 0.8; // 80% usage
  private static readonly MEMORY_CRITICAL = 0.9; // 90% usage
  private static readonly CYCLES_WARNING = BigInt(200_000_000_000); // 200B cycles
  private static readonly CYCLES_CRITICAL = BigInt(100_000_000_000); // 100B cycles
  private static readonly ERROR_RATE_WARNING = 0.05; // 5% error rate
  private static readonly ERROR_RATE_CRITICAL = 0.10; // 10% error rate

  public async recordMetrics(metrics: SystemMetrics): Promise<void> {
    this.metricsHistory.push(metrics);
    if (this.metricsHistory.length > 1000) {
      this.metricsHistory.shift();
    }
    await this.updateHealth(metrics);
  }

  public getHealth(): HealthStatus {
    if (!this.currentHealth) {
      throw new Error('Health status not initialized');
    }
    return this.currentHealth;
  }

  public getMetricsHistory(timeRange?: { start: Date; end: Date }): SystemMetrics[] {
    if (!timeRange) {
      return [...this.metricsHistory];
    }

    return this.metricsHistory.filter(
      m => m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
    );
  }

  public getPerformanceTrends(): {
    responseTime: number;
    throughput: number;
    errorRate: number;
    memoryUsage: number;
    cyclesUsage: number;
  } {
    if (this.metricsHistory.length < 2) {
      return {
        responseTime: 0,
        throughput: 0,
        errorRate: 0,
        memoryUsage: 0,
        cyclesUsage: 0
      };
    }

    const recent = this.metricsHistory.slice(-10);
    
    return {
      responseTime: this.calculateTrend(
        recent.map(m => m.performance.responseTime)
      ),
      throughput: this.calculateTrend(
        recent.map(m => m.performance.throughput)
      ),
      errorRate: this.calculateTrend(
        recent.map(m => m.performance.errorRate)
      ),
      memoryUsage: this.calculateTrend(
        recent.map(m => Number(m.memory.used) / Number(m.memory.total))
      ),
      cyclesUsage: this.calculateTrend(
        recent.map(m => Number(m.cycles.consumed))
      )
    };
  }

  public getSystemSummary(): {
    uptime: number;
    totalRequests: number;
    avgResponseTime: number;
    peakMemory: bigint;
    totalCyclesConsumed: bigint;
  } {
    if (!this.metricsHistory.length) {
      return {
        uptime: 0,
        totalRequests: 0,
        avgResponseTime: 0,
        peakMemory: BigInt(0),
        totalCyclesConsumed: BigInt(0)
      };
    }

    const latest = this.metricsHistory[this.metricsHistory.length - 1];
    const peakMemory = this.metricsHistory.reduce(
      (max, m) => m.memory.used > max ? m.memory.used : max,
      BigInt(0)
    );

    return {
      uptime: latest.canister.uptime,
      totalRequests: this.metricsHistory.reduce(
        (sum, m) => sum + m.performance.throughput, 0
      ),
      avgResponseTime: this.metricsHistory.reduce(
        (sum, m) => sum + m.performance.responseTime, 0
      ) / this.metricsHistory.length,
      peakMemory,
      totalCyclesConsumed: this.metricsHistory.reduce(
        (sum, m) => sum + m.cycles.consumed, BigInt(0)
      )
    };
  }

  private async updateHealth(metrics: SystemMetrics): Promise<void> {
    const memoryUsage = Number(metrics.memory.used) / Number(metrics.memory.total);
    const memoryHealth = this.assessHealthLevel(
      memoryUsage,
      SystemHealthMonitor.MEMORY_WARNING,
      SystemHealthMonitor.MEMORY_CRITICAL
    );

    const cyclesHealth = this.assessCyclesHealth(metrics.cycles.balance);
    const performanceHealth = this.assessPerformanceHealth(metrics.performance);

    const componentHealth: HealthStatus['components'] = {
      memory: {
        status: memoryHealth,
        details: `Memory usage at ${(memoryUsage * 100).toFixed(1)}%`,
        metrics: {
          usagePercent: memoryUsage * 100,
          heapMB: Number(metrics.memory.heap) / (1024 * 1024),
          stableMB: Number(metrics.memory.stable) / (1024 * 1024)
        },
        timestamp: metrics.timestamp
      },
      cycles: {
        status: cyclesHealth,
        details: `Cycles balance: ${metrics.cycles.balance.toString()}`,
        metrics: {
          balanceT: Number(metrics.cycles.balance) / 1e12,
          consumedT: Number(metrics.cycles.consumed) / 1e12,
          refundedT: Number(metrics.cycles.refunded) / 1e12
        },
        timestamp: metrics.timestamp
      },
      performance: {
        status: performanceHealth,
        details: `Error rate: ${(metrics.performance.errorRate * 100).toFixed(1)}%`,
        metrics: {
          responseTimeMs: metrics.performance.responseTime,
          throughputRPS: metrics.performance.throughput,
          errorRate: metrics.performance.errorRate,
          successRate: metrics.performance.successRate
        },
        timestamp: metrics.timestamp
      },
      security: await this.getSecurityHealth(),
      network: await this.getNetworkHealth()
    };

    const overallHealth = this.calculateOverallHealth(componentHealth);

    this.currentHealth = {
      overall: overallHealth,
      components: componentHealth
    };
  }

  private assessHealthLevel(
    value: number,
    warningThreshold: number,
    criticalThreshold: number
  ): HealthLevel {
    if (value >= criticalThreshold) return 'Critical';
    if (value >= warningThreshold) return 'Warning';
    return 'Healthy';
  }

  private assessCyclesHealth(balance: bigint): HealthLevel {
    if (balance <= SystemHealthMonitor.CYCLES_CRITICAL) return 'Critical';
    if (balance <= SystemHealthMonitor.CYCLES_WARNING) return 'Warning';
    return 'Healthy';
  }

  private assessPerformanceHealth(performance: SystemMetrics['performance']): HealthLevel {
    if (performance.errorRate >= SystemHealthMonitor.ERROR_RATE_CRITICAL) return 'Critical';
    if (performance.errorRate >= SystemHealthMonitor.ERROR_RATE_WARNING) return 'Warning';
    return 'Healthy';
  }

  private async getSecurityHealth(): Promise<ComponentHealth> {
    // This would integrate with SecurityMonitor in a real implementation
    return {
      status: 'Healthy',
      details: 'No security issues detected',
      metrics: {
        threatLevel: 0,
        blockedEvents: 0,
        anomalyScore: 0
      },
      timestamp: new Date()
    };
  }

  private async getNetworkHealth(): Promise<ComponentHealth> {
    // This would integrate with NetworkMonitor in a real implementation
    return {
      status: 'Healthy',
      details: 'Network operating normally',
      metrics: {
        latencyMs: 0,
        packetLoss: 0,
        bandwidth: 0
      },
      timestamp: new Date()
    };
  }

  private calculateOverallHealth(
    components: HealthStatus['components']
  ): HealthLevel {
    const statuses = Object.values(components).map(c => c.status);
    
    if (statuses.some(s => s === 'Critical')) return 'Critical';
    if (statuses.some(s => s === 'Warning')) return 'Warning';
    return 'Healthy';
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    return ((lastValue - firstValue) / firstValue) * 100;
  }
}

export const systemHealthMonitor = new SystemHealthMonitor();