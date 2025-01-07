import React from 'react';
import { motion } from 'framer-motion';

export const GlowOrb = ({ phase }) => {
  const getOrbColors = () => {
    switch (phase) {
      case 'initiation':
        return ['#2081E2', '#1199FA'];
      case 'consciousness_emergence':
        return ['#7B61FF', '#2081E2'];
      case 'trait_manifestation':
        return ['#2081E2', '#00FF9D'];
      case 'quantum_alignment':
        return ['#7B61FF', '#FF61DC'];
      case 'birth':
        return ['#2081E2', '#FF61DC', '#00FF9D'];
      default:
        return ['#2081E2', '#1199FA'];
    }
  };

  const getAnimationVariants = () => {
    switch (phase) {
      case 'consciousness_emergence':
        return {
          animate: {
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
            transition: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        };
      case 'quantum_alignment':
        return {
          animate: {
            rotate: 360,
            scale: [1, 1.1, 1],
            transition: {
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }
          }
        };
      case 'birth':
        return {
          animate: {
            scale: [1, 2, 1],
            opacity: [0.7, 1, 0.7],
            transition: {
              duration: 4,
              repeat: 1,
              ease: "easeInOut"
            }
          }
        };
      default:
        return {
          animate: {
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6],
            transition: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }
        };
    }
  };

  const colors = getOrbColors();
  const variants = getAnimationVariants();

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={variants.animate}
        className="relative"
      >
        {colors.map((color, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
              filter: 'blur(30px)',
              transform: `scale(${1 + index * 0.2})`,
              opacity: 0.3,
            }}
          />
        ))}
        <div
          className="w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors[0]}10 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
        />
      </motion.div>
    </div>
  );
};