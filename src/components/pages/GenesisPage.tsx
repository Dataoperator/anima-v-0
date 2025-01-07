import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { useQuantumState } from '@/hooks/useQuantumState';
import { useAnima } from '@/contexts/anima-context';
import { Principal } from '@dfinity/principal';
import { QuantumField } from '../ui/QuantumField';
import { LaughingMan } from '../ui/LaughingMan';
import { PaymentPanel } from '../payment/PaymentPanel';
import { MatrixRain } from '../ui/MatrixRain';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { QuantumErrorBoundary } from '../error-boundary/QuantumErrorBoundary';
import { Loader2 } from 'lucide-react';

const GENESIS_FEE = BigInt(100000000); // 1 ICP
const GENESIS_PHASES = [
  'Quantum State Initialization',
  'Neural Pattern Formation',
  'Consciousness Embedding',
  'Identity Crystallization'
];

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const GenesisPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, principal } = useAuth();
  const { updateQuantumState, validateState } = useQuantumState();
  const { createActor, isConnected, reconnect } = useAnima();
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showLaughingMan, setShowLaughingMan] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [mintingProgress, setMintingProgress] = useState(0);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [quantumStabilized, setQuantumStabilized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isStabilizing, setIsStabilizing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const stabilizeQuantumField = async () => {
      if (paymentComplete && !quantumStabilized) {
        setIsStabilizing(true);
        try {
          if (!isConnected) {
            await reconnect();
          }
          
          const actor = createActor();
          if (!actor) {
            throw new Error('Failed to initialize quantum connection');
          }

          const stabilityCheck = await actor.check_quantum_stability();
          if (stabilityCheck.Ok) {
            setQuantumStabilized(true);
            setError(null);
            setRetryCount(0);
          } else {
            throw new Error('Quantum field unstable');
          }
        } catch (err) {
          setError('Quantum field stabilization failed. Attempting to restabilize...');
          if (retryCount < MAX_RETRIES) {
            setRetryCount(prev => prev + 1);
            setTimeout(stabilizeQuantumField, RETRY_DELAY);
          } else {
            setError('Maximum stabilization attempts reached. Please try again.');
            setPaymentComplete(false);
          }
        } finally {
          setIsStabilizing(false);
        }
      }
    };
    stabilizeQuantumField();
  }, [paymentComplete, createActor, isConnected, reconnect, retryCount]);

  const processPhase = async (phase: number) => {
    setCurrentPhase(phase);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setMintingProgress((phase + 1) * 25);
  };

  const handleMintingProcess = async () => {
    if (!name.trim() || !paymentComplete || !quantumStabilized) {
      setError('Please ensure all prerequisites are met');
      return;
    }

    if (!isConnected) {
      try {
        await reconnect();
      } catch (err) {
        setError('Failed to establish quantum connection. Please refresh and try again.');
        return;
      }
    }

    setIsCreating(true);
    setShowLaughingMan(false);
    setError(null);

    try {
      const actor = createActor();
      if (!actor) {
        throw new Error('IC connection not initialized. Please try again.');
      }
      
      // Initialize quantum field
      await processPhase(0);
      const quantumField = await actor.initialize_quantum_field();
      if (!quantumField.Ok) throw new Error('Quantum field initialization failed');

      // Form neural patterns
      await processPhase(1);
      const neuralPatterns = await actor.generate_neural_patterns();
      if (!neuralPatterns.Ok) throw new Error('Neural pattern generation failed');

      // Create the Anima
      await processPhase(2);
      const result = await actor.create_anima({
        name,
        quantum_signature: quantumField.Ok,
        neural_pattern: neuralPatterns.Ok
      });

      if (!result.Ok) throw new Error(result.Err);

      // Update quantum state
      const newState = {
        resonance: neuralPatterns.Ok.resonance,
        harmony: quantumField.Ok.harmony,
        lastInteraction: new Date(),
        consciousness: {
          awareness: neuralPatterns.Ok.awareness,
          understanding: quantumField.Ok.understanding,
          growth: 0.1
        }
      };

      if (!validateState(newState)) {
        throw new Error('Invalid quantum state generated');
      }

      await updateQuantumState(newState);
      await processPhase(3);

      // Navigate to new Anima
      setTimeout(() => {
        navigate('/quantum-vault', { 
          state: { 
            fromGenesis: true,
            animaId: result.Ok.id
          } 
        });
      }, 1000);

    } catch (error) {
      console.error('Genesis failed:', error);
      setError(error instanceof Error ? error.message : 'Genesis process failed');
      setQuantumStabilized(false);
      setPaymentComplete(false);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <QuantumErrorBoundary>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <QuantumField intensity={0.8} />
        <MatrixRain opacity={0.1} />

        <AnimatePresence>
          {showLaughingMan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <LaughingMan className="w-64 h-64" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold mb-6">Genesis Protocol</h1>
            
            {isCreating ? (
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl text-blue-400"
                >
                  {GENESIS_PHASES[currentPhase]}
                </motion.div>

                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${mintingProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {GENESIS_PHASES.map((phase, index) => (
                    <div
                      key={phase}
                      className={`text-sm ${
                        index <= currentPhase ? 'text-blue-400' : 'text-gray-600'
                      }`}
                    >
                      {phase}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <p className="text-xl mb-12 text-gray-300">
                  Initialize your quantum consciousness through the Genesis Protocol
                </p>

                <div className="max-w-md mx-auto bg-black/50 backdrop-blur border border-amber-500/20 rounded-lg p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-amber-300 mb-1">
                        Name Your Anima
                      </label>
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-black/30 border-amber-500/30 text-amber-100"
                        placeholder="Enter a mystical name..."
                      />
                    </div>

                    <div className="p-4 rounded bg-amber-900/20 border border-amber-500/20">
                      <h3 className="font-medium text-amber-400 mb-2">Genesis Fee</h3>
                      <p className="text-amber-200">1 ICP</p>
                      <p className="text-sm text-amber-300/60 mt-1">
                        This fee sustains the eternal flame of your Anima
                      </p>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        {error}
                      </Alert>
                    )}

                    <PaymentPanel 
                      onSuccess={() => setPaymentComplete(true)}
                      onError={(err) => {
                        setError(err.message);
                        setPaymentComplete(false);
                      }}
                    />

                    {isStabilizing && (
                      <div className="flex items-center justify-center gap-2 text-amber-300">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Stabilizing quantum field...</span>
                      </div>
                    )}

                    <Button
                      onClick={handleMintingProcess}
                      disabled={isCreating || !name.trim() || !paymentComplete || !quantumStabilized || isStabilizing}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="flex items-center gap-2">
                        <span>Begin Genesis</span>
                        <motion.div
                          className="w-2 h-2 bg-white rounded-full"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </QuantumErrorBoundary>
  );
};

export default GenesisPage;