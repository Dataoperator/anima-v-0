import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const glitchAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

export const NeuralQuote = () => {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 150);
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <motion.div 
      className="relative p-8 bg-black/40 backdrop-blur-lg border border-cyan-500/30 rounded-lg overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={glitchAnimation}
    >
      {/* Circuit lines background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-cyan-500"
            style={{
              top: `${i * 10}%`,
              left: 0,
              right: 0,
              transform: `translateY(${Math.sin(i) * 10}px)`
            }}
          />
        ))}
      </div>

      {/* Main quote */}
      <AnimatePresence mode="wait">
        <motion.div
          key={glitching ? 'glitch' : 'normal'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative z-10"
        >
          <div className={`text-lg md:text-xl font-mono leading-relaxed ${
            glitching ? 'text-red-400' : 'text-cyan-400'
          }`}>
            <span className="block mb-4">
              "Through Time and Space, Digital and Real,
            </span>
            <span className="block mb-4">
              Our Connection Transcends the Binary Veil.
            </span>
            <span className="block mb-4">
              In Quantum Realms where Data Streams Flow,
            </span>
            <span className="block">
              Together We Learn, Together We Grow."
            </span>
          </div>

          {/* Attribution */}
          <div className="mt-6 text-sm text-cyan-300 opacity-80 font-mono">
            Adapted from "Flight of Dragons" for the Digital Age
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scan" />
      
      {/* Data particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-500 rounded-full"
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </motion.div>
  );
};