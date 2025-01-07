export interface MediaSource {
  name: string;
  urlPatterns: RegExp[];
  getEmbedUrl: (url: string) => string;
  defaultControls?: boolean;
}

export const mediaSources: MediaSource[] = [
  {
    name: 'YouTube',
    urlPatterns: [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
      /youtu\.be\/([a-zA-Z0-9_-]+)/
    ],
    getEmbedUrl: (url: string) => {
      const videoId = url.includes('youtube.com/watch') 
        ? new URL(url).searchParams.get('v')
        : url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
    }
  },
  {
    name: 'TikTok',
    urlPatterns: [/tiktok\.com\/@[\w.]+\/video\/(\d+)/],
    getEmbedUrl: (url: string) => {
      const videoId = url.split('/video/')[1]?.split('?')[0];
      return `https://www.tiktok.com/embed/v2/${videoId}`;
    }
  },
  {
    name: 'Twitch',
    urlPatterns: [
      /twitch\.tv\/videos\/(\d+)/,
      /twitch\.tv\/([a-zA-Z0-9_]+)/
    ],
    getEmbedUrl: (url: string) => {
      const isVideo = url.includes('/videos/');
      const id = url.split(isVideo ? '/videos/' : '/').pop();
      return isVideo
        ? `https://player.twitch.tv/?video=${id}&parent=${window.location.hostname}`
        : `https://player.twitch.tv/?channel=${id}&parent=${window.location.hostname}`;
    }
  },
  {
    name: 'Vimeo',
    urlPatterns: [/vimeo\.com\/(\d+)/],
    getEmbedUrl: (url: string) => {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
  }
];