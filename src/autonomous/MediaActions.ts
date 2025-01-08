import { mediaSources, MediaSource } from '../components/media/MediaSources';
import { EventEmitter } from 'events';

export interface MediaAction {
  type: 'search' | 'play' | 'pause' | 'adjust' | 'stop';
  source: 'youtube' | 'tiktok' | 'twitch' | 'vimeo' | 'other';
  payload: {
    query?: string;
    url?: string;
    timestamp?: number;
    volume?: number;
  };
}

export interface MediaState {
  currentUrl: string | null;
  isPlaying: boolean;
  volume: number;
  timestamp: number;
  source: string | null;
  duration: number | null;
}

export class MediaActionSystem extends EventEmitter {
  private state: MediaState = {
    currentUrl: null,
    isPlaying: false,
    volume: 0.75,
    timestamp: 0,
    source: null,
    duration: null
  };

  constructor() {
    super();
    this.handleStateUpdate = this.handleStateUpdate.bind(this);
  }

  private handleStateUpdate(newState: Partial<MediaState>) {
    this.state = { ...this.state, ...newState };
    this.emit('stateChanged', this.state);
  }

  private getMediaSource(url: string): MediaSource | undefined {
    return mediaSources.find(source => 
      source.urlPatterns.some(pattern => pattern.test(url))
    );
  }

  async searchMedia(query: string, source: 'youtube' | 'tiktok' | 'twitch' | 'vimeo' | 'other' = 'youtube'): Promise<string[]> {
    try {
      // In a full implementation, this would interact with media platform APIs
      const demoUrls = {
        youtube: [
          'https://youtube.com/watch?v=jNQXAC9IVRw',
          'https://youtube.com/watch?v=dQw4w9WgXcQ'
        ],
        tiktok: [
          'https://tiktok.com/@user/video/7123456789',
          'https://tiktok.com/@user/video/7987654321'
        ],
        twitch: [
          'https://twitch.tv/videos/1234567890',
          'https://twitch.tv/ninja'
        ],
        vimeo: [
          'https://vimeo.com/148751763',
          'https://vimeo.com/148751764'
        ],
        other: [
          'https://youtube.com/watch?v=jNQXAC9IVRw',
          'https://vimeo.com/148751763'
        ]
      };

      const urls = demoUrls[source] || demoUrls.other;
      this.emit('searchCompleted', { query, urls });
      return urls;
    } catch (error) {
      this.emit('error', { type: 'SEARCH_FAILED', error });
      throw new Error('Failed to search for media');
    }
  }

  processAction(action: MediaAction): MediaState {
    try {
      switch (action.type) {
        case 'search':
          if (!action.payload.query) break;
          this.handleStateUpdate({
            currentUrl: null,
            isPlaying: false
          });
          break;

        case 'play':
          if (!action.payload.url) break;
          const mediaSource = this.getMediaSource(action.payload.url);
          if (!mediaSource) break;

          const embedUrl = mediaSource.getEmbedUrl(action.payload.url);
          this.handleStateUpdate({
            currentUrl: embedUrl,
            isPlaying: true,
            timestamp: action.payload.timestamp || 0,
            source: action.source
          });
          break;

        case 'pause':
          this.handleStateUpdate({
            isPlaying: false,
            timestamp: action.payload.timestamp || this.state.timestamp
          });
          break;

        case 'stop':
          this.handleStateUpdate({
            currentUrl: null,
            isPlaying: false,
            timestamp: 0,
            source: null,
            duration: null
          });
          break;

        case 'adjust':
          this.handleStateUpdate({
            volume: action.payload.volume ?? this.state.volume,
            timestamp: action.payload.timestamp ?? this.state.timestamp
          });
          break;
      }

      this.emit('actionProcessed', { action, newState: this.state });
      return this.state;
    } catch (error) {
      this.emit('error', { type: 'PROCESS_ACTION_FAILED', error });
      throw error;
    }
  }

  updateDuration(duration: number) {
    this.handleStateUpdate({ duration });
  }

  updateTimestamp(timestamp: number) {
    this.handleStateUpdate({ timestamp });
  }

  getCurrentState(): MediaState {
    return { ...this.state };
  }
}
