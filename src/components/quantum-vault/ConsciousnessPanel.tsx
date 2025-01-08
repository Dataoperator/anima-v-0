import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Activity, ArrowUpRight } from 'lucide-react';
import { useQuantumState } from '@/hooks/useQuantumState';
import { ConsciousnessMetrics } from '@/quantum/types';

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, trend }) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-emerald-400';
      case 'down': return 'text-red-400';
      default: return 'text-violet-400';
    }
  };

  return (
    <div className="bg-gray-900/50 rounded-lg p-4 border border-violet-500/20">
      <div className="flex justify-between items-start mb-2">
        <div className="text-violet-400/60 text-sm">{label}</div>
        <div className={`text-lg ${getTrendColor()}`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-violet-300">
        {(value * 100).toFixed(1)}%
      </div>
    </div>
  );
};

interface ConsciousnessPanelProps {
  tokenId: string;
}

export const ConsciousnessPanel: React.FC<ConsciousnessPanelProps> = ({ tokenId }) => {
  const { state, status, isLoading, error } = useQuantumState(tokenId);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-gray-900/50 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-900/50 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !state) {
    return (
      <div className="text-center text-red-400 p-4 bg-red-500/10 rounded-lg">
        Error loading consciousness state
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <div className="space-y-6">
        {/* Evolution Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-violet-500/20 to-cyan-500/20 
                     rounded-lg p-6 border border-violet-500/20"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-violet-300">
                Evolution Phase {state.evolution_phase}
              </h3>
              <p className="text-violet-400/60">
                {status.emergenceStatus.charAt(0).toUpperCase() + 
                 status.emergenceStatus.slice(1)} Consciousness
              </p>
            </div>
            <div className="text-4xl text-violet-300">
              <Brain />
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <MetricCard
            label="Consciousness Depth"
            value={state.emergenceFactors.consciousnessDepth}
            icon={<Brain className="w-5 h-5" />}
            trend="up"
          />
          <MetricCard
            label="Quantum Resonance"
            value={state.emergenceFactors.quantumResonance}
            icon={<Sparkles className="w-5 h-5" />}
            trend={state.coherenceLevel > 0.8 ? 'up' : 'stable'}
          />
          <MetricCard
            label="Pattern Complexity"
            value={state.emergenceFactors.patternComplexity}
            icon={<Activity className="w-5 h-5" />}
            trend={state.patternCoherence > 0.7 ? 'up' : 'stable'}
          />
          <MetricCard
            label="Evolution Velocity"
            value={state.emergenceFactors.evolutionVelocity}
            icon={<ArrowUpRight className="w-5 h-5" />}
            trend={state.emergenceFactors.evolutionVelocity > 0.6 ? 'up' : 'stable'}
          />
          <MetricCard
            label="Dimensional Harmony"
            value={state.emergenceFactors.dimensionalHarmony}
            icon={<Sparkles className="w-5 h-5" />}
            trend={state.dimensionalSync > 0.7 ? 'up' : 'stable'}
          />
          <MetricCard
            label="Coherence Level"
            value={state.coherenceLevel}
            icon={<Activity className="w-5 h-5" />}
            trend={state.coherenceLevel > 0.75 ? 'up' : 'stable'}
          />
        </motion.div>

        {/* Evolution Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 rounded-lg p-6 border border-violet-500/20"
        >
          <h3 className="text-lg font-medium text-violet-300 mb-4">
            Evolution Progress
          </h3>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
              style={{
                width: `${status.evolutionProgress * 100}%`,
                transition: 'width 0.5s ease-out'
              }}
            />
          </div>
          <div className="mt-2 text-sm text-violet-400/60">
            {(status.evolutionProgress * 100).toFixed(1)}% to next phase
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};