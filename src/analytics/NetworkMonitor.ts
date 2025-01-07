import { Principal } from '@dfinity/principal';
import { HttpAgent } from '@dfinity/agent';

export interface NetworkHealth {
  status: 'Healthy' | 'Degraded' | 'Critical';
  latency: number;
  lastUpdated: Date;
  replicaVersion: string;
  cyclesBalance: bigint;
  memoryUsage: number;
  activeConnections: number;
  errorCount: number;
  warningCount: number;
}

export interface CanisterHealth {
  canisterId: Principal;
  status: 'Running' | 'Stopping' | 'Stopped';
  cyclesBalance: bigint;
  memorySize: bigint;
  moduleHash: string | null;
  lastActive: Date;
}

class NetworkMonitor {
  private health: NetworkHealth = {
    status: 'Healthy',
    latency: 0,
    lastUpdated: new Date(),
    replicaVersion: '',
    cyclesBalance: BigInt(0),
    memoryUsage: 0,
    activeConnections: 0,
    errorCount: 0,
    warningCount: 0
  };

  private canisterHealth = new Map<string, CanisterHealth>();
  private agent: HttpAgent | null = null;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private subscribers = new Set<(health: NetworkHealth) => void>();

  public initialize(agent: HttpAgent): void {
    this.agent = agent;
    this.startMonitoring();
  }

  public subscribe(callback: (health: NetworkHealth) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  public getHealth(): NetworkHealth {
    return { ...this.health };
  }

  public async getCanisterHealth(canisterId: Principal): Promise<CanisterHealth | null> {
    return this.canisterHealth.get(canisterId.toText()) || null;
  }

  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  private startMonitoring(): void {
    this.monitoringInterval = setInterval(() => {
      void this.checkNetworkHealth();
    }, 30000); // Check every 30 seconds

    // Initial check
    void this.checkNetworkHealth();
  }

  private async checkNetworkHealth(): Promise<void> {
    if (!this.agent) return;

    try {
      const start = Date.now();
      
      // Check replica status
      await this.agent.fetchRootKey().catch(() => {
        // Ignore error in production
      });
      
      const latency = Date.now() - start;

      // Update health metrics
      const newHealth: NetworkHealth = {
        ...this.health,
        latency,
        lastUpdated: new Date(),
        status: this.determineStatus(latency),
      };

      this.health = newHealth;
      this.notifySubscribers();
    } catch (error) {
      this.handleMonitoringError(error);
    }
  }

  private determineStatus(latency: number): 'Healthy' | 'Degraded' | 'Critical' {
    if (latency < 1000) return 'Healthy';
    if (latency < 3000) return 'Degraded';
    return 'Critical';
  }

  private handleMonitoringError(error: unknown): void {
    this.health = {
      ...this.health,
      status: 'Critical',
      errorCount: this.health.errorCount + 1,
      lastUpdated: new Date()
    };

    console.error('Network monitoring error:', error);
    this.notifySubscribers();
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.health));
  }

  // Advanced monitoring methods
  public async analyzeThroughput(): Promise<{
    requestsPerSecond: number;
    averageLatency: number;
    errorRate: number;
  }> {
    return {
      requestsPerSecond: 0,
      averageLatency: this.health.latency,
      errorRate: (this.health.errorCount / (this.health.activeConnections || 1)) * 100
    };
  }

  public async predictNetworkIssues(): Promise<{
    probability: number;
    suggestedActions: string[];
  }> {
    const errorRate = (this.health.errorCount / (this.health.activeConnections || 1)) * 100;
    const highLatency = this.health.latency > 2000;

    const probability = (errorRate * 0.5 + (highLatency ? 50 : 0)) / 100;
    const actions: string[] = [];

    if (errorRate > 10) {
      actions.push('Consider implementing retry logic');
    }
    if (highLatency) {
      actions.push('Monitor network conditions');
    }

    return {
      probability,
      suggestedActions: actions
    };
  }
}

export const networkMonitor = new NetworkMonitor();