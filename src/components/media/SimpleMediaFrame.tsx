import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripVertical, X, Maximize2, Minimize2 } from 'lucide-react';

interface SimpleMediaFrameProps {
  url?: string;
  isVisible: boolean;
  onClose?: () => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
}

export const SimpleMediaFrame: React.FC<SimpleMediaFrameProps> = ({
  url,
  isVisible,
  onClose,
  onPositionChange
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const getEmbedUrl = (url: string = '') => {
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('youtu.be')) {
      const videoId = url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('tiktok.com')) {
      return `https://www.tiktok.com/embed/${url.split('/video/')[1]}`;
    }
    return url;
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    setPosition({ x: info.point.x, y: info.point.y });
    onPositionChange?.({ x: info.point.x, y: info.point.y });
  };

  if (!isVisible) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      initial={false}
      animate={{
        width: isMinimized ? '300px' : '560px',
        height: isMinimized ? '200px' : '315px',
        x: position.x,
        y: position.y
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-4 right-4 bg-black/20 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg"
    >
      <div 
        className="absolute top-0 left-0 right-0 h-8 bg-black/40 backdrop-blur-sm flex items-center justify-between px-2"
        style={{ touchAction: 'none' }}
      >
        <GripVertical className="w-4 h-4 text-white/60 cursor-move" />
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-white/60" />
            ) : (
              <Minimize2 className="w-4 h-4 text-white/60" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>

      <div className="w-full h-full pt-8">
        {url && (
          <iframe
            src={getEmbedUrl(url)}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
          />
        )}
      </div>

      {!url && (
        <div className="absolute inset-0 flex items-center justify-center text-white/60">
          Loading media...
        </div>
      )}
    </motion.div>
  );
};