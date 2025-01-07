import React from 'react';
import { motion } from 'framer-motion';

export const PulsatingLogo: React.FC = () => {
  return (
    <motion.div
      className="relative w-32 h-32 mx-auto"
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Outer Ring */}
      <motion.div
        className="absolute inset-0 border-2 border-blue-500/50 rounded-full"
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      />
      
      {/* Inner Ring */}
      <motion.div
        className="absolute inset-4 border-2 border-purple-500/50 rounded-full"
        animate={{
          rotate: -360,
          scale: [1, 0.9, 1],
        }}
        transition={{
          rotate: {
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }
        }}
      />
      
      {/* Core */}
      <motion.div
        className="absolute inset-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full backdrop-blur-sm"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
          A
        </div>
      </motion.div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl" />
    </motion.div>
  );
};