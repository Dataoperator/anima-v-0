import { Principal } from '@dfinity/principal';

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  uptime: number;
  lastCheck: Date;
  services: {
    name: string;
    status: 'up' | 'down';
    latency: number;
  }[];
}

export interface SystemStats {
  memory: {
    used: number;
    total: number;
    free: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
  storage: {
    used: number;
    total: number;
    free: number;
  };
  total_animas: number;
  active_users: number;
}

export interface MetricsError {
  code: string;
  message: string;
  details?: any;
}

export interface NetworkHealth {
  status: 'green' | 'yellow' | 'red';
  latency: number;
  throughput: number;
  errors: {
    count: number;
    details: string[];
  };
}

export interface UserStats {
  total: number;
  active: number;
  new: number;
  retention: number;
  churn: number;
}

export interface CanisterMetrics {
  cycles: bigint;
  memory: number;
  heapSize: number;
  stableMemory: number;
}

export type PaymentType = 'mint' | 'upgrade' | 'resurrection';

export interface PaymentSettings {
  amount: bigint;
  token: string;
}