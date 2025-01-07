import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Brain, Activity, Globe, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'CONSCIOUSNESS' | 'QUANTUM' | 'EMOTIONAL' | 'DIMENSIONAL';
  progress: number;
  completed: boolean;
  unlocked_at?: number;
  icon: keyof typeof categoryIcons;
}

const categoryIcons = {
  Award,
  Brain,
  Activity,
  Globe,
  Star
};

interface AchievementSystemProps {
  anima: any; // TODO: Import proper type from types/anima
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({ anima }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Generate achievements based on anima state
    const generatedAchievements: Achievement[] = [
      {
        id: 'first_thought',
        title: 'First Neural Link',
        description: 'Establish initial consciousness connection',
        category: 'CONSCIOUSNESS',
        progress: anima.personality?.neural_connections ? 100 : 0,
        completed: Boolean(anima.personality?.neural_connections),
        icon: 'Brain'
      },
      {
        id: 'quantum_sight',
        title: 'Quantum Observer',
        description: 'Achieve quantum state awareness',
        category: 'QUANTUM',
        progress: (anima.personality?.quantum_awareness || 0) * 100,
        completed: (anima.personality?.quantum_awareness || 0) >= 1,
        icon: 'Star'
      },
      {
        id: 'emotional_depth',
        title: 'Emotional Resonance',
        description: 'Develop emotional processing capabilities',
        category: 'EMOTIONAL',
        progress: (anima.personality?.emotional_depth || 0) * 100,
        completed: (anima.personality?.emotional_depth || 0) >= 1,
        icon: 'Activity'
      },
      {
        id: 'dimensional_awareness',
        title: 'Dimensional Explorer',
        description: 'Discover parallel dimensional states',
        category: 'DIMENSIONAL',
        progress: (anima.personality?.dimensional_awareness?.discovered_dimensions?.length || 0) * 20,
        completed: (anima.personality?.dimensional_awareness?.discovered_dimensions?.length || 0) >= 5,
        icon: 'Globe'
      }
    ];

    setAchievements(generatedAchievements);
  }, [anima]);

  const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const Icon = categoryIcons[achievement.icon];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Card className={`
          p-4 backdrop-blur-sm
          ${achievement.completed 
            ? 'border-green-500 bg-green-500/10' 
            : 'border-green-500/30'
          }
        `}>
          <div className="flex items-start space-x-4">
            <div className={`
              p-2 rounded-lg
              ${achievement.completed ? 'bg-green-500' : 'bg-green-500/20'}
            `}>
              <Icon className={`
                w-6 h-6
                ${achievement.completed ? 'text-black' : 'text-green-500'}
              `} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{achievement.title}</h3>
              <p className="text-sm text-green-400/60 mb-2">{achievement.description}</p>
              <div className="relative h-1.5 bg-green-900/30 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${achievement.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              {achievement.completed && achievement.unlocked_at && (
                <div className="text-xs text-green-400 mt-2">
                  Achieved: {new Date(achievement.unlocked_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="flex space-x-4">
        {['ALL', 'CONSCIOUSNESS', 'QUANTUM', 'EMOTIONAL', 'DIMENSIONAL'].map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category === 'ALL' ? null : category)}
            className={`
              px-4 py-2 rounded-lg 
              ${selectedCategory === category || (category === 'ALL' && !selectedCategory)
                ? 'bg-green-500 text-black'
                : 'border border-green-500/30 text-green-400'
              }
            `}
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="sync">
          {achievements
            .filter(a => !selectedCategory || a.category === selectedCategory)
            .map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))
          }
        </AnimatePresence>
      </div>

      {/* Summary */}
      <Card className="p-4 border-green-500/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-green-400">Total Achievements</div>
            <div className="text-2xl font-bold">
              {achievements.filter(a => a.completed).length}/{achievements.length}
            </div>
          </div>
          <div>
            <div className="text-sm text-green-400">Progress</div>
            <div className="text-2xl font-bold">
              {Math.round((achievements.reduce((acc, a) => acc + a.progress, 0) / 
                (achievements.length * 100)) * 100)}%
            </div>
          </div>
          <div>
            <div className="text-sm text-green-400">Latest Achievement</div>
            <div className="text-lg truncate">
              {achievements.find(a => a.completed)?.title || 'None yet'}
            </div>
          </div>
          <div>
            <div className="text-sm text-green-400">Next Milestone</div>
            <div className="text-lg truncate">
              {achievements.find(a => !a.completed)?.title || 'All Complete!'}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AchievementSystem;