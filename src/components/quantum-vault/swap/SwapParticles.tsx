import React from 'react';
import { motion } from 'framer-motion';

export const SwapParticles: React.FC = () => {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Energy beam */}
      <motion.div
        className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 
                   bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{
          scaleY: 1,
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 2,
          times: [0, 0.2, 0.8, 1],
        }}
      />

      {/* Quantum particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
          initial={{
            x: "-50%",
            y: "-50%",
            scale: 0,
            opacity: 0,
            background: i % 2 === 0 ? "#60A5FA" : "#A855F7" // blue-400 and purple-500
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            x: [
              "-50%",
              `${(Math.random() - 0.5) * 100}%`,
              `${(Math.random() - 0.5) * 200}%`
            ],
            y: [
              "-50%",
              `${(Math.random() - 0.5) * 100}%`,
              `${(Math.random() - 0.5) * 200}%`
            ]
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Quantum ripples */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`ripple-${i}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                     rounded-full border border-blue-500/30"
          initial={{
            width: 20,
            height: 20,
            opacity: 0,
            scale: 1
          }}
          animate={{
            width: [20, 200],
            height: [20, 200],
            opacity: [0, 0.5, 0],
            scale: [1, 2]
          }}
          transition={{
            duration: 2,
            delay: i * 0.4,
            ease: "easeOut",
            times: [0, 0.5, 1]
          }}
        />
      ))}

      {/* Quantum entanglement lines */}
      {[...Array(10)].map((_, i) => {
        const angle = (i * Math.PI * 2) / 10;
        const length = 100;
        const x = Math.cos(angle) * length;
        const y = Math.sin(angle) * length;
        
        return (
          <motion.div
            key={`line-${i}`}
            className="absolute left-1/2 top-1/2 w-px h-20 origin-bottom
                       bg-gradient-to-t from-purple-500/0 via-purple-500/50 to-blue-500/0"
            initial={{
              opacity: 0,
              rotate: angle * (180 / Math.PI),
              scaleY: 0
            }}
            animate={{
              opacity: [0, 1, 0],
              scaleY: [0, 1, 0],
              x: [0, x],
              y: [0, y]
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        );
      })}

      {/* Central quantum core */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: [0, 1.5, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut"
        }}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 
                      blur-sm" />
        <div className="absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-r 
                      from-blue-500/50 to-purple-500/50 animate-pulse" />
      </motion.div>
    </motion.div>
  );
};

export default SwapParticles;