import React from 'react';
import { motion } from 'framer-motion';

export const LoadingFallback: React.FC = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed top-4 right-4 bg-black/80 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 z-50"
  >
    <div className="flex items-center space-x-3">
      <motion.div
        animate={{ 
          rotateZ: [0, 360]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        className="w-4 h-4"
      >
        <div className="w-full h-full rounded-full border-t border-b border-blue-500" />
      </motion.div>
      <span className="text-sm text-blue-400">Initializing...</span>
    </div>
  </motion.div>
);