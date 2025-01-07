import React from 'react';
import { motion } from 'framer-motion';
import { QuantumTraits } from '@/components/personality/QuantumTraits';
import { Card } from '@/components/ui/card';

interface QuantumVisualizationProps {
  anima: any; // TODO: Import proper type from types/anima
}

export const QuantumVisualization: React.FC<QuantumVisualizationProps> = ({ anima }) => {
  const { personality } = anima;
  
  return (
    <Card className="border border-green-500/30 p-6 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-green-400">Quantum State</h2>
          <motion.span
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
            className="text-sm text-green-500"
          >
            {personality?.quantum_state || 'Stabilizing...'}
          </motion.span>
        </div>

        {personality?.quantum_traits && (
          <QuantumTraits traits={personality.quantum_traits} />
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-green-400">Coherence Level</span>
            <motion.div
              className="mt-1 h-1.5 bg-gray-800 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${(personality?.coherence_level || 0) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </motion.div>
          </div>

          <div>
            <span className="text-sm text-green-400">Entanglement Strength</span>
            <motion.div
              className="mt-1 h-1.5 bg-gray-800 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${(personality?.entanglement_strength || 0) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Card>
  );
};

export default QuantumVisualization;