import React from 'react';
import { motion } from 'framer-motion';

export const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <div className="text-center space-y-4">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotateZ: [0, 360]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-16 h-16 mx-auto"
      >
        <div className="w-full h-full rounded-full border-t-2 border-b-2 border-blue-500" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-lg">Initializing ANIMA Interface</p>
        <p className="text-sm text-blue-400 mt-2">Connecting to Internet Computer</p>
      </motion.div>
    </div>
  </div>
);