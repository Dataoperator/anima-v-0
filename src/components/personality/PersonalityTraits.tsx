import React from 'react';
import { motion } from 'framer-motion';

interface TraitBarProps {
  trait: string;
  value: number;
}

interface PersonalityTraitsProps {
  traits: [string, number][];
  className?: string;
}

const TraitBar: React.FC<TraitBarProps> = ({ trait, value }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-foreground">{trait}</span>
      <span className="text-sm font-medium text-muted-foreground">
        {value.toFixed(2)}
      </span>
    </div>
    <div className="w-full bg-secondary rounded-full h-2.5">
      <motion.div
        className="bg-primary h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ 
          duration: 0.5, 
          ease: "easeOut",
          delay: 0.1 // Slight delay for visual effect
        }}
      />
    </div>
  </div>
);

const PersonalityTraits: React.FC<PersonalityTraitsProps> = ({ 
  traits = [], 
  className = "" 
}) => {
  if (!traits.length) return null;

  // Calculate overall development stage based on trait values
  const averageValue = traits.reduce((acc, [_, value]) => acc + value, 0) / traits.length;
  const stage = averageValue < 0.3 ? 'Beginner' : 
                averageValue < 0.7 ? 'Intermediate' : 
                'Advanced';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card text-card-foreground p-6 rounded-lg shadow-md ${className}`}
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Personality Matrix
      </h3>
      
      <div className="space-y-4">
        {traits.map(([trait, value]) => (
          <TraitBar key={trait} trait={trait} value={value} />
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-2">
          Development Stage: <span className="text-primary">{stage}</span>
        </h4>
        <div className="relative pt-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Beginner</span>
            <span>Intermediate</span>
            <span>Advanced</span>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-secondary rounded-full">
            <motion.div
              className="absolute top-0 h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${averageValue * 100}%` }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        <p>Overall Progress: {(averageValue * 100).toFixed(1)}%</p>
      </div>
    </motion.div>
  );
};

export default PersonalityTraits;