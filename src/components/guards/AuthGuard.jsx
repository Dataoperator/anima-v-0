import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { Loading } from '@/components/layout/Loading';

const AuthError = ({ error, onRetry }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen bg-black relative overflow-hidden"
  >
    {/* Cyber grid background */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.1)_1px,_transparent_1px)] bg-[length:40px_40px]" />
    
    {/* Error content */}
    <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full p-6 bg-black/40 backdrop-blur-lg border border-red-500/30 rounded-lg text-red-400">
        <motion.div
          animate={{
            textShadow: ['0 0 8px rgba(255,0,0,0.5)', '0 0 12px rgba(255,0,0,0.8)', '0 0 8px rgba(255,0,0,0.5)'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-xl font-mono mb-4"
        >
          NEURAL LINK ERROR
        </motion.div>

        <div className="space-y-4">
          <p className="font-mono text-sm leading-relaxed">
            {error?.message || 'Neural interface synchronization failed'}
          </p>
          {error?.details && (
            <div className="text-xs font-mono opacity-70 bg-red-900/20 p-2 rounded">
              <pre>{JSON.stringify(error.details, null, 2)}</pre>
            </div>
          )}
          <div className="flex justify-between items-center">
            <div className="text-xs opacity-70">
              Error Code: {error?.code || 'UNKNOWN'}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded text-sm font-mono
                        hover:bg-red-500/20 transition-colors duration-200"
            >
              RETRY NEURAL LINK
            </motion.button>
          </div>
        </div>
      </div>
    </div>

    {/* Animated glitch overlay */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent mix-blend-overlay"
      animate={{
        opacity: [0, 0.2, 0],
      }}
      transition={{
        duration: 0.2,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: "steps(1)",
      }}
    />
  </motion.div>
);

export const AuthGuard = ({ children }) => {
  const { identity, isInitializing, lastError, retryAuth, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [flowState, setFlowState] = useState('initializing');

  useEffect(() => {
    console.log('🔒 AuthGuard: Flow state:', flowState, {
      isInitializing,
      hasIdentity: !!identity,
      pathname: location.pathname,
      lastError
    });

    const initializeFlow = async () => {
      if (isInitializing) {
        setFlowState('initializing');
        return;
      }

      if (lastError) {
        setFlowState('error');
        return;
      }

      if (!identity && location.pathname !== '/') {
        console.log('🔄 Redirecting to landing page, no identity');
        navigate('/', { 
          replace: true,
          state: { returnTo: location.pathname } 
        });
        return;
      }

      if (!isInitializing && identity) {
        setFlowState('checking');
        
        if (location.pathname === '/') {
          try {
            console.log('🔍 Checking user state...');
            const hasAnima = await window.ic?.anima?.has_anima();
            
            // Changed navigation to quantum-vault
            const returnTo = location.state?.returnTo || '/quantum-vault';
            console.log(`➡️ Auth complete, redirecting to ${returnTo}`);
            navigate(returnTo, { replace: true });
          } catch (error) {
            console.error('❌ Failed to check user state:', error);
            navigate('/quantum-vault', { replace: true });
          }
        }
        
        setFlowState('ready');
      }
    };

    initializeFlow();
  }, [identity, isInitializing, location, navigate, lastError, flowState]);

  const handleRetry = async () => {
    setIsReconnecting(true);
    try {
      await retryAuth();
    } finally {
      setIsReconnecting(false);
    }
  };

  if (flowState === 'initializing' || isReconnecting || flowState === 'checking') {
    return <Loading />;
  }

  if (flowState === 'error' || lastError) {
    return <AuthError error={lastError} onRetry={handleRetry} />;
  }

  if (!identity) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-black"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </ErrorBoundary>
  );
};

export default AuthGuard;