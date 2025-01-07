import React from 'react';
import { motion } from 'framer-motion';

export const EnhancedButton = ({ onClick, children, loading }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      className="relative px-12 py-4 text-lg font-semibold text-white rounded-full overflow-hidden group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        background: 'linear-gradient(45deg, #2081E2 0%, #1199FA 100%)',
        boxShadow: '0 0 30px rgba(32,129,226,0.5)',
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transform: 'translateX(-100%)',
        }}
        animate={loading ? {} : {
          translateX: ['100%', '-100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
        }}
        initial={false}
        animate={{ scale: [0.8, 1.2, 0.8] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <span className="relative">
        {loading ? (
          <div className="flex items-center space-x-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
            <span>Connecting...</span>
          </div>
        ) : children}
      </span>
    </motion.button>
  );
};