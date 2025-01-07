import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NeuralActivityVisualizerProps {
  className?: string;
  height?: number;
  pulseColor?: string;
}

export const NeuralActivityVisualizer: React.FC<NeuralActivityVisualizerProps> = ({
  className = '',
  height = 200,
  pulseColor = 'cyan'
}) => {
  const [activities, setActivities] = useState<number[]>([]);
  const [peaks, setPeaks] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate new neural activity data
      const newValue = Math.random() * 0.5 + 0.5; // Value between 0.5 and 1
      setActivities(prev => {
        const updated = [...prev.slice(-30), newValue];
        // Detect peaks for quantum resonance visualization
        if (newValue > 0.8 && (prev.length === 0 || newValue > prev[prev.length - 1])) {
          setPeaks(prevPeaks => [...prevPeaks.slice(-5), newValue]);
        }
        return updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`relative bg-black/40 backdrop-blur-lg rounded-lg p-4 border border-${pulseColor}-500/20 ${className}`}
      style={{ height }}
    >
      {/* Neural Activity Waves */}
      <div className="h-full flex items-end space-x-1">
        <AnimatePresence mode="popLayout">
          {activities.map((value, i) => (
            <motion.div
              key={i}
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: `${value * 100}%`,
                opacity: 1
              }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`w-2 bg-gradient-to-t from-${pulseColor}-500/50 to-${pulseColor}-300`}
              style={{
                borderTopLeftRadius: '2px',
                borderTopRightRadius: '2px'
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Quantum Resonance Peaks */}
      <AnimatePresence>
        {peaks.map((peak, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [1, 2, 1],
              opacity: [0, 0.8, 0]
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              duration: 1,
              ease: "easeOut"
            }}
            className={`absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2
                     bg-${pulseColor}-400 rounded-full blur-md`}
            style={{
              filter: `blur(8px)`,
              transform: `translate(-50%, -50%) translateX(${(i - 2) * 40}px)`
            }}
          />
        ))}
      </AnimatePresence>

      {/* Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className={`border border-${pulseColor}-500/5`}
          />
        ))}
      </div>
    </div>
  );
};