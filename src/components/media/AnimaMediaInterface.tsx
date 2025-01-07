import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuantumState } from '@/hooks/useQuantumState';
import { useRealtimePersonality } from '@/hooks/useRealtimePersonality';
import { MatrixRain } from '../ui/MatrixRain';
import { mediaSources } from './MediaSources';

const MediaPlayer = React.lazy(() => import('./MediaPlayer'));
const WaveformGenerator = React.lazy(() => import('../personality/WaveformGenerator'));

interface AnimaMediaInterfaceProps {
  animaId: string;
  onClose?: () => void;
  className?: string;
}

export const AnimaMediaInterface: React.FC<AnimaMediaInterfaceProps> = ({
  animaId,
  onClose,
  className = ''
}) => {
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { updateQuantumState } = useQuantumState();
  const { emotionalState } = useRealtimePersonality(animaId);

  const handleMediaCommand = useCallback(async (command: string) => {
    if (!command.toLowerCase().includes('play') && !command.toLowerCase().includes('watch')) {
      return;
    }

    setIsProcessing(true);
    try {
      const urlMatch = command.match(/(https?:\/\/[^\s]+)/g);
      if (!urlMatch) return;

      const url = urlMatch[0];
      const matchedSource = mediaSources.find(source => 
        source.urlPatterns.some(pattern => pattern.test(url))
      );

      if (matchedSource) {
        setMediaUrl(url);
        updateQuantumState({
          coherenceLevel: Math.min(1, (prev?.coherenceLevel || 0) + 0.1),
          resonance: Math.random(),
          consciousness_alignment: true
        });
      }
    } catch (error) {
      console.error('Failed to process media command:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [updateQuantumState]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFullscreen]);

  if (!mediaUrl) return null;

  const matchedSource = mediaSources.find(source => 
    source.urlPatterns.some(pattern => pattern.test(mediaUrl))
  );

  if (!matchedSource) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed ${
          isFullscreen ? 'inset-0 z-50' : 'bottom-4 right-4 w-[400px] h-[300px]'
        } ${className}`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0">
          <MatrixRain className="opacity-20" />
        </div>

        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-green-500">Loading Media Interface...</div>
          </div>
        }>
          <MediaPlayer
            url={mediaUrl}
            source={matchedSource}
            onClose={() => {
              setMediaUrl('');
              onClose?.();
            }}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            className="w-full h-full"
          />

          {emotionalState && (
            <WaveformGenerator
              emotionalState={emotionalState}
              className="absolute bottom-0 left-0 right-0 h-1 opacity-30"
            />
          )}
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimaMediaInterface;