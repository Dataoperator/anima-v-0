import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useGenesisSound } from '@/hooks/useGenesisSound';
import { mintAnima } from '@/services/anima';
import { useQuantumState } from '@/hooks/useQuantumState';
import { GenesisRitual } from '../genesis/GenesisRitual';
import { DesignationGenerator } from '../genesis/DesignationGenerator';
import { MatrixRain } from '../ui/MatrixRain';

interface MintingStage {
  id: string;
  component: React.FC;
  next: string | null;
}

const STAGES: Record<string, MintingStage> = {
  designation: {
    id: 'designation',
    component: DesignationGenerator,
    next: 'genesis'
  },
  genesis: {
    id: 'genesis',
    component: GenesisRitual,
    next: 'completion'
  },
  completion: {
    id: 'completion',
    component: () => null,
    next: null
  }
};

export const MintAnima: React.FC = () => {
  const navigate = useNavigate();
  const { identity } = useAuth();
  const { playPhase } = useGenesisSound();
  const { initializeQuantumState } = useQuantumState();
  
  const [designation, setDesignation] = useState<string>('');
  const [currentStage, setCurrentStage] = useState<string>('designation');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDesignationSelect = useCallback((selected: string) => {
    setDesignation(selected);
    playPhase('designation_accepted');
    setCurrentStage('genesis');
  }, [playPhase]);

  const handleGenesisCompletion = useCallback(async () => {
    if (!identity || !designation || isProcessing) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      // Initialize quantum state
      await initializeQuantumState();
      
      // Execute the minting with enhanced configuration
      const result = await mintAnima(identity, {
        name: designation,
        quantumConfig: {
          coherenceThreshold: 0.7,
          stabilityRequired: true,
          dimensionalSync: true,
          patternResonance: true
        },
        genesisConfig: {
          ritualCompleted: true,
          designationSource: 'quantum-resonance',
          neuralPathways: true,
          ghostIntegration: true
        }
      });

      playPhase('birth');
      setCurrentStage('completion');

      // Navigate to neural link
      setTimeout(() => {
        navigate(`/neural-link/${result.tokenId.toString()}`);
      }, 2000);
      
    } catch (err) {
      console.error('Genesis failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete genesis ritual');
      playPhase('error');
    } finally {
      setIsProcessing(false);
    }
  }, [identity, designation, isProcessing, navigate, playPhase, initializeQuantumState]);

  const CurrentStageComponent = STAGES[currentStage].component;

  return (
    <div className="min-h-screen bg-black text-cyan-500 relative overflow-hidden">
      <MatrixRain className="opacity-20" />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto"
          >
            {currentStage === 'designation' && (
              <>
                <h1 className="text-3xl font-bold text-center mb-8">
                  Quantum Designation Discovery
                </h1>
                <DesignationGenerator onSelect={handleDesignationSelect} />
              </>
            )}

            {currentStage === 'genesis' && (
              <GenesisRitual onComplete={handleGenesisCompletion} />
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400"
              >
                {error}
              </motion.div>
            )}

            {!isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 flex justify-center space-x-4"
              >
                <button
                  onClick={() => navigate('/quantum-vault')}
                  className="px-6 py-2 border border-cyan-500/30 text-cyan-500 rounded 
                           hover:bg-cyan-500/10 transition-colors"
                >
                  Cancel Genesis
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MintAnima;