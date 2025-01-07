import { RealtimeService } from '@/services/RealtimeService';
import type { AnimaToken } from '@/declarations/anima/anima.did';
import { ENV } from '@/config/env';
import type { 
  DataStream, 
  DataStreamType, 
  StreamConfig, 
  StreamStats,
  DataStreamOptions
} from './types';

const DEFAULT_STREAM_CONFIGS: Record<DataStreamType, StreamConfig> = {
  market: {
    updateInterval: 60000,
    requiredLevel: 2,
    requiredTraits: ['analytical']
  },
  weather: {
    updateInterval: 900000,
    requiredLevel: 1
  },
  news: {
    updateInterval: 300000,
    requiredLevel: 1
  },
  social: {
    updateInterval: 120000,
    requiredLevel: 3,
    requiredTraits: ['empathy']
  },
  calendar: {
    updateInterval: 300000,
    requiredLevel: 4,
    requiredTraits: ['organized']
  },
  health: {
    updateInterval: 300000,
    requiredLevel: 5,
    requiredTraits: ['nurturing']
  }
};

export class DataStreamManager {
  private static instance: DataStreamManager;
  private streams: Map<string, DataStream> = new Map();
  private realtimeService: RealtimeService;
  private updateIntervals: Map<string, NodeJS.Timeout> = new Map();
  private streamStats: Map<string, StreamStats> = new Map();
  private cache: Map<string, { data: any, expiry: number }> = new Map();

  private constructor() {
    this.realtimeService = new RealtimeService(ENV.REALTIME_ENDPOINT || 'wss://your-endpoint');
    this.setupErrorHandling();
  }

  static getInstance(): DataStreamManager {
    if (!DataStreamManager.instance) {
      DataStreamManager.instance = new DataStreamManager();
    }
    return DataStreamManager.instance;
  }

  private setupErrorHandling() {
    process.on('unhandledRejection', (error) => {
      console.error('Unhandled stream error:', error);
      // Could notify admin canister here
    });
  }

  async initializeStreamsForAnima(anima: AnimaToken, options?: DataStreamOptions) {
    console.log(`Initializing streams for Anima ${anima.id}`);
    const eligibleStreams = this.getEligibleStreams(anima);
    const initPromises = eligibleStreams.map(streamType => 
      this.initializeStream(anima.id.toString(), streamType, options)
        .catch(error => {
          console.error(`Failed to initialize ${streamType} stream:`, error);
          return null;
        })
    );
    
    const results = await Promise.allSettled(initPromises);
    console.log(`Stream initialization complete. Success: ${results.filter(r => r.status === 'fulfilled').length}`);
    return results.filter(r => r.status === 'fulfilled').length > 0;
  }

  private getEligibleStreams(anima: AnimaToken): DataStreamType[] {
    return Object.entries(DEFAULT_STREAM_CONFIGS)
      .filter(([_, config]) => {
        const meetsLevelRequirement = anima.level >= config.requiredLevel;
        const meetsTraitRequirements = !config.requiredTraits || 
          config.requiredTraits.some(trait => 
            anima.personality.traits.some(t => t[0] === trait && t[1] > 0.5)
          );
        
        return meetsLevelRequirement && meetsTraitRequirements;
      })
      .map(([type]) => type as DataStreamType);
  }

  private async initializeStream(
    animaId: string, 
    streamType: DataStreamType,
    options?: DataStreamOptions
  ) {
    const streamKey = `${animaId}:${streamType}`;
    
    if (this.streams.has(streamKey)) return;

    const stream: DataStream = {
      type: streamType,
      source: this.getCanisterId(streamType),
      lastUpdate: Date.now(),
      data: null
    };

    this.streams.set(streamKey, stream);
    this.initStreamStats(streamKey);
    
    // Initial data fetch
    try {
      const initialData = await this.fetchStreamData(streamType, animaId, options);
      stream.data = initialData;
      this.updateStreamStats(streamKey, true);
    } catch (error) {
      console.error(`Initial data fetch failed for ${streamType}:`, error);
      this.updateStreamStats(streamKey, false);
    }

    await this.setupStreamUpdates(animaId, streamType, options);
  }

  private getCanisterId(streamType: DataStreamType): string {
    // In production, these would be actual canister IDs
    const canisterMap: Record<DataStreamType, string> = {
      market: ENV.MARKET_CANISTER_ID || 'market_default',
      weather: ENV.WEATHER_CANISTER_ID || 'weather_default',
      news: ENV.NEWS_CANISTER_ID || 'news_default',
      social: ENV.SOCIAL_CANISTER_ID || 'social_default',
      calendar: ENV.CALENDAR_CANISTER_ID || 'calendar_default',
      health: ENV.HEALTH_CANISTER_ID || 'health_default'
    };
    
    return canisterMap[streamType];
  }

  private updateStreamStats(streamKey: string, success: boolean) {
    const stats = this.streamStats.get(streamKey) || {
      totalUpdates: 0,
      lastUpdate: Date.now(),
      errors: 0,
      avgUpdateTime: 0
    };

    stats.totalUpdates++;
    if (!success) stats.errors++;
    stats.lastUpdate = Date.now();

    this.streamStats.set(streamKey, stats);
  }

  private async setupStreamUpdates(
    animaId: string, 
    streamType: DataStreamType,
    options?: DataStreamOptions
  ) {
    const config = DEFAULT_STREAM_CONFIGS[streamType];
    const streamKey = `${animaId}:${streamType}`;

    if (this.updateIntervals.has(streamKey)) {
      clearInterval(this.updateIntervals.get(streamKey)!);
    }

    const interval = setInterval(async () => {
      try {
        await this.updateStream(animaId, streamType, options);
      } catch (error) {
        console.error(`Stream update failed for ${streamType}:`, error);
        this.updateStreamStats(streamKey, false);
      }
    }, config.updateInterval);

    this.updateIntervals.set(streamKey, interval);
  }

  private async updateStream(
    animaId: string, 
    streamType: DataStreamType,
    options?: DataStreamOptions
  ) {
    const streamKey = `${animaId}:${streamType}`;
    const stream = this.streams.get(streamKey);
    if (!stream) return;

    try {
      const startTime = Date.now();
      const newData = await this.fetchStreamData(streamType, animaId, options);
      
      // Update stream
      stream.data = newData;
      stream.lastUpdate = Date.now();
      this.streams.set(streamKey, stream);

      // Update stats
      const stats = this.streamStats.get(streamKey)!;
      stats.avgUpdateTime = (stats.avgUpdateTime * stats.totalUpdates + (Date.now() - startTime)) 
                           / (stats.totalUpdates + 1);
      this.updateStreamStats(streamKey, true);

      // Cache if enabled
      if (options?.enableCache) {
        this.cacheData(streamKey, newData, options.cacheExpiration);
      }

      // Notify all listeners
      await this.notifyStreamUpdate(animaId, stream);
    } catch (error) {
      console.error(`Failed to update ${streamType} stream for anima ${animaId}:`, error);
      this.updateStreamStats(streamKey, false);
      throw error;
    }
  }

  private async fetchStreamData(
    streamType: DataStreamType, 
    animaId: string,
    options?: DataStreamOptions
  ): Promise<any> {
    const streamKey = `${animaId}:${streamType}`;
    
    // Check cache first if enabled
    if (options?.enableCache) {
      const cached = this.getCachedData(streamKey);
      if (cached) return cached;
    }

    // Retry logic
    let lastError;
    const maxRetries = options?.retryAttempts || 3;
    const retryDelay = options?.retryDelay || 1000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // In production, these would be actual canister calls
        switch (streamType) {
          case 'market':
            return { price: 100 + Math.random() * 10, change: Math.random() * 5 };
          case 'weather':
            return { temp: 60 + Math.random() * 20, condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)] };
          case 'news':
            return [{ title: 'Latest News', content: 'Content', timestamp: Date.now() }];
          case 'social':
            return [{ type: 'post', content: 'Update', timestamp: Date.now() }];
          case 'calendar':
            return [{ title: 'Meeting', time: '10:00', date: new Date().toISOString() }];
          case 'health':
            return { steps: Math.floor(Math.random() * 10000), heartRate: 60 + Math.random() * 40 };
          default:
            return null;
        }
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        }
      }
    }

    throw lastError || new Error(`Failed to fetch ${streamType} data after ${maxRetries} attempts`);
  }

  private cacheData(key: string, data: any, expiration: number = 60000) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + expiration
    });
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private async notifyStreamUpdate(animaId: string, stream: DataStream) {
    try {
      await this.realtimeService.sendOrQueue({
        type: 'DATA_UPDATE',
        anima_id: animaId,
        data: stream.data,
        message: `Updated ${stream.type} data`,
        timestamp: BigInt(Date.now())
      });
    } catch (error) {
      console.error(`Failed to notify stream update:`, error);
    }
  }

  // Public methods
  public async getStreamData(animaId: string, streamType: DataStreamType): Promise<any> {
    const streamKey = `${animaId}:${streamType}`;
    const stream = this.streams.get(streamKey);
    
    if (!stream) {
      throw new Error(`Stream ${streamType} not initialized for anima ${animaId}`);
    }

    return stream.data;
  }

  public getAllStreamData(animaId: string): Map<string, any> {
    const data = new Map();
    
    for (const [key, stream] of this.streams.entries()) {
      if (key.startsWith(`${animaId}:`)) {
        data.set(stream.type, stream.data);
      }
    }

    return data;
  }

  public getStreamStats(animaId: string, streamType: DataStreamType): StreamStats | null {
    const streamKey = `${animaId}:${streamType}`;
    return this.streamStats.get(streamKey) || null;
  }

  public cleanup(animaId: string) {
    for (const [key, interval] of this.updateIntervals.entries()) {
      if (key.startsWith(`${animaId}:`)) {
        clearInterval(interval);
        this.updateIntervals.delete(key);
        this.streams.delete(key);
        this.streamStats.delete(key);
        this.cache.delete(key);
      }
    }
  }
}

export const dataStreamManager = DataStreamManager.getInstance();