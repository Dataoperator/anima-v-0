import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useIC } from '@/hooks/useIC';
import { motion, AnimatePresence } from 'framer-motion';
import InitializationFlow from './InitializationFlow';
import AnimaChat from '../chat/AnimaChat';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';
import { Principal } from '@dfinity/principal';
import { useQuantum } from '@/hooks/useQuantum';

interface UserState {
  NotInitialized?: null;
  Initialized?: {
    quantum_state: {
      coherence: number;
      dimensional_frequency: number;
      stability_index: number;
      last_interaction: bigint;
    };
    personality_traits: {
      curiosity: number;
      adaptability: number;
      stability: number;
      complexity: number;
    };
  };
}

interface DashboardMetrics {
  coherenceLevel: number;
  stabilityIndex: number;
  evolutionRate: number;
  lastInteraction: Date;
}

const LoadingSpinner: React.FC = () => (
  <motion.div 
    className="flex items-center justify-center min-h-screen bg-anima-gradient"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="relative"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full" />
      <motion.div
        className="absolute inset-0 border-4 border-cyan-300/20 rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.div>
  </motion.div>
);

const ConnectButton: React.FC<{ onConnect: () => void }> = ({ onConnect }) => (
  <motion.button
    onClick={onConnect}
    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg 
               hover:from-cyan-600 hover:to-blue-700 transition-all duration-300
               font-medium text-white shadow-lg hover:shadow-cyan-500/20"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    Connect with Internet Identity
  </motion.button>
);

const AnimaDashboard: React.FC = () => {
  const { actor, identity, isAuthenticated } = useAuth();
  const { initializeQuantumState, getQuantumState } = useQuantum();
  const { login } = useIC();
  
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkInitialization = async () => {
      if (!actor || !identity) {
        setLoading(false);
        return;
      }

      try {
        const principal = identity.getPrincipal();
        const state = await actor.get_user_state(principal);
        const isInit = !('NotInitialized' in state);
        setInitialized(isInit);

        if (isInit) {
          const quantumState = await getQuantumState(principal);
          if (quantumState) {
            setMetrics({
              coherenceLevel: quantumState.coherence,
              stabilityIndex: quantumState.stability_index,
              evolutionRate: quantumState.dimensional_frequency,
              lastInteraction: new Date(Number(quantumState.last_interaction))
            });
          }
        }
      } catch (err) {
        console.error('Error checking initialization:', err);
        setError(err instanceof Error ? err.message : 'Failed to check initialization status');
      } finally {
        setLoading(false);
      }
    };

    checkInitialization();
  }, [actor, identity, getQuantumState]);

  const handleLogin = async () => {
    if (!isAuthenticated) {
      try {
        setLoading(true);
        await login();
      } catch (err) {
        console.error('Login failed:', err);
        setError(err instanceof Error ? err.message : 'Login failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInitializationComplete = async () => {
    setInitialized(true);
    if (actor && identity) {
      try {
        const state = await getQuantumState(identity.getPrincipal());
        if (state) {
          setMetrics({
            coherenceLevel: state.coherence,
            stabilityIndex: state.stability_index,
            evolutionRate: state.dimensional_frequency,
            lastInteraction: new Date(Number(state.last_interaction))
          });
        }
      } catch (err) {
        console.error('Failed to get quantum state:', err);
      }
    }
  };

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingSpinner />
        ) : !isAuthenticated ? (
          <motion.div 
            className="flex flex-col items-center justify-center min-h-screen bg-anima-gradient"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.h1 
              className="text-4xl font-bold text-white mb-8 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome to ANIMA
            </motion.h1>
            <ConnectButton onConnect={handleLogin} />
            
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        ) : !initialized ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen bg-anima-gradient"
          >
            <InitializationFlow onInitialized={handleInitializationComplete} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-anima-gradient"
          >
            <AnimaChat metrics={metrics} />
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
};

export default AnimaDashboard;