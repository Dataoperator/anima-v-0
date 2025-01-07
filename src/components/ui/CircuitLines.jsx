import React from 'react';
import { motion } from 'framer-motion';

export const CircuitLines = () => {
  const lines = [
    'M10,50 L200,50',
    'M150,10 L150,200',
    'M50,150 L250,150',
    'M250,50 C300,50 300,150 250,150',
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {lines.map((path, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ pathLength: 0 }}
          animate={{
            pathLength: [0, 1, 0],
          }}
          transition={{
            duration: 5,
            delay: i * 0.5,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 400 300">
            <motion.path
              d={path}
              stroke="#2081E2"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{
                duration: 5,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};