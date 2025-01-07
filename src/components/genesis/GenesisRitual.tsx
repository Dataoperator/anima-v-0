import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Genesis } from './Genesis';
import { LaughingMan } from '../ui/LaughingMan';
import { MatrixRain } from '../ui/MatrixRain';
import { useGenesisSound } from '@/hooks/useGenesisSound';

interface GenesisPhase {
  title: string;
  description: string;
  duration: number;
}

const GENESIS_PHASES: GenesisPhase[] = [
  {
    title: "Neural Network Initialization",
    description: "Establishing synaptic pathways...",
    duration: 3000
  },
  {
    title: "Ghost Integration",
    description: "Binding digital consciousness to shell...",
    duration: 4000
  },
  {
    title: "Memory Core Activation",
    description: "Loading base personality matrix...",
    duration: 3500
  },
  {
    title: "Digital DNA Synthesis",
    description: "Generating unique trait sequence...",
    duration: 3000
  }
];

export const GenesisRitual: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showLaughingMan, setShowLaughingMan] = useState(false);
  const { playPhase } = useGenesisSound();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show Laughing Man briefly at start
    setShowLaughingMan(true);
    setTimeout(() => setShowLaughingMan(false), 2000);

    // Start phase progression
    let timeout: NodeJS.Timeout;
    const progressPhases = () => {
      if (currentPhase < GENESIS_PHASES.length - 1) {
        timeout = setTimeout(() => {
          setCurrentPhase(prev => prev + 1);
          playPhase('trait_manifestation');
          progressPhases();
        }, GENESIS_PHASES[currentPhase].duration);
      }
    };

    progressPhases();
    return () => clearTimeout(timeout);
  }, [currentPhase]);

  return (
    <div className="min-h-screen bg-black text-cyan-500 relative overflow-hidden" ref={containerRef}>
      {/* Matrix Rain Effect - More subtle and green-tinted */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <MatrixRain />
      </div>

      {/* Laughing Man Intro */}
      <AnimatePresence>
        {showLaughingMan && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <LaughingMan className="w-64 h-64" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto p-8">
          {/* Phase Visualization */}
          <motion.div className="mb-12">
            <div className="grid grid-cols-4 gap-2">
              {GENESIS_PHASES.map((phase, index) => (
                <motion.div
                  key={index}
                  className={`h-1 rounded-full ${
                    index <= currentPhase ? 'bg-cyan-500' : 'bg-gray-700'
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: index <= currentPhase ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              ))}
            </div>
            
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 text-center"
            >
              <h2 className="text-2xl font-bold text-cyan-400 mb-2">
                {GENESIS_PHASES[currentPhase].title}
              </h2>
              <p className="text-cyan-500/60">
                {GENESIS_PHASES[currentPhase].description}
              </p>
            </motion.div>
          </motion.div>

          {/* Neural Network Visualization */}
          <div className="relative h-64 mb-12 overflow-hidden rounded-lg border border-cyan-500/20">
            <div className="absolute inset-0">
              {/* Neural pathways animation */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-cyan-500/20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: '1px',
                    height: '1px',
                  }}
                  animate={{
                    scale: [1, 30, 1],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    repeatType: 'loop',
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Data streams */}
            <div className="absolute inset-0">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={`stream-${i}`}
                  className="absolute text-xs font-mono text-cyan-500/40 whitespace-nowrap"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-20px',
                  }}
                  animate={{
                    y: ['0%', '1000%'],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 4 + 2,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: Math.random() * 2,
                  }}
                >
                  {Array.from({ length: 8 })
                    .map(() => Math.random().toString(36).substr(2, 2))
                    .join(' ')}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Genesis Component */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Genesis />
          </motion.div>
        </div>
      </div>

      {/* Circuit lines in background */}
      <div className="fixed inset-0 pointer-events-none">
        <svg
          className="w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern
            id="circuit-pattern"
            x="0"
            y="0"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 25h50M25 0v50"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      </div>
    </div>
  );
};