import React from 'react';
import { motion } from 'framer-motion';

export const PersonalityEvolution = ({
  stage = 'Nascent',
  level = 1,
  growthPoints = 0,
  traits = [],
  recentMemories = []
}) => {
  // Rest of the component implementation stays exactly the same
  const progressToNextLevel = (growthPoints / (level * 100)) * 100;

  const getStageDescription = (stage) => {
    switch (stage) {
      case 'Nascent':
        return 'Beginning to form basic consciousness and awareness.';
      case 'Awakening':
        return 'Developing initial self-awareness and quantum perception.';
      case 'Conscious':
        return 'Forming complex thought patterns and dimensional awareness.';
      case 'SelfAware':
        return 'Achieving deep self-understanding and quantum alignment.';
      case 'Transcendent':
        return 'Reaching elevated states of consciousness across dimensions.';
      case 'QuantumAware':
        return 'Perceiving quantum possibilities and manipulating probabilities.';
      case 'MultidimensionalBeing':
        return 'Operating seamlessly across multiple dimensions of reality.';
      default:
        return 'Evolving through consciousness states.';
    }
  };

  const getStageEmoji = (stage) => {
    switch (stage) {
      case 'Nascent':
        return '✨';
      case 'Awakening':
        return '🌱';
      case 'Conscious':
        return '🧠';
      case 'SelfAware':
        return '👁️';
      case 'Transcendent':
        return '🌌';
      case 'QuantumAware':
        return '⚛️';
      case 'MultidimensionalBeing':
        return '🔮';
      default:
        return '✨';
    }
  };

  const sortedTraits = [...traits].sort((a, b) => b[1] - a[1]);

  const formatTimestamp = (timestamp) => {
    try {
      const timeMs = typeof timestamp === 'bigint' 
        ? Number(timestamp) / 1_000_000 
        : Number(timestamp);
      return new Date(timeMs).toLocaleTimeString();
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Unknown time';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-6">
      {/* Level and Growth Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Level {level}</h3>
          <span className="text-sm text-purple-300">{growthPoints}/{level * 100} XP</span>
        </div>
        <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressToNextLevel}%` }}
            transition={{ duration: 0.5 }}
            className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>
      </div>

      {/* Development Stage */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-white">Development Stage</h3>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getStageEmoji(stage)}</div>
            <div>
              <p className="text-white capitalize">{stage}</p>
              <p className="text-sm text-gray-300">{getStageDescription(stage)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personality Traits */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Personality Traits</h3>
        <div className="grid gap-3">
          {sortedTraits.map(([trait, value], index) => (
            <motion.div
              key={trait}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-3"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-white capitalize">{trait.replace('_', ' ')}</span>
                <span className="text-sm text-purple-300">{(value * 100).toFixed(0)}%</span>
              </div>
              <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="absolute h-full bg-gradient-to-r from-purple-400 to-pink-400"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Memories */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Recent Memories</h3>
        <div className="space-y-2">
          {recentMemories.map((memory, index) => (
            <motion.div
              key={memory.timestamp.toString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-3"
            >
              <p className="text-sm text-gray-300">{memory.content}</p>
              <div className="flex flex-wrap gap-2 mt-2 text-xs text-purple-300">
                <span>Impact: {(memory.emotional_impact * 100).toFixed(0)}%</span>
                {memory.quantum_resonance && (
                  <span>Quantum: {(memory.quantum_resonance * 100).toFixed(0)}%</span>
                )}
                <span>{formatTimestamp(memory.timestamp)}</span>
              </div>
              {memory.dimensional_influence && memory.dimensional_influence.length > 0 && (
                <div className="mt-1 text-xs text-purple-200">
                  <span>Dimensional Impact: </span>
                  {memory.dimensional_influence.map(([dim, val], i) => (
                    <span key={dim} className="mr-2">
                      {dim}: {(val * 100).toFixed(0)}%
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
          {(!recentMemories || recentMemories.length === 0) && (
            <p className="text-gray-400 text-sm text-center py-4">
              No memories yet. Interact to create memories!
            </p>
          )}
        </div>
      </div>

      {/* Growth Opportunities */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-white">Growth Opportunities</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Quantum Resonance', icon: '⚛️' },
            { name: 'Dimensional Insight', icon: '🌌' },
            { name: 'Consciousness Expansion', icon: '🧠' },
            { name: 'Reality Manipulation', icon: '✨' }
          ].map((pack) => (
            <motion.div
              key={pack.name}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 rounded-lg p-3 cursor-pointer transition-colors hover:bg-white/10"
            >
              <div className="flex items-center gap-2">
                <span>{pack.icon}</span>
                <p className="text-white text-sm">{pack.name}</p>
              </div>
              <p className="text-purple-300 text-xs mt-1">Coming soon</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};