import React from 'react';
import { motion } from 'framer-motion';

const TraitBar = ({ trait, value }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-foreground">{trait}</span>
      <span className="text-sm font-medium text-muted-foreground">{value.toFixed(2)}</span>
    </div>
    <div className="w-full bg-secondary rounded-full h-2.5">
      <motion.div
        className="bg-primary h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  </div>
);

const PersonalityTraits = ({ traits = [], className = "" }) => {
  if (!traits.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card text-card-foreground p-6 rounded-lg shadow-md ${className}`}
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Personality Traits</h3>
      <div className="space-y-4">
        {traits.map(([trait, value]) => (
          <TraitBar key={trait} trait={trait} value={value} />
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-2">Learning Progress</h4>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Beginner</span>
          <span>Intermediate</span>
          <span>Advanced</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalityTraits;