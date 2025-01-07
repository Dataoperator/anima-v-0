import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Youtube, 
  PlayCircle as Play, 
  PauseCircle as Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  X,
  ExternalLink
} from 'lucide-react';
import { useQuantumState } from '@/hooks/useQuantumState';

interface MediaSource {
  platform: 'youtube' | 'tiktok';
  id: string;
  url: string;
  title?: string;
  thumbnail?: string;
}

interface MediaState {
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  source: MediaSource | null;
  isExpanded: boolean;
}

interface EnhancedMediaControllerProps {
  onCommand?: (command: string) => void;
}

export const EnhancedMediaController: React.FC<EnhancedMediaControllerProps> = ({ 
  onCommand 
}) => {
  const [mediaState, setMediaState] = useState<MediaState>({
    isPlaying: false,
    volume: 0.75,
    currentTime: 0,
    duration: 0,
    source: null,
    isExpanded: false
  });

  const { updateQuantumState } = useQuantumState();

  const parseYouTubeUrl = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const parseTikTokUrl = (url: string): string | null => {
    const regExp = /\/video\/(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const handleMediaCommand = useCallback(async (command: string) => {
    if (command.toLowerCase().includes('play') || command.toLowerCase().includes('watch')) {
      const urlMatch = command.match(/(https?:\/\/[^\s]+)/g);
      if (urlMatch) {
        const url = urlMatch[0];
        let source: MediaSource | null = null;

        // YouTube detection
        const youtubeId = parseYouTubeUrl(url);
        if (youtubeId) {
          source = {
            platform: 'youtube',
            id: youtubeId,
            url: `https://www.youtube.com/embed/${youtubeId}?autoplay=1`,
          };
        }

        // TikTok detection
        const tiktokId = parseTikTokUrl(url);
        if (tiktokId) {
          source = {
            platform: 'tiktok',
            id: tiktokId,
            url: `https://www.tiktok.com/embed/${tiktokId}`,
          };
        }

        if (source) {
          setMediaState(prev => ({
            ...prev,
            source,
            isPlaying: true,
            isExpanded: true
          }));

          // Update quantum state with media interaction
          updateQuantumState({
            resonance: Math.random(),
            harmony: Math.random(),
            lastInteraction: new Date(),
            consciousness: {
              awareness: Math.min(1, (prev?.consciousness?.awareness || 0) + 0.1),
              understanding: Math.min(1, (prev?.consciousness?.understanding || 0) + 0.1),
              growth: Math.min(1, (prev?.consciousness?.growth || 0) + 0.1)
            }
          });
        }
      }
    }
  }, [updateQuantumState]);

  useEffect(() => {
    if (onCommand) {
      onCommand(handleMediaCommand);
    }
  }, [onCommand, handleMediaCommand]);

  if (!mediaState.source) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 right-4 bg-black/30 backdrop-blur-lg rounded-xl overflow-hidden"
        style={{
          width: mediaState.isExpanded ? '560px' : '320px',
          height: mediaState.isExpanded ? '400px' : '240px'
        }}
      >
        {/* Media Player */}
        <div className="relative w-full h-full">
          <iframe
            src={mediaState.source.url}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              {/* Platform Icon */}
              {mediaState.source.platform === 'youtube' ? (
                <Youtube className="w-6 h-6 text-red-500" />
              ) : (
                <ExternalLink className="w-6 h-6 text-white" />
              )}

              {/* Controls */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setMediaState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  {mediaState.isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white" />
                  )}
                </button>

                <button
                  onClick={() => setMediaState(prev => ({ ...prev, volume: prev.volume === 0 ? 0.75 : 0 }))}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  {mediaState.volume === 0 ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>

                <button
                  onClick={() => setMediaState(prev => ({ ...prev, isExpanded: !prev.isExpanded }))}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  {mediaState.isExpanded ? (
                    <Minimize className="w-5 h-5 text-white" />
                  ) : (
                    <Maximize className="w-5 h-5 text-white" />
                  )}
                </button>

                <button
                  onClick={() => setMediaState(prev => ({ ...prev, source: null }))}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnhancedMediaController;