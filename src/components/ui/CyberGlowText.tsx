import React from 'react';
import { motion } from 'framer-motion';

interface CyberGlowTextProps {
  children: React.ReactNode;
  className?: string;
}

export const CyberGlowText: React.FC<CyberGlowTextProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Text shadow layers for glow effect */}
      <div className="absolute inset-0 blur-[2px] text-cyan-400/50">{children}</div>
      <div className="absolute inset-0 blur-[4px] text-cyan-400/30">{children}</div>
      <div className="absolute inset-0 blur-[6px] text-cyan-400/20">{children}</div>
      
      {/* Main text */}
      <div className="relative text-cyan-300">{children}</div>
      
      {/* Animated glow effect */}
      <motion.div
        className="absolute inset-0 text-cyan-400/20"
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default CyberGlowText;