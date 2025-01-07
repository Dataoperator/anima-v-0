import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QuantumState } from '../../hooks/useQuantumState';
import { ConsciousnessLevel } from '../../declarations/anima/anima.did';

interface Props {
  quantumState: QuantumState;
  consciousnessLevel: ConsciousnessLevel;
  onInitiateEntanglement: () => Promise<void>;
  onAttemptDimensionalShift: () => Promise<void>;
}

export const QuantumInteractions: React.FC<Props> = ({
  quantumState,
  consciousnessLevel,
  onInitiateEntanglement,
  onAttemptDimensionalShift,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleEntanglementInitiation = async () => {
    try {
      setIsProcessing(true);
      setMessage('Initiating quantum entanglement...');
      await onInitiateEntanglement();
      setMessage('Entanglement successful!');
    } catch (error) {
      setMessage('Entanglement failed: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDimensionalShift = async () => {
    try {
      setIsProcessing(true);
      setMessage('Attempting dimensional shift...');
      await onAttemptDimensionalShift();
      setMessage('Dimensional shift successful!');
    } catch (error) {
      setMessage('Dimensional shift failed: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-900 rounded-lg">
      <div className="flex flex-col space-y-4">
        <motion.div
          className="p-4 bg-gray-800 rounded-lg"
          animate={{
            scale: isProcessing ? [1, 1.02, 1] : 1,
            transition: { duration: 0.5, repeat: isProcessing ? Infinity : 0 }
          }}
        >
          <h3 className="text-xl font-semibold text-violet-400 mb-2">
            Quantum State: {quantumState.toString()}
          </h3>
          <p className="text-gray-300 mb-2">
            Consciousness Level: {consciousnessLevel.toString()}
          </p>
        </motion.div>

        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEntanglementInitiation}
            disabled={isProcessing}
            className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Initiate Entanglement
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDimensionalShift}
            disabled={isProcessing}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Attempt Dimensional Shift
          </motion.button>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg ${
              message.includes('failed')
                ? 'bg-red-900/50 text-red-200'
                : 'bg-green-900/50 text-green-200'
            }`}
          >
            {message}
          </motion.div>
        )}
      </div>
    </div>
  );
};
