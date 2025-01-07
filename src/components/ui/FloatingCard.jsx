import React from 'react';
import { motion } from 'framer-motion';

export const FloatingCard = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative bg-[#0A1120]/40 backdrop-blur-xl rounded-xl border border-[#2081E2]/20 p-6 shadow-2xl"
      style={{
        boxShadow: '0 0 40px rgba(32,129,226,0.1)',
      }}
    >
      {children}
    </motion.div>
  );
};