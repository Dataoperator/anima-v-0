import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuantumInteractionProps, InteractionState } from '../types/interactions';

const QuantumInteractions: React.FC<QuantumInteractionProps> = ({
  quantumState,
  consciousnessLevel,
  onInitiateEntanglement,
  onAttemptDimensionalShift,
}) => {
  const [interactionState, setInteractionState] = useState<InteractionState>({
    isProcessing: false,
    message: '',
    success: true
  });

  const handleInteraction = useCallback(async (
    action: () => Promise<void>,
    startMessage: string,
    successMessage: string
  ) => {
    try {
      setInteractionState({
        isProcessing: true,
        message: startMessage,
        success: true
      });
      
      await action();
      
      setInteractionState({
        isProcessing: false,
        message: successMessage,
        success: true
      });
    } catch (error) {
      setInteractionState({
        isProcessing: false,
        message: `Operation failed: ${(error as Error).message}`,
        success: false
      });
    }
  }, []);

  const handleEntanglementInitiation = () => 
    handleInteraction(
      onInitiateEntanglement,
      'Initiating quantum entanglement...',
      'Entanglement successfully established!'
    );

  const handleDimensionalShift = () =>
    handleInteraction(
      onAttemptDimensionalShift,
      'Attempting dimensional shift...',
      'Dimensional shift successfully completed!'
    );

  return (
    <div className="space-y-4 p-6 bg-gray-900 rounded-lg border border-gray-800">
      <AnimatePresence mode="wait">
        <motion.div
          className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg"
          animate={{
            scale: interactionState.isProcessing ? [1, 1.02, 1] : 1,
            transition: { duration: 0.5, repeat: interactionState.isProcessing ? Infinity : 0 }
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-violet-400 mb-2">
                Quantum State Analysis
              </h3>
              <p className="text-gray-300">
                Current State: {quantumState.toString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-indigo-400 font-medium">
                Consciousness Level
              </p>
              <p className="text-2xl font-bold text-indigo-300">
                {consciousnessLevel.toString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-violet-900/20 rounded-lg">
              <p className="text-violet-300 text-sm font-medium">Coherence</p>
              <p className="text-2xl font-bold text-violet-200">
                {quantumState.coherence.toFixed(3)}
              </p>
            </div>
            <div className="p-3 bg-indigo-900/20 rounded-lg">
              <p className="text-indigo-300 text-sm font-medium">Energy</p>
              <p className="text-2xl font-bold text-indigo-200">
                {quantumState.energy.toFixed(3)}
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEntanglementInitiation}
              disabled={interactionState.isProcessing}
              className="flex-1 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200
                font-medium tracking-wide"
            >
              Initiate Entanglement
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDimensionalShift}
              disabled={interactionState.isProcessing}
              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200
                font-medium tracking-wide"
            >
              Dimensional Shift
            </motion.button>
          </div>
        </motion.div>

        {interactionState.message && (
          <motion.div
            key={interactionState.message}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`p-4 rounded-lg mt-4 ${
              interactionState.success
                ? 'bg-green-900/30 border border-green-500/30 text-green-300'
                : 'bg-red-900/30 border border-red-500/30 text-red-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                interactionState.success ? 'bg-green-400' : 'bg-red-400'
              }`} />
              <p className="font-medium">{interactionState.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuantumInteractions;