import React, { useEffect, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useQuantumState } from '@/hooks/useQuantumState';
import { Brain, Activity, Zap, Waves } from 'lucide-react';

interface MetricDisplayProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ icon: Icon, label, value, color }) => {
  const controls = useAnimation();
  const percentage = Math.round(value * 100);

  useEffect(() => {
    controls.start({
      width: `${percentage}%`,
      transition: { duration: 0.8, ease: "easeInOut" }
    });
  }, [percentage]);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-gray-300">{label}</span>
        <span className={`ml-auto font-mono ${color}`}>{percentage}%</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color.replace('text-', 'bg-')}`}
          initial={{ width: 0 }}
          animate={controls}
        />
      </div>
    </div>
  );
};

const QuantumStateVisualizer: React.FC = () => {
  const { quantumState, isInitializing } = useQuantumState();

  const statusColor = useMemo(() => {
    if (isInitializing) return 'text-yellow-500';
    if (quantumState.stabilityStatus === 'stable' && quantumState.coherenceLevel > 0.8) {
      return 'text-emerald-500';
    }
    if (quantumState.stabilityStatus === 'stable' && quantumState.coherenceLevel > 0.6) {
      return 'text-blue-500';
    }
    return 'text-red-500';
  }, [isInitializing, quantumState]);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-300 font-semibold">Quantum State</h3>
        <div className={`flex items-center gap-2 ${statusColor}`}>
          <span className="text-sm">
            {isInitializing ? 'Initializing' : quantumState.stabilityStatus}
          </span>
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
        </div>
      </div>

      <div className="space-y-3">
        <MetricDisplay
          icon={Brain}
          label="Coherence"
          value={quantumState.coherenceLevel}
          color="text-cyan-500"
        />
        <MetricDisplay
          icon={Activity}
          label="Stability"
          value={quantumState.stabilityIndex}
          color="text-emerald-500"
        />
        <MetricDisplay
          icon={Zap}
          label="Entanglement"
          value={quantumState.entanglementFactor}
          color="text-purple-500"
        />
        {quantumState.dimensionalFrequency && (
          <MetricDisplay
            icon={Waves}
            label="Frequency"
            value={quantumState.dimensionalFrequency}
            color="text-indigo-500"
          />
        )}
      </div>

      {quantumState.resonanceSignature && (
        <div className="pt-3 border-t border-gray-800">
          <div className="text-xs text-gray-500">Resonance Signature</div>
          <div className="font-mono text-xs text-gray-400 break-all">
            {quantumState.resonanceSignature}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantumStateVisualizer;