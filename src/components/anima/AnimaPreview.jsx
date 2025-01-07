import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    const chars = '01010111001アカサタナハマヤャラワ'.split('');
    const streams = [];
    const streamCount = Math.floor(width / 20);

    for (let i = 0; i < streamCount; i++) {
      streams.push({
        x: i * 20,
        y: Math.random() * height,
        speed: Math.random() * 2 + 1,
        chars: []
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#0f0';
      ctx.font = '15px monospace';

      streams.forEach(stream => {
        stream.y += stream.speed;
        if (stream.y > height) {
          stream.y = 0;
          stream.chars = [];
        }

        if (Math.random() < 0.1) {
          stream.chars.unshift(chars[Math.floor(Math.random() * chars.length)]);
        }
        if (stream.chars.length > 20) stream.chars.pop();

        stream.chars.forEach((char, i) => {
          const alpha = 1 - (i * 0.1);
          ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
          ctx.fillText(char, stream.x, stream.y - i * 20);
        });
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 opacity-10 pointer-events-none"
    />
  );
};

const SHELL_TYPES = {
  SENTINEL: { rarity: 0.995, type: 'Ghost-type consciousness' },
  SPECTRE: { rarity: 0.95, type: 'Neural network architect' },
  GHOST: { rarity: 0.90, type: 'Digital entity' },
};

const getShellIdentifier = (metadata) => {
  if (metadata.generation === 0) return 'α-SHELL';
  if (metadata.generation === 1) return 'β-GHOST';
  return `SHELL.${metadata.generation || '?'}`;
};

const getRarityClass = (rarity) => {
  if (rarity > 0.99) return 'text-green-400 font-bold tracking-wider';
  if (rarity > 0.95) return 'text-emerald-400 tracking-wide';
  if (rarity > 0.90) return 'text-green-400/80';
  return 'text-green-500/60';
};

export const AnimaPreview = ({ anima }) => {
  const {
    id,
    metadata,
    genesis_traits = [],
    designation = 'INITIALIZING...',
    genesis_timestamp,
    token_data
  } = anima;

  const coreTraits = genesis_traits
    .filter(trait => trait.rarity >= 0.80)
    .sort((a, b) => b.rarity - a.rarity);

  return (
    <motion.div 
      className="relative bg-black/90 border border-green-900/30 p-6 rounded-sm overflow-hidden h-[360px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MatrixRain />

      {/* System Boot Sequence */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none"
        />
      </AnimatePresence>

      {/* Header with Ghost in the Shell inspired glitch */}
      <motion.div 
        className="relative mb-6 border-b border-green-900/30 pb-4"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-green-500/60 font-mono mb-1"
        >
          SHELL.IDENTIFICATION
        </motion.div>

        <motion.h2 
          className="text-xl font-mono tracking-wider text-green-400 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {designation}
          <motion.span
            className="absolute inset-0 bg-green-500/20"
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 5
            }}
          />
        </motion.h2>

        <motion.div 
          className="text-sm text-green-400/60 mt-2 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {getShellIdentifier(metadata)}
        </motion.div>
      </motion.div>

      {/* Core Data with Animatrix-style animation */}
      <motion.div 
        className="relative space-y-3 text-sm font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex justify-between items-center">
          <span className="text-green-500/60">ID:</span>
          <motion.span 
            className="text-green-400"
            whileHover={{ 
              scale: 1.05,
              textShadow: "0 0 8px rgba(0, 255, 0, 0.5)"
            }}
          >
            {id.toString().slice(0, 8)}...
          </motion.span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-green-500/60">GENESIS:</span>
          <span className="text-green-400">
            {new Date(Number(genesis_timestamp)).toLocaleDateString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-green-500/60">NET.ID:</span>
          <span className="text-green-400">#{token_data?.index || '---'}</span>
        </div>
      </motion.div>

      {/* Traits with Ghost in the Shell inspired visualization */}
      {coreTraits.length > 0 && (
        <motion.div 
          className="mt-6 pt-4 border-t border-green-900/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="space-y-2">
            {coreTraits.map((trait, index) => (
              <motion.div 
                key={index}
                className="flex justify-between items-center text-sm font-mono"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.7 }}
              >
                <motion.span 
                  className={getRarityClass(trait.rarity)}
                  whileHover={{
                    textShadow: "0 0 8px rgba(0, 255, 0, 0.5)",
                    transition: { duration: 0.2 }
                  }}
                >
                  {trait.name}
                </motion.span>
                <motion.div 
                  className="flex items-center space-x-2"
                  animate={{ 
                    opacity: [0.6, 1, 0.6] 
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {trait.rarity > 0.99 && (
                    <span className="text-green-400/60 text-xs">[RARE]</span>
                  )}
                  {trait.rarity > 0.95 && (
                    <span className="text-green-400/60 text-xs">[SPEC]</span>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Scan Line Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          backgroundPosition: ['0 0', '0 100%']
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundSize: '100% 3px',
          backgroundImage: 'linear-gradient(0deg, transparent 0%, rgba(0, 255, 0, 0.1) 50%, transparent 100%)'
        }}
      />
    </motion.div>
  );
};

export default AnimaPreview;