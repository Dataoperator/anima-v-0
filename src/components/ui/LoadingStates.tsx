import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LaughingMan } from './LaughingMan';

interface LoadingProps {
  message?: string;
}

export const QuantumLoadingState: React.FC<LoadingProps> = ({ 
  message = "Initializing Quantum State..." 
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Quantum grid effect */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-blue-500/20"
              style={{
                left: `${i * 5}%`,
                height: '100%'
              }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                height: ['0%', '100%', '0%']
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="relative z-10 space-y-8 text-center">
          <LaughingMan className="w-24 h-24 mx-auto" />
          
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-blue-400">{message}</h2>
            
            <div className="flex justify-center space-x-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full bg-blue-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Quantum waves */}
          <motion.div
            className="w-64 h-16 mx-auto relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0) 100%)'
            }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border-t border-blue-500/30"
                animate={{
                  y: [0, 16, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Quantum flicker effect */}
        <motion.div
          className="absolute inset-0 bg-blue-500/5"
          animate={{
            opacity: [0, 0.2, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

// Re-export the base Loading component if needed elsewhere
export { Loading } from '../layout/Loading';