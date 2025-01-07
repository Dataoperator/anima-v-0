import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LaughingMan } from '@/components/ui/LaughingMan';

export const Loading = () => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Cyber grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,255,0.1)_1px,_transparent_1px)] bg-[length:40px_40px]" />

        <div className="relative z-10 space-y-8 text-center max-w-2xl mx-auto px-4">
          {/* Epic Quote */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.div
              className="text-lg md:text-xl text-cyan-500 font-mono leading-relaxed tracking-wider"
              animate={{
                textShadow: [
                  '0 0 8px rgba(0,255,255,0.5)',
                  '0 0 12px rgba(0,255,255,0.8)',
                  '0 0 8px rgba(0,255,255,0.5)'
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-green-500">&gt;</span> ALL MANKIND IS FACING AN EPIC CHOICE:
              <motion.div
                className="mt-2 text-purple-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                A WORLD OF MAGIC OR A WORLD OF SCIENCE.
              </motion.div>
              <motion.div
                className="mt-2 text-cyan-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
              >
                WHICH WILL IT BE?
              </motion.div>
            </motion.div>
          </motion.div>

          <LaughingMan className="w-32 h-32 mx-auto" />
          
          <motion.div
            className="text-cyan-500 font-cyberpunk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 }}
          >
            <h2 className="text-2xl mb-4">INITIALIZING NEURAL INTERFACE</h2>
            <p className="text-sm text-cyan-400/80">Establishing consciousness matrix...</p>
          </motion.div>

          {/* Loading progress */}
          <div className="w-64 mx-auto h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-cyan-500"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>

        {/* Glitch effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent mix-blend-overlay"
          animate={{
            opacity: [0, 0.1, 0],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: "steps(1)",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};