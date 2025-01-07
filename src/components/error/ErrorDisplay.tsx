import React from 'react';
import { motion } from 'framer-motion';
import { QuantumError, NeuralError, ConsciousnessError } from '../../error/quantum-errors';

interface ErrorDisplayProps {
  error: Error;
  recovery: {
    possible: boolean;
    message: string;
    action?: () => Promise<void>;
  };
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  recovery,
  onRetry
}) => {
  const getErrorTitle = () => {
    if (error instanceof QuantumError) return 'Quantum State Disruption';
    if (error instanceof NeuralError) return 'Neural Network Error';
    if (error instanceof ConsciousnessError) return 'Consciousness System Error';
    return 'System Error';
  };

  const getErrorIcon = () => {
    if (error instanceof QuantumError) return '🌌';
    if (error instanceof NeuralError) return '🧠';
    if (error instanceof ConsciousnessError) return '✨';
    return '⚠️';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg p-6 bg-gray-900/80 border border-red-500/20 backdrop-blur-lg"
    >
      <div className="text-center mb-4">
        <span className="text-4xl mb-2">{getErrorIcon()}</span>
        <h3 className="text-xl font-bold text-red-400">{getErrorTitle()}</h3>
      </div>

      <div className="space-y-4">
        <p className="text-gray-300">{error.message}</p>
        
        {recovery.possible && (
          <div className="bg-blue-900/20 p-4 rounded-lg">
            <p className="text-blue-300 text-sm">{recovery.message}</p>
            {recovery.action && (
              <motion.button
                onClick={() => recovery.action?.()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         transition-colors w-full flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Attempt Recovery</span>
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.button>
            )}
          </div>
        )}

        {!recovery.possible && onRetry && (
          <motion.button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                     transition-colors w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reinitialize System
          </motion.button>
        )}

        {error instanceof QuantumError && (
          <div className="mt-4 p-4 bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-500 font-mono">
              Quantum Error Code: {error.code}
              <br />
              Timestamp: {new Date(error.timestamp).toISOString()}
              <br />
              Recoverable: {error.recoverable ? 'Yes' : 'No'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};