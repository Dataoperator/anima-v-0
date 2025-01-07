import React, { useState, useEffect, memo } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, 
  Maximize, Minimize, X, RotateCw 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuantumState } from '@/hooks/useQuantumState';

interface VideoControlsProps {
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
  isFullscreen: boolean;
  isLoading?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  onToggleFullscreen: () => void;
  onClose: () => void;
}

export const VideoControls = memo(({
  isPlaying,
  volume,
  duration,
  currentTime,
  isFullscreen,
  isLoading,
  onPlay,
  onPause,
  onVolumeChange,
  onSeek,
  onToggleFullscreen,
  onClose
}: VideoControlsProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { updateQuantumState } = useQuantumState();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      updateQuantumState({
        coherenceLevel: Math.min(1, (prev?.coherenceLevel || 0) + 0.05),
        resonance: Math.random(),
        dimensionalSync: Math.min(1, (prev?.dimensionalSync || 0) + 0.1)
      });
    }
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    onSeek(duration * percentage);
    
    updateQuantumState({
      resonance: Math.random(),
      consciousness_alignment: true
    });
  };

  const variants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 }
  };

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial="hidden"
      animate={isHovered ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.2 }}
    >
      {/* Progress Bar */}
      <div 
        className="w-full h-1 bg-white/20 rounded-full cursor-pointer mb-4"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Play/Pause */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {isLoading ? (
              <RotateCw className="w-6 h-6 text-white animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Volume */}
          <div 
            className="relative"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              onClick={() => onVolumeChange(volume === 0 ? 1 : 0)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {volume === 0 ? (
                <VolumeX className="w-6 h-6 text-white" />
              ) : (
                <Volume2 className="w-6 h-6 text-white" />
              )}
            </button>

            {showVolumeSlider && (
              <motion.div 
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-black/80 rounded-lg p-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="w-full"
                />
              </motion.div>
            )}
          </div>

          {/* Time */}
          <div className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Fullscreen */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {isFullscreen ? (
              <Minimize className="w-6 h-6 text-white" />
            ) : (
              <Maximize className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

export default VideoControls;