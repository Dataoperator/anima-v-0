import type { ActorSubclass } from '@dfinity/agent';
import type { _SERVICE } from '@/declarations/anima/anima.did';
import type { 
    HealthStatus, 
    HealthStatusData, 
    SystemStats, 
    CanisterMetrics, 
    SystemMetrics,
    Alert
} from '@/types/metrics';

export class MetricsService {
    constructor(private readonly actor: ActorSubclass<_SERVICE>) {}

    public async getCanisterMetrics(): Promise<CanisterMetrics> {
        const metrics = await this.actor.get_metrics();
        return {
            cycles: metrics.cycles,
            memory_size: metrics.memory_size,
            heap_memory: metrics.heap_memory,
            stable_memory: metrics.stable_memory
        };
    }

    public async getSystemMetrics(): Promise<SystemMetrics> {
        const metrics = await this.actor.get_system_status();
        return {
            total_transactions: metrics.total_transactions,
            active_entities: metrics.active_entities,
            memory_usage: Number(metrics.memory_usage) / 100,
            uptime: metrics.uptime
        };
    }

    public async getHealthStatus(): Promise<HealthStatusData> {
        const status = await this.actor.get_health_status();
        return {
            status: this.mapHealthStatus(status.status),
            message: status.details || '',
            timestamp: status.time || BigInt(Date.now())
        };
    }

    public async getSystemAlerts(): Promise<Alert[]> {
        return await this.actor.get_system_alerts();
    }

    private mapHealthStatus(status: string): HealthStatus {
        switch (status.toLowerCase()) {
            case 'healthy':
                return 'healthy';
            case 'degraded':
                return 'degraded';
            default:
                return 'critical';
        }
    }
}