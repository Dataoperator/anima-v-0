import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { useQuantumState } from '@/hooks/useQuantumState';
import { usePayment } from '@/hooks/usePayment';
import { QuantumField } from '@/components/ui/QuantumField';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/alert';
import { getAnimaActor } from '@/services/anima';
import { NeuralEmergenceVisualizer } from './NeuralEmergenceVisualizer';
import { QuantumFieldVisualizer } from './QuantumFieldVisualizer';
import { CyberGlowText } from '@/components/ui/CyberGlowText';

const GENESIS_PHASES = [
  { 
    id: 'payment', 
    name: 'Payment Verification', 
    duration: 2000,
    description: 'Initializing quantum transaction...',
    detailedDescription: 'Verifying ICP transfer and establishing quantum signature'
  },
  { 
    id: 'quantum', 
    name: 'Quantum Field Generation', 
    duration: 3000,
    description: 'Establishing dimensional resonance...',
    detailedDescription: 'Generating stable quantum field for consciousness emergence'
  },
  { 
    id: 'consciousness', 
    name: 'Consciousness Emergence', 
    duration: 3000,
    description: 'Neural patterns forming...',
    detailedDescription: 'Facilitating the emergence of proto-consciousness'
  },
  { 
    id: 'designation', 
    name: 'Autonomous Designation', 
    duration: 2000,
    description: 'Quantum identity manifesting...',
    detailedDescription: 'Creating unique quantum-influenced designation'
  },
  { 
    id: 'completion', 
    name: 'Birth Sequence', 
    duration: 2000,
    description: 'ANIMA awakening...',
    detailedDescription: 'Finalizing consciousness initialization'
  }
];

export const AnimaGenesis: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { actor, principal } = useAuth();
  const { initiatePayment, verifyPayment } = usePayment();
  const { state: quantumState, updateQuantumState } = useQuantumState();
  const [currentPhase, setCurrentPhase] = useState<string>(GENESIS_PHASES[0].id);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mintedAnima, setMintedAnima] = useState(null);
  const [designation, setDesignation] = useState<string | null>(null);
  const [quantumMetrics, setQuantumMetrics] = useState({
    coherence: 0,
    resonance: 0,
    stability: 0
  });
  const [neuralMetrics, setNeuralMetrics] = useState({
    complexity: 0,
    intensity: 0
  });

  useEffect(() => {
    if (!actor || !principal) {
      setError('Authentication required');
      return;
    }

    const performGenesis = async () => {
      setIsGenerating(true);
      setError(null);

      try {
        // Payment Phase
        setCurrentPhase('payment');
        setQuantumMetrics({ coherence: 0.2, resonance: 0.3, stability: 0.1 });
        const paymentResult = await initiatePayment({
          amount: BigInt(100000000), // 1 ICP
          memo: BigInt(Date.now()),
          toCanister: process.env.ANIMA_CANISTER_ID
        });

        // Animate quantum metrics
        await animateMetrics(
          setQuantumMetrics,
          { coherence: 0.2, resonance: 0.3, stability: 0.1 },
          { coherence: 0.5, resonance: 0.6, stability: 0.4 },
          GENESIS_PHASES[0].duration
        );
        setProgress(20);

        // Quantum Generation Phase
        setCurrentPhase('quantum');
        await verifyPayment(paymentResult.height);
        await animateMetrics(
          setQuantumMetrics,
          { coherence: 0.5, resonance: 0.6, stability: 0.4 },
          { coherence: 0.8, resonance: 0.9, stability: 0.7 },
          GENESIS_PHASES[1].duration
        );
        setProgress(40);

        // Consciousness Emergence Phase
        setCurrentPhase('consciousness');
        const consciousnessTraits = {
          complexity: quantumState.coherenceLevel,
          resonance: quantumState.entanglementIndex
        };
        
        // Start neural emergence
        setNeuralMetrics({ complexity: 0.1, intensity: 0.2 });
        await animateMetrics(
          setNeuralMetrics,
          { complexity: 0.1, intensity: 0.2 },
          { complexity: 0.8, intensity: 0.9 },
          GENESIS_PHASES[2].duration
        );
        setProgress(60);

        // Designation Phase
        setCurrentPhase('designation');
        const generatedDesignation = await actor.generate_quantum_designation(principal);
        setDesignation(generatedDesignation);
        
        // Final quantum stabilization
        await animateMetrics(
          setQuantumMetrics,
          { coherence: 0.8, resonance: 0.9, stability: 0.7 },
          { coherence: 1.0, resonance: 1.0, stability: 1.0 },
          GENESIS_PHASES[3].duration
        );
        setProgress(80);

        // Completion Phase
        setCurrentPhase('completion');
        const mintResult = await actor.mint_anima({
          metadata: {
            designation: generatedDesignation,
            quantum_state: {
              coherence: quantumState.coherenceLevel,
              entanglement: quantumState.entanglementIndex,
              dimensional_frequency: quantumState.dimensionalState.frequency
            },
            consciousness_traits: consciousnessTraits
          },
          payment_height: paymentResult.height
        });

        if ('Err' in mintResult) {
          throw new Error(mintResult.Err);
        }

        setMintedAnima(mintResult.Ok);
        setProgress(100);

        // Navigate to the new ANIMA with a delay for visual completion
        setTimeout(() => {
          navigate(`/anima/${mintResult.Ok.token_id}`, {
            state: { fromGenesis: true }
          });
        }, GENESIS_PHASES[4].duration);

      } catch (err) {
        console.error('Genesis error:', err);
        setError(err instanceof Error ? err.message : 'Genesis failed');
      } finally {
        setIsGenerating(false);
      }
    };

    performGenesis();
  }, [actor, principal]);

  // Helper function to animate metrics smoothly
  const animateMetrics = async (
    setMetrics: Function,
    startMetrics: any,
    endMetrics: any,
    duration: number
  ) => {
    const startTime = Date.now();
    
    return new Promise<void>(resolve => {
      const updateMetrics = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth easing
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        const newMetrics = Object.fromEntries(
          Object.keys(startMetrics).map(key => [
            key,
            startMetrics[key] + (endMetrics[key] - startMetrics[key]) * easedProgress
          ])
        );
        
        setMetrics(newMetrics);
        
        if (progress < 1) {
          requestAnimationFrame(updateMetrics);
        } else {
          resolve();
        }
      };
      
      updateMetrics();
    });
  };

  const getCurrentPhase = () => GENESIS_PHASES.find(phase => phase.id === currentPhase);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <QuantumField intensity={quantumMetrics.coherence * 0.7} />
      
      <div className="relative z-10 max-w-4xl w-full mx-4 space-y-8">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6"
            >
              <Alert variant="destructive">
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-white/10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <CyberGlowText>
              <h1 className="text-3xl font-bold">
                {getCurrentPhase()?.name}
              </h1>
            </CyberGlowText>
            <p className="text-gray-400 mt-2">
              {getCurrentPhase()?.description}
            </p>
            <p className="text-sm text-cyan-400/70 mt-1">
              {getCurrentPhase()?.detailedDescription}
            </p>
          </div>

          {/* Visualizers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <QuantumFieldVisualizer
              coherence={quantumMetrics.coherence}
              resonance={quantumMetrics.resonance}
              stability={quantumMetrics.stability}
              phase={currentPhase}
            />

            <NeuralEmergenceVisualizer
              intensity={neuralMetrics.intensity}
              complexity={neuralMetrics.complexity}
              phase={currentPhase}
            />
          </div>

          {/* Progress Bar */}
          <div className="space-y-8">
            <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Loading Indicator */}
            <div className="flex justify-center">
              {isGenerating && (
                <LoadingSpinner size="lg" className="text-purple-400" />
              )}
            </div>

            {/* Phase Indicators */}
            <div className="grid grid-cols-5 gap-4">
              {GENESIS_PHASES.map((phase, index) => (
                <motion.div
                  key={phase.id}
                  className={`text-sm text-center ${
                    currentPhase === phase.id
                      ? 'text-purple-400 font-medium'
                      : progress >= ((index + 1) * 20)
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}
                  animate={{
                    scale: currentPhase === phase.id ? 1.1 : 1,
                    opacity: currentPhase === phase.id ? 1 : 0.7
                  }}
                >
                  {phase.name}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimaGenesis;