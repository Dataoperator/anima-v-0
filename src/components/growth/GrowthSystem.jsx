import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GrowthPackSelector } from './GrowthPackSelector';

export const GrowthSystem = ({ 
  anima = {
    level: 1,
    growth_points: 0,
    personality: {
      skills: []
    }
  }, 
  onGrowthUpdate 
}) => {
  // Rest of the component implementation stays exactly the same
  const [showPackSelector, setShowPackSelector] = useState(false);
  const [recentUpdates, setRecentUpdates] = useState([]);

  const handlePackApplied = async (updates) => {
    setRecentUpdates(updates);
    if (onGrowthUpdate) {
      await onGrowthUpdate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Growth Summary */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">Growth Progress</h2>
            <p className="text-gray-300 mt-1">Level {anima.level}</p>
          </div>
          <button
            onClick={() => setShowPackSelector(!showPackSelector)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition"
          >
            {showPackSelector ? 'Hide Growth Packs' : 'Show Growth Packs'}
          </button>
        </div>

        {/* Recent Updates */}
        <AnimatePresence mode="popLayout">
          {recentUpdates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-white/5 rounded-lg"
            >
              <h3 className="text-sm font-medium text-purple-300 mb-2">Recent Updates:</h3>
              <div className="space-y-2">
                {recentUpdates.map((update, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-sm text-gray-300"
                  >
                    {update}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Growth Pack Selector */}
      <AnimatePresence mode="popLayout">
        {showPackSelector && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <GrowthPackSelector
              anima={anima}
              onPackApplied={handlePackApplied}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Development Stage */}
      <motion.div
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Development Stage</h2>
        <div className="space-y-4">
          {/* Growth Points */}
          <div>
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Growth Points</span>
              <span>{anima.growth_points} / {anima.level * 10}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${(anima.growth_points / (anima.level * 10)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Active Skills */}
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Active Skills</h3>
            <div className="grid grid-cols-2 gap-3">
              {anima.personality.skills.map((skill) => (
                <motion.div
                  key={skill.name}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/5 rounded-lg p-3"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">{skill.name}</span>
                    <span className="text-sm text-purple-300">Lvl {skill.level}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${(skill.experience_points / (skill.level * 100)) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Available Evolution Paths */}
          <div>
            <h3 className="text-lg font-medium text-white mb-3">Evolution Paths</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  path: 'Emotional Intelligence',
                  description: 'Focus on empathy and emotional understanding',
                  unlocked: anima.level >= 3,
                },
                {
                  path: 'Logical Mastery',
                  description: 'Develop analytical and problem-solving abilities',
                  unlocked: anima.level >= 3,
                },
                {
                  path: 'Creative Expression',
                  description: 'Enhance artistic and creative capabilities',
                  unlocked: anima.level >= 4,
                },
                {
                  path: 'Philosophical Insight',
                  description: 'Deepen understanding of complex concepts',
                  unlocked: anima.level >= 5,
                },
              ].map((path) => (
                <motion.div
                  key={path.path}
                  whileHover={path.unlocked ? { scale: 1.02 } : {}}
                  className={`p-4 rounded-xl border ${
                    path.unlocked
                      ? 'border-purple-500/30 bg-white/5 cursor-pointer'
                      : 'border-gray-700 bg-white/5 opacity-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium">{path.path}</h4>
                    {!path.unlocked && (
                      <span className="text-xs text-gray-400">
                        Unlocks at Level {path.unlocked ? '3' : '5'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300">{path.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};