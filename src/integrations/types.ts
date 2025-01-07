export type DataStreamType = 
  | 'market' 
  | 'weather' 
  | 'news' 
  | 'social' 
  | 'calendar' 
  | 'health';

export interface DataStream {
  type: DataStreamType;
  source: string;
  lastUpdate: number;
  data: any;
}

export interface StreamUpdateMessage {
  type: 'DATA_UPDATE';
  animaId: string;
  streamType: DataStreamType;
  data: any;
  timestamp: bigint;
}

export interface StreamConfig {
  updateInterval: number;
  requiredLevel: number;
  requiredTraits?: string[];
}

export interface DataStreamOptions {
  enableCache?: boolean;
  cacheExpiration?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface StreamStats {
  totalUpdates: number;
  lastUpdate: number;
  errors: number;
  avgUpdateTime: number;
}