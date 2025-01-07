import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { hapticFeedback } from '@/utils/haptics';

interface Achievement {
  id: string;
  name: string;
  description: string;
  rarity: 'Ancient' | 'Mythic' | 'Legendary' | 'Ethereal';
  unlocked: boolean;
  unlockedAt?: Date;
  type: 'Combat' | 'Wisdom' | 'Creation' | 'Ascension';
  icon: string;
}

const rarityColors = {
  Ancient: 'from-emerald-500 to-teal-700',
  Mythic: 'from-violet-500 to-purple-700',
  Legendary: 'from-amber-500 to-orange-700',
  Ethereal: 'from-blue-400 to-indigo-800'
};

export const EternalCodex: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => {
  const { playSuccess, playHover } = useSound();

  const handleAchievementHover = () => {
    playHover();
    hapticFeedback.light();
  };

  return (
    <div className="relative">
      {/* Floating runes background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-purple-900/5 to-black/0" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-amber-500/20 text-2xl"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0 
            }}
            animate={{
              y: [null, '-100vh'],
              opacity: [0, 0.2, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              delay: Math.random() * 10
            }}
          >
            ᚱ
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <AnimatePresence>
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.02 }}
              onHoverStart={handleAchievementHover}
              className={`
                relative overflow-hidden rounded-lg
                ${achievement.unlocked ? 'cursor-pointer' : 'cursor-default opacity-60'}
                bg-gradient-to-br from-black/60 to-black/40
                backdrop-blur border
                ${achievement.unlocked ? 'border-amber-500/50' : 'border-gray-700/50'}
              `}
            >
              {/* Achievement background effect */}
              {achievement.unlocked && (
                <motion.div
                  className={`
                    absolute inset-0 opacity-10
                    bg-gradient-to-br ${rarityColors[achievement.rarity]}
                  `}
                  animate={{
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )}

              <div className="relative p-4 space-y-3">
                {/* Icon */}
                <div className="flex justify-between items-start">
                  <div className={`
                    text-3xl
                    ${achievement.unlocked ? 'text-amber-400' : 'text-gray-600'}
                  `}>
                    {achievement.icon}
                  </div>
                  <div className={`
                    text-xs font-semibold px-2 py-1 rounded-full
                    ${achievement.unlocked ? `bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white` : 'bg-gray-800 text-gray-400'}
                  `}>
                    {achievement.rarity}
                  </div>
                </div>

                {/* Name and Description */}
                <div>
                  <h3 className={`
                    text-lg font-bold mb-1
                    ${achievement.unlocked ? 'text-amber-400' : 'text-gray-500'}
                  `}>
                    {achievement.name}
                  </h3>
                  <p className={`
                    text-sm
                    ${achievement.unlocked ? 'text-amber-300/80' : 'text-gray-600'}
                  `}>
                    {achievement.description}
                  </p>
                </div>

                {/* Unlock Date */}
                {achievement.unlocked && achievement.unlockedAt && (
                  <div className="text-xs text-amber-400/60">
                    Unlocked {achievement.unlockedAt.toLocaleDateString()}
                  </div>
                )}

                {/* Type Badge */}
                <div className={`
                  absolute top-2 right-2 text-xs px-2 py-1 rounded-full
                  ${achievement.unlocked ? 'bg-black/40 text-amber-400' : 'bg-black/40 text-gray-500'}
                `}>
                  {achievement.type}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};