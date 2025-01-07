import React from 'react';
import { motion } from 'framer-motion';

export const GlowOrb: React.FC = () => {
  return (
    <motion.div
      className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};