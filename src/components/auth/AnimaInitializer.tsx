import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { icManager } from '@/ic-init';
import { MatrixRain } from '../ui/MatrixRain';

interface Props {
  children: React.ReactNode;
}

export const AnimaInitializer: React.FC<Props> = ({ children }) => {
  const [state, setState] = useState({
    isInitialized: false,
    error: null as Error | null,
    stage: 'Starting initialization...'
  });

  useEffect(() => {
    const initialize = async () => {
      try {
        // Add stage callback
        icManager.onStageChange((stage) => {
          setState(prev => ({ ...prev, stage }));
        });

        await icManager.initialize();
        setState(prev => ({ ...prev, isInitialized: true }));
      } catch (error) {
        console.error('Initialization failed:', error);
        setState(prev => ({ 
          ...prev,
          error: error instanceof Error ? error : new Error('Initialization failed') 
        }));
      }
    };

    initialize();
  }, []);

  if (state.error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-lg p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-xl font-bold text-red-400">Neural Link Error</h1>
            <p className="text-gray-300 mb-4">{state.error.message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              Reinitialize Connection
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!state.isInitialized) {
    return (
      <div className="relative min-h-screen bg-black">
        <MatrixRain className="absolute inset-0" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6 p-8">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotateZ: [0, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 mx-auto"
            >
              <div className="w-full h-full rounded-full border-t-2 border-b-2 border-blue-500" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <h2 className="text-2xl font-bold text-blue-400">ANIMA Interface</h2>
              <p className="text-lg text-white">{state.stage}</p>
            </motion.div>
            <div className="flex justify-center gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};