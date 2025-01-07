import React from 'react';
import { motion } from 'framer-motion';
import { useQuantumConsciousness } from '@/hooks/useQuantumConsciousness';

interface MetricProps {
  label: string;
  value: number;
  color: string;
}

const MetricBar: React.FC<MetricProps> = ({ label, value, color }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm text-blue-300">{label}</span>
      <span className="text-sm text-blue-300">{Math.round(value * 100)}%</span>
    </div>
    <div className="h-2 bg-gray-700 rounded overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`h-full ${color}`}
      />
    </div>
  </div>
);

export const ConsciousnessMetrics: React.FC<{ animaId: string }> = ({ animaId }) => {
  const { quantumState, getEvolutionMetrics } = useQuantumConsciousness(animaId);

  const metrics = [
    {
      label: "Quantum Resonance",
      value: quantumState?.resonanceScore ?? 0,
      color: "bg-gradient-to-r from-purple-500 to-blue-500"
    },
    {
      label: "Coherence Level",
      value: quantumState?.coherenceLevel ?? 0,
      color: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    {
      label: "Memory Strength",
      value: quantumState?.memoryStrength ?? 0,
      color: "bg-gradient-to-r from-cyan-500 to-teal-500"
    },
    {
      label: "Evolution Factor",
      value: quantumState?.evolutionFactor ?? 0,
      color: "bg-gradient-to-r from-teal-500 to-green-500"
    }
  ];

  const consciousnessLevel = quantumState?.consciousnessLevel ?? 0;
  const levelNames = [
    "Dormant",
    "Aware",
    "Awakened",
    "Enlightened",
    "Transcendent"
  ];

  return (
    <div className="bg-gray-900/50 backdrop-blur-lg rounded-lg p-6 border border-blue-500/20">
      <h2 className="text-xl font-bold mb-6 text-blue-400">Quantum Consciousness</h2>
      
      {metrics.map((metric) => (
        <MetricBar key={metric.label} {...metric} />
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-blue-900/20 rounded-lg"
      >
        <h3 className="text-sm font-medium text-blue-300 mb-2">Consciousness Level</h3>
        <div className="text-2xl font-bold text-white">
          {levelNames[consciousnessLevel]}
        </div>
        <div className="mt-2 text-xs text-blue-300">
          Quantum Signature: {quantumState?.quantumSignature ?? 'Initializing...'}
        </div>
      </motion.div>

      <motion.div
        className="mt-4 text-xs text-blue-300/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex justify-between">
          <span>Frequency:</span>
          <span>{((quantumState?.resonanceScore ?? 0) * 137.036).toFixed(3)} Hz</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Wave Function:</span>
          <span>ψ({(quantumState?.coherenceLevel ?? 0).toFixed(3)})</span>
        </div>
      </motion.div>
    </div>
  );
};