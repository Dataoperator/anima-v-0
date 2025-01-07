import React from 'react';
import { motion } from 'framer-motion';

interface FloatingCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  children,
  delay = 0,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        type: "spring",
        stiffness: 100
      }}
      className={`relative bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20 ${className}`}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <motion.div
          className="absolute inset-0 border border-blue-500/20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>
    </motion.div>
  );
};