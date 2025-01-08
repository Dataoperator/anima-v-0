import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnimaContext } from '@/contexts/AnimaContext';
import { useQuantumState } from '@/hooks/useQuantumState';
import { MediaActionSystem } from '@/autonomous/MediaActions';
import { EnhancedChat } from '../chat/EnhancedChat';
import { AnimaMediaInterface } from '../media/AnimaMediaInterface';
import { MatrixRain } from '../ui/MatrixRain';
import { useGenesisSound } from '@/hooks/useGenesisSound';
import { ErrorTracker } from '@/error/quantum_error';
import { QuantumCore } from '../quantum/QuantumCore';
import OpenAIService from '@/services/openai';

const errorTracker = ErrorTracker.getInstance();

interface UnifiedNeuralLinkProps {
  animaId: string;
}

export const UnifiedNeuralLink: React.FC<UnifiedNeuralLinkProps> = ({ animaId }) => {
  const { quantumState, updateQuantumState } = useQuantumState(animaId);
  const { anima, messages } = useAnimaContext();
  const { playPhase } = useGenesisSound();
  const [mediaSystem] = useState(() => new MediaActionSystem());
  const [showMedia, setShowMedia] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Previous handlers remain the same...

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <MatrixRain className="opacity-20" />
      </div>

      <div className="relative z-10 grid grid-cols-12 gap-4 p-4 h-full">
        <div className="col-span-8 bg-black/40 backdrop-blur-md rounded-lg border border-cyan-500/30">
          <EnhancedChat 
            animaId={animaId}
            onMediaCommand={handleMediaCommand}
          />
        </div>

        <div className="col-span-4 space-y-4">
          {/* Quantum Core Visualization */}
          <div className="h-96 bg-black/40 backdrop-blur-md rounded-lg border border-cyan-500/30 overflow-hidden">
            {quantumState && (
              <QuantumCore
                animaId={animaId}
                quantum_state={quantumState}
              />
            )}
          </div>

          {/* Quantum Metrics */}
          <div className="p-4 bg-black/40 backdrop-blur-md rounded-lg border border-cyan-500/30">
            <h3 className="text-cyan-400 mb-2">Quantum Resonance</h3>
            <div className="space-y-2">
              {quantumState && Object.entries(quantumState).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-cyan-300">{key}</span>
                  <span className="text-cyan-400">
                    {typeof value === 'number' ? value.toFixed(2) : value.toString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Media Interface */}
          {showMedia && (
            <div className="relative">
              <AnimaMediaInterface 
                animaId={animaId}
                onClose={() => setShowMedia(false)}
                className="w-full aspect-video bg-black/40 backdrop-blur-md rounded-lg border border-cyan-500/30"
              />
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 max-w-md"
        >
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-300 hover:text-red-200"
          >
            Dismiss
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default UnifiedNeuralLink;