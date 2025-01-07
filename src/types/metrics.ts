export interface SystemStats {
    total_animas: number;
    active_users: number;
    total_transactions: number;
    memory_usage_percent: number;
}

export interface HealthStatus {
    status: 'healthy' | 'degraded' | 'critical';
    memory_used: number;
    heap_memory: number;
    cycles: number;
}

export interface HistoryDataPoint {
    time: string;
    nfts: number;
    users: number;
}

export interface MetricsCardProps {
    title: string;
    value: string | number;
    change?: number;
    status?: 'up' | 'down' | 'neutral';
    icon?: React.ReactNode;
}

export interface ChartData {
    data: HistoryDataPoint[];
    title: string;
    description: string;
}