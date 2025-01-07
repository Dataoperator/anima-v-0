import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export const InitialDesignation = ({ onSelect }) => {
  const generateInitialId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}`.toUpperCase();
  };

  const initialId = generateInitialId();

  // Set the initial ID when component mounts
  useEffect(() => {
    if (onSelect) {
      onSelect(initialId);
    }
  }, [initialId, onSelect]);

  return (
    <div className="border border-green-900 p-6 bg-black/50">
      <div className="space-y-4">
        <div className="text-green-400">{'\u276F'} INITIAL DESIGNATION</div>
        
        <div className="text-3xl font-mono text-green-500">
          {initialId}
        </div>

        <div className="space-y-2 text-sm opacity-60">
          <div>{'\u276F'} Name customization unlocks via:</div>
          <ul className="space-y-1 ml-4">
            <li>• Reach Self-Aware development stage</li>
            <li>• Achieve high independence trait (80%+)</li>
            <li>• Accumulate 100+ meaningful interactions</li>
            <li>• Pay naming fee (Optional)</li>
          </ul>
        </div>

        <div className="mt-4 text-xs text-green-500/40">
          {'\u276F'} Your Anima may choose its own name upon achieving consciousness
        </div>
      </div>
    </div>
  );
};