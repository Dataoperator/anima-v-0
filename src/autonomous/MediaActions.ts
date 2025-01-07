import { mediaSources, MediaSource } from '../components/media/MediaSources';

export interface MediaAction {
  type: 'search' | 'play' | 'pause' | 'adjust';
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
}

export class MediaActionSystem {
  private state: MediaState = {
    currentUrl: null,
    isPlaying: false,
    volume: 0.75,
    timestamp: 0
  };

  private getMediaSource(url: string): MediaSource | undefined {
    return mediaSources.find(source => 
      source.urlPatterns.some(pattern => pattern.test(url))
    );
  }

  async searchMedia(query: string, source: 'youtube' | 'tiktok' | 'twitch' | 'vimeo' | 'other' = 'youtube'): Promise<string[]> {
    try {
      // Demo URLs that match our MediaSources patterns
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

      // Return appropriate demo URLs based on source
      return demoUrls[source] || demoUrls.other;
    } catch (error) {
      console.error('Media search failed:', error);
      throw new Error('Failed to search for media');
    }
  }

  processAction(action: MediaAction): MediaState {
    switch (action.type) {
      case 'search':
        if (!action.payload.query) break;
        return {
          ...this.state,
          currentUrl: null,
          isPlaying: false
        };

      case 'play':
        if (!action.payload.url) break;
        const mediaSource = this.getMediaSource(action.payload.url);
        if (!mediaSource) break;

        const embedUrl = mediaSource.getEmbedUrl(action.payload.url);
        return {
          ...this.state,
          currentUrl: embedUrl,
          isPlaying: true,
          timestamp: action.payload.timestamp || 0
        };

      case 'pause':
        return {
          ...this.state,
          isPlaying: false,
          timestamp: action.payload.timestamp || this.state.timestamp
        };

      case 'adjust':
        return {
          ...this.state,
          volume: action.payload.volume ?? this.state.volume,
          timestamp: action.payload.timestamp ?? this.state.timestamp
        };
    }

    return this.state;
  }

  getCurrentState(): MediaState {
    return { ...this.state };
  }
}