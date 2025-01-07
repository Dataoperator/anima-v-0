import { Principal } from '@dfinity/principal';

export type Result<T, E = string> = { Ok: T } | { Err: E };

export type EmptyResult = Result<null>;
export type AnimaResult = Result<Principal>;
export type AnimasResult = Result<Principal[]>;

export interface InteractionResponse {
  response: string;
  emotionalImpact: number;
  memoryId?: string;
}

export type OptionalInteraction = Result<InteractionResponse | null>;

export enum PaymentType {
  Mint = 'mint',
  Growth = 'growth',
  Resurrection = 'resurrection',
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'critical';
  timestamp: bigint;
  metrics: {
    cpu: number;
    memory: number;
    cycles: bigint;
    activeUsers: number;
  };
}

export interface SystemStats {
  totalTransactions: bigint;
  uniqueUsers: number;
  avgResponseTime: number;
  uptime: bigint;
}

export class MetricsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MetricsError';
  }
}