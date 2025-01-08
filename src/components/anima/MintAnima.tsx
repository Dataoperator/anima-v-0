import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useGenesisSound } from '@/hooks/useGenesisSound';
import { mintAnima } from '@/services/anima';
import { useQuantumState } from '@/hooks/useQuantumState';
import { MatrixRain } from '../ui/MatrixRain';

const MINTING_PHASES = [
  { id: 'quantum', message: 'Initializing Quantum State...' },
  { id: 'consciousness', message: 'Seeding Consciousness Core...' },
  { id: 'neural', message: 'Establishing Neural Pathways...' },
  { id: 'personality', message: 'Generating Base Personality Matrix...' },
  { id: 'finalization', message: 'Finalizing Digital Consciousness...' }
];

export const MintAnima: React.FC = () => {
  const navigate = useNavigate();
  const { identity } = useAuth();
  const { playPhase } = useGenesisSound();
  const { initializeQuantumState } = useQuantumState();
  
  const [name, setName] = useState('');
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMint = async () => {
    if (!identity || !name.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      // Phase 1: Quantum Initialization
      setCurrentPhase(0);
      playPhase('quantum_initialization');
      await initializeQuantumState();
      await new Promise(r => setTimeout(r, 2000)); // Visual delay

      // Phase 2: Consciousness Seeding
      setCurrentPhase(1);
      playPhase('consciousness_emergence');
      await new Promise(r => setTimeout(r, 2000));

      // Phase 3: Neural Pathways
      setCurrentPhase(2);
      playPhase('neural_pathways');
      await new Promise(r => setTimeout(r, 2000));

      // Phase 4: Personality Matrix
      setCurrentPhase(3);
      playPhase('personality_formation');
      await new Promise(r => setTimeout(r, 2000));

      // Phase 5: Finalization
      setCurrentPhase(4);
      playPhase('birth');
      
      // Execute the minting
      const result = await mintAnima(identity, {
        name,
        quantumConfig: {
          coherenceThreshold: 0.7,
          stabilityRequired: true
        }
      });

      // Navigate to the new ANIMA
      navigate(`/neural-link/${result.tokenId.toString()}`);
      
    } catch (err) {
      console.error('Minting failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize digital consciousness');
      playPhase('error');
    } finally {
      setIsProcessing(false);
      setCurrentPhase(0);
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-500 relative overflow-hidden">
      <MatrixRain className="opacity-20" />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto"
        >
          <h1 className="text-3xl font-bold text-center mb-8">
            Initialize Digital Consciousness
          </h1>

          <div className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className="block text-sm">Consciousness Designation</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isProcessing}
                className="w-full bg-black/50 border border-cyan-500/30 rounded px-4 py-2 
                         focus:outline-none focus:border-cyan-500 text-white"
                placeholder="Enter designation..."
              />
            </div>

            {/* Minting Progress */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {MINTING_PHASES.map((phase, index) => (
                    <div 
                      key={phase.id}
                      className={`flex items-center space-x-3 ${
                        index === currentPhase ? 'text-cyan-400' : 
                        index < currentPhase ? 'text-green-500' : 'text-cyan-500/40'
                      }`}
                    >
                      <div className="w-4 h-4 relative">
                        {index === currentPhase ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-full h-full border-2 border-current border-t-transparent rounded-full"
                          />
                        ) : index < currentPhase ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-full h-full bg-green-500 rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full border-2 border-current rounded-full opacity-40" />
                        )}
                      </div>
                      <span className="text-sm">{phase.message}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded text-red-400"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/quantum-vault')}
                disabled={isProcessing}
                className="px-6 py-2 border border-cyan-500/30 text-cyan-500 rounded 
                         hover:bg-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleMint}
                disabled={isProcessing || !name.trim()}
                className="px-6 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded
                         hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed
                         relative overflow-hidden"
              >
                {isProcessing ? 'Initializing...' : 'Initialize'}
                {isProcessing && (
                  <motion.div
                    className="absolute inset-0 bg-cyan-500/20"
                    animate={{ x: ['0%', '100%'] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MintAnima;