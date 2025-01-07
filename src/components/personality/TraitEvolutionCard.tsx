import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowUpCircle, Zap, Sparkles } from 'lucide-react';

interface TraitEvolutionCardProps {
  trait: {
    trait: string;
    previousValue: number;
    newValue: number;
    growthFactor: number;
  };
  delay?: number;
}

export const TraitEvolutionCard: React.FC<TraitEvolutionCardProps> = ({
  trait,
  delay = 0
}) => {
  const getTraitIcon = () => {
    switch (trait.trait.toLowerCase()) {
      case 'consciousness':
      case 'wisdom':
        return <Brain className="w-5 h-5" />;
      case 'energy':
      case 'power':
        return <Zap className="w-5 h-5" />;
      case 'resonance':
      case 'harmony':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <ArrowUpCircle className="w-5 h-5" />;
    }
  };

  const increase = trait.newValue - trait.previousValue;
  const percentageIncrease = ((increase / trait.previousValue) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-full bg-violet-500/20 text-violet-400">
            {getTraitIcon()}
          </div>
          <h3 className="text-violet-300 font-medium">{trait.trait}</h3>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.3, type: "spring" }}
          className="text-violet-400 text-sm font-medium"
        >
          +{percentageIncrease}%
        </motion.div>
      </div>

      <div className="relative h-2 bg-black/40 rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: `${trait.previousValue * 100}%` }}
          animate={{ width: `${trait.newValue * 100}%` }}
          transition={{ delay: delay + 0.2, duration: 1, type: "spring" }}
          className="absolute inset-y-0 left-0 bg-violet-500/40"
        />
        <div
          className="absolute inset-y-0 bg-violet-500/20"
          style={{ width: `${trait.previousValue * 100}%` }}
        />
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-violet-400/60">Previous: {(trait.previousValue * 100).toFixed(1)}%</span>
        <span className="text-violet-400">New: {(trait.newValue * 100).toFixed(1)}%</span>
      </div>

      {trait.growthFactor > 1.2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
          className="mt-2 text-xs text-violet-300/80 flex items-center space-x-1"
        >
          <Sparkles className="w-3 h-3" />
          <span>Exceptional Growth Rate: {((trait.growthFactor - 1) * 100).toFixed(0)}%</span>
        </motion.div>
      )}
    </motion.div>
  );
};
