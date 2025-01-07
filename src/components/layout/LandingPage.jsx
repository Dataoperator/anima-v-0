import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { HexGrid } from '@/components/ui/HexGrid';
import { GlowOrb } from '@/components/ui/GlowOrb';
import { CircuitLines } from '@/components/ui/CircuitLines';
import { NeuralGrid } from '@/components/ui/NeuralGrid';
import { PulsatingLogo } from '@/components/ui/PulsatingLogo';
import { FloatingCard } from '@/components/ui/FloatingCard';
import logger from '@/utils/logging';

const LandingPage = () => {
  const { login, isAuthenticated, isLoading, actor } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [authError, setAuthError] = useState(null);

  const quotes = [
    "Your AI companion awaits",
    "Evolve together",
    "Create a unique bond",
    "Join the future of AI",
  ];

  useEffect(() => {
    logger.info('LandingPage', 'Auth state update', {
      isAuthenticated,
      isLoading,
      hasActor: Boolean(actor)
    });

    if (!isLoading && isAuthenticated && actor) {
      logger.info('LandingPage', 'Redirecting to vault - authenticated with actor');
      navigate('/vault');
    }
  }, [isAuthenticated, isLoading, actor, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const handleLogin = useCallback(async () => {
    if (isLoggingIn) return;
    try {
      setIsLoggingIn(true);
      setAuthError(null);
      await login();
      navigate('/vault');
    } catch (error) {
      logger.error('LandingPage', 'Login failed', { error });
      setAuthError('Failed to connect. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  }, [login, isLoggingIn, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1120]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A1120] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/10 via-[#2081E2]/10 to-[#1199FA]/10" />
      
      <HexGrid />
      <GlowOrb />
      <CircuitLines />
      <NeuralGrid />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,17,32,0.8)_100%)]" />

      <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
        <AnimatePresence>
          {showContent && (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center mb-16 relative"
              >
                <PulsatingLogo />
                
                <motion.div className="mt-8 h-8">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentQuote}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="text-xl text-[#2081E2]/60 font-light"
                    >
                      {quotes[currentQuote]}
                    </motion.p>
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              <FloatingCard delay={0.6}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col items-center space-y-4"
                >
                  <button
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                    className="relative overflow-hidden group bg-gradient-to-r from-[#5865F2] to-[#2081E2] text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed min-w-[240px]"
                  >
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <div className="relative flex items-center justify-center">
                      {isLoggingIn ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <span>Connect with Internet Identity</span>
                      )}
                    </div>
                  </button>
                  {authError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm"
                    >
                      {authError}
                    </motion.p>
                  )}
                </motion.div>
              </FloatingCard>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-0 right-0 text-center"
              >
                <p className="text-[#2081E2]/40 text-sm">
                  Powered by Internet Computer
                </p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LandingPage;