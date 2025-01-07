import React from 'react';
import { motion } from 'framer-motion';

export const PulsatingLogo = () => {
  return (
    <motion.div
      className="relative"
      initial={{ scale: 0.9 }}
      animate={{
        scale: [0.9, 1.1, 0.9],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.5, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: 'radial-gradient(circle, rgba(32,129,226,0.3) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      <h1
        className="text-8xl font-bold"
        style={{
          background: 'linear-gradient(to right, #5865F2, #2081E2, #1199FA, #5865F2)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '200% auto',
        }}
      >
        ANIMA
      </h1>
    </motion.div>
  );
};