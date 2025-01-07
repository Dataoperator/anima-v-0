export interface SystemStats {
    total_animas: bigint;
    active_users: bigint;
    total_transactions: bigint;
    memory_usage_percent: number;
}

export interface HealthStatus {
    status: "healthy" | "degraded" | "critical";
    memory_used: bigint;
    heap_memory: bigint;
    cycles: bigint;
}

export interface HistoryDataPoint {
    time: string;
    nfts: bigint;
    users: bigint;
}

export interface AdminActor {
    is_admin: (principal: Principal) => Promise<boolean>;
    get_system_stats: () => Promise<SystemStats>;
    get_health_status: () => Promise<HealthStatus>;
    get_growth_history: () => Promise<HistoryDataPoint[]>;
}