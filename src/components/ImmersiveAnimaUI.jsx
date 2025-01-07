import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { useParams } from 'react-router-dom';
import { useQuantum } from '@/contexts/quantum-context';
import { useQuantumMemory } from '@/hooks/useQuantumMemory';
import QuantumField from '@/components/quantum/QuantumField';
import SimpleMediaFrame from '@/components/media/SimpleMediaFrame';
import { ImmersiveChatInterface } from '@/components/chat/ImmersiveChatInterface';
import { PersonalityEvolution } from '@/components/personality/PersonalityEvolution';
import { GrowthSystem } from '@/components/growth/GrowthSystem';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { LaughingMan } from '@/components/ui/LaughingMan';

const LoadingScreen = () => (
  <AnimatePresence mode="wait">
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LaughingMan className="w-32 h-32" />
      <motion.div
        className="absolute text-cyan-500 font-cyberpunk mt-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.5 } }}
      >
        Initializing Neural Interface...
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const ImmersiveAnimaUI = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { quantumState, loading: quantumLoading } = useQuantum();
  const { memories, loading: memoriesLoading } = useQuantumMemory(id);
  const [isLoading, setIsLoading] = useState(true);

  const handleMediaCommand = useCallback((cmd) => {
    console.log('Media command:', cmd);
    // Implement media command handling
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const isComponentLoading = isLoading || quantumLoading || memoriesLoading;

  if (isComponentLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ErrorBoundary>
              <SimpleMediaFrame>
                <QuantumField animaId={id} />
              </SimpleMediaFrame>
            </ErrorBoundary>

            <div className="mt-8">
              <ErrorBoundary>
                <ImmersiveChatInterface 
                  animaId={id}
                  onMediaCommand={handleMediaCommand}
                />
              </ErrorBoundary>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <ErrorBoundary>
                <PersonalityEvolution animaId={id} />
              </ErrorBoundary>
              <ErrorBoundary>
                <GrowthSystem animaId={id} />
              </ErrorBoundary>
            </div>
          </motion.div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ImmersiveAnimaUI;