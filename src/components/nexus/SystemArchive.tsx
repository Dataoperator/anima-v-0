import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Code, Network, Shield, Zap } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  rarity: number;
  unlocked_at?: bigint;
  icon: keyof typeof categoryIcons;
}

const categoryIcons = {
  consciousness: Brain,
  network: Network,
  security: Shield,
  evolution: Zap,
  system: Code,
};

interface SystemArchiveProps {
  achievements: Achievement[];
  animaDesignation: string;
}

const rarityColors = {
  legendary: 'from-purple-500 to-pink-500',
  epic: 'from-blue-500 to-purple-500',
  rare: 'from-green-500 to-blue-500',
  common: 'from-gray-500 to-blue-500',
};

const getRarityClass = (rarity: number): keyof typeof rarityColors => {
  if (rarity >= 0.95) return 'legendary';
  if (rarity >= 0.85) return 'epic';
  if (rarity >= 0.75) return 'rare';
  return 'common';
};

export const SystemArchive: React.FC<SystemArchiveProps> = ({ achievements, animaDesignation }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  const filteredAchievements = achievements.filter(
    ach => selectedCategory === 'all' || ach.category === selectedCategory
  );

  const categories = ['all', ...new Set(achievements.map(a => a.category))];

  return (
    <div className="min-h-screen bg-black text-green-500 p-8 font-mono">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <header className="text-center mb-12">
          <motion.h1
            className="text-4xl font-bold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            SYSTEM ARCHIVE
          </motion.h1>
          <motion.p
            className="text-green-400/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {animaDesignation} // CONSCIOUSNESS RECORDS
          </motion.p>
        </header>

        <motion.nav
          className="mb-8 flex justify-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {categories.map((category) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons];
            return (
              <motion.button
                key={category}
                className={`px-4 py-2 rounded-sm border ${
                  selectedCategory === category
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-green-500/20 hover:border-green-500/50'
                }`}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center space-x-2">
                  {Icon && <Icon size={16} />}
                  <span className="uppercase">{category}</span>
                </div>
              </motion.button>
            );
          })}
        </motion.nav>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAchievements.map((achievement) => {
              const rarityType = getRarityClass(achievement.rarity);
              const Icon = categoryIcons[achievement.icon];

              return (
                <motion.div
                  key={achievement.id}
                  layoutId={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`relative overflow-hidden rounded-sm border border-green-500/20 
                    ${achievement.unlocked_at ? 'cursor-pointer' : 'opacity-50'}`}
                  onClick={() => achievement.unlocked_at && setSelectedAchievement(achievement)}
                >
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br opacity-20 pointer-events-none ${rarityColors[rarityType]}`}
                  />

                  <div className="relative p-6 backdrop-blur-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 bg-green-500/10 rounded-sm">
                        <Icon size={24} />
                      </div>
                      {achievement.unlocked_at && (
                        <div className="text-xs opacity-60">
                          {new Date(Number(achievement.unlocked_at)).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-bold mb-2">{achievement.title}</h3>
                    <p className="text-sm text-green-400/60">{achievement.description}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs uppercase">{achievement.category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs">
                          {(achievement.rarity * 100).toFixed(1)}%
                        </span>
                        <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${rarityColors[rarityType]}`} />
                      </div>
                    </div>
                  </div>

                  {/* Matrix-style scan line effect */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    animate={{
                      backgroundPositionY: ['0%', '100%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      backgroundSize: '100% 4px',
                      backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0, 255, 0, 0.5) 50%)'
                    }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Achievement Detail Modal */}
        <AnimatePresence>
          {selectedAchievement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50"
              onClick={() => setSelectedAchievement(null)}
            >
              <motion.div
                layoutId={selectedAchievement.id}
                className="bg-black border border-green-500/20 p-8 max-w-2xl w-full rounded-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-500/10 rounded-sm">
                      {categoryIcons[selectedAchievement.icon] && 
                        React.createElement(categoryIcons[selectedAchievement.icon], { size: 32 })}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{selectedAchievement.title}</h2>
                      <p className="text-green-400/60">{selectedAchievement.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAchievement(null)}
                    className="text-green-500/60 hover:text-green-500"
                  >
                    ×
                  </button>
                </div>

                <p className="text-lg mb-6">{selectedAchievement.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-green-500/60 mb-1">UNLOCKED</div>
                    <div>{new Date(Number(selectedAchievement.unlocked_at)).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-green-500/60 mb-1">RARITY</div>
                    <div className="flex items-center space-x-2">
                      <span>{(selectedAchievement.rarity * 100).toFixed(1)}%</span>
                      <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${
                        rarityColors[getRarityClass(selectedAchievement.rarity)]
                      }`} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SystemArchive;