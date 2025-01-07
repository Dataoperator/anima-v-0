import { Principal } from '@dfinity/principal';

export interface NetworkHealth {
  status: string;
  latency: number;
  throughput: number;
  errors: number;
  lastUpdated: bigint;
  replicaVersion: string;
  connections: number;
  bandwidth: number;
}

export interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  warningEvents: number;
  lastUpdated: bigint;
  activeSessions: number;
  threatLevel: string;
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

export interface PaymentSettings {
  creation_fee: bigint;
  resurrection_fee: bigint;
  growth_pack_base_fee: bigint;
  fee_recipient: Principal;
}

export type PaymentType = 
  | { Creation: null }
  | { Resurrection: null }
  | { GrowthPack: null };

export interface MetricsError {
  code: string;
  message: string;
}

export interface SystemMetricsActor {
  get_security_metrics(): Promise<SecurityMetrics>;
  get_network_health(): Promise<NetworkHealth>;
  system_status(): Promise<string>;
  get_user_stats(): Promise<UserStats>;
  get_canister_metrics(): Promise<CanisterMetrics>;
}
