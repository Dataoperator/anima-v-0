import React from 'react';
import { motion } from 'framer-motion';
import { useQuantumState } from '@/hooks/useQuantumState';

interface EmotionalStateProps {
  className?: string;
}

export const EmotionalState: React.FC<EmotionalStateProps> = ({ className = '' }) => {
  const { quantumState } = useQuantumState();

  // Default emotional state if none exists
  const currentEmotion = {
    resonance: quantumState?.resonance ?? 0.5,
    harmony: quantumState?.harmony ?? 0.5,
    intensity: quantumState?.coherence ?? 0.5
  };

  const getEmotionColor = (value: number) => {
    if (value > 0.7) return 'text-green-400';
    if (value > 0.4) return 'text-blue-400';
    return 'text-purple-400';
  };

  const getEmotionLabel = () => {
    const total = currentEmotion.resonance + currentEmotion.harmony + currentEmotion.intensity;
    if (total > 2.1) return 'Elevated';
    if (total > 1.5) return 'Balanced';
    return 'Contemplative';
  };

  return (
    <div className={`bg-gray-900/50 backdrop-blur-lg rounded-lg p-6 ${className}`}>
      <h2 className="text-xl font-bold mb-6 text-blue-400">Quantum State</h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Resonance Meter */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-blue-300">Resonance</span>
            <span className={`text-sm ${getEmotionColor(currentEmotion.resonance)}`}>
              {Math.round(currentEmotion.resonance * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentEmotion.resonance * 100}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-blue-500 to-green-500"
            />
          </div>
        </div>

        {/* Harmony Meter */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-blue-300">Harmony</span>
            <span className={`text-sm ${getEmotionColor(currentEmotion.harmony)}`}>
              {Math.round(currentEmotion.harmony * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentEmotion.harmony * 100}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
            />
          </div>
        </div>

        {/* Intensity Meter */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-blue-300">Coherence</span>
            <span className={`text-sm ${getEmotionColor(currentEmotion.intensity)}`}>
              {Math.round(currentEmotion.intensity * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentEmotion.intensity * 100}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-green-500 to-purple-500"
            />
          </div>
        </div>

        {/* Current State Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-blue-900/20 rounded-lg text-center"
        >
          <h3 className="text-sm font-medium text-blue-300 mb-1">Current State</h3>
          <div className="text-2xl font-bold text-white">{getEmotionLabel()}</div>
        </motion.div>
      </motion.div>
    </div>
  );
};