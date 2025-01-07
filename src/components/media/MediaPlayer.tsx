import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuantumState } from '@/hooks/useQuantumState';
import type { MediaSource } from './MediaSources';
const VideoControls = React.lazy(() => import('./VideoControls'));

interface MediaPlayerProps {
  url: string;
  source: MediaSource;
  onClose: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  className?: string;
}

interface PlayerState {
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isLoading: boolean;
}

export const MediaPlayer = memo(({
  url,
  source,
  onClose,
  isFullscreen = false,
  onToggleFullscreen,
  className = ''
}: MediaPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { updateQuantumState } = useQuantumState();
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    volume: 0.75,
    currentTime: 0,
    duration: 0,
    isLoading: true
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== new URL(url).origin) return;

      try {
        const data = JSON.parse(event.data);
        
        if (data.event === 'ready') {
          setPlayerState(prev => ({ ...prev, isLoading: false }));
          updateQuantumState({
            dimensionalSync: Math.min(1, (prev?.dimensionalSync || 0) + 0.1),
            consciousness_alignment: true
          });
        }

        if (data.event === 'stateChange') {
          setPlayerState(prev => ({
            ...prev,
            isPlaying: data.isPlaying,
            currentTime: data.currentTime,
            duration: data.duration
          }));

          if (data.isPlaying) {
            updateQuantumState({
              coherenceLevel: Math.min(1, (prev?.coherenceLevel || 0) + 0.05),
              resonance: Math.random()
            });
          }
        }
      } catch (error) {
        console.error('Failed to parse media player message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [url]);

  const postMessage = (message: any) => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(JSON.stringify(message), '*');
  };

  const handlePlay = () => {
    postMessage({ command: 'play' });
    setPlayerState(prev => ({ ...prev, isPlaying: true }));
    updateQuantumState({
      coherenceLevel: Math.min(1, (prev?.coherenceLevel || 0) + 0.1),
      resonance: Math.random(),
      consciousness_alignment: true
    });
  };

  const handlePause = () => {
    postMessage({ command: 'pause' });
    setPlayerState(prev => ({ ...prev, isPlaying: false }));
  };

  const handleVolumeChange = (volume: number) => {
    postMessage({ command: 'setVolume', value: volume });
    setPlayerState(prev => ({ ...prev, volume }));
  };

  const handleSeek = (time: number) => {
    postMessage({ command: 'seek', value: time });
    setPlayerState(prev => ({ ...prev, currentTime: time }));
    updateQuantumState({
      resonance: Math.random(),
      consciousness_alignment: true
    });
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg bg-black ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <iframe
        ref={iframeRef}
        src={source.getEmbedUrl(url)}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      <AnimatePresence>
        <React.Suspense fallback={null}>
          <VideoControls
            isPlaying={playerState.isPlaying}
            volume={playerState.volume}
            currentTime={playerState.currentTime}
            duration={playerState.duration}
            isFullscreen={isFullscreen}
            isLoading={playerState.isLoading}
            onPlay={handlePlay}
            onPause={handlePause}
            onVolumeChange={handleVolumeChange}
            onSeek={handleSeek}
            onToggleFullscreen={onToggleFullscreen || (() => {})}
            onClose={onClose}
          />
        </React.Suspense>
      </AnimatePresence>
    </motion.div>
  );
});

export default MediaPlayer;