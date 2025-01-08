import React, { useEffect, useState, Suspense } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { icManager } from '@/ic-init';
import { LoadingFallback } from '../ui/LoadingFallback';

const AuthError = ({ error, onRetry }: { error: any, onRetry: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed top-4 right-4 p-4 bg-black/80 backdrop-blur border border-red-500/30 rounded-lg z-50"
  >
    <div className="flex items-center space-x-3">
      <div className="text-red-400">Authentication failed</div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className="px-2 py-1 bg-red-500/10 border border-red-500/30 rounded text-sm
                  hover:bg-red-500/20 transition-colors duration-200"
      >
        Retry
      </motion.button>
    </div>
  </motion.div>
);

export const AuthGuard = () => {
  const [initStatus, setInitStatus] = useState<'idle' | 'initializing' | 'complete' | 'error'>('idle');
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initialize = async () => {
      if (initStatus !== 'idle') return;
      
      setInitStatus('initializing');
      try {
        if (icManager.isInitialized()) {
          const identity = icManager.getIdentity();
          handleIdentity(identity);
          setInitStatus('complete');
          return;
        }

        await icManager.initialize();
        const identity = icManager.getIdentity();
        handleIdentity(identity);
        setInitStatus('complete');

      } catch (err) {
        console.error('❌ Auth initialization failed:', err);
        setError(err instanceof Error ? err : new Error('Authentication failed'));
        setInitStatus('error');
      }
    };

    const handleIdentity = (identity: any) => {
      if (!identity && location.pathname !== '/') {
        navigate('/', { 
          replace: true,
          state: { returnTo: location.pathname }
        });
        return;
      }

      if (identity && location.pathname === '/') {
        const returnTo = location.state?.returnTo || '/quantum-vault';
        navigate(returnTo, { replace: true });
      }
    };

    initialize();
  }, [navigate, location, initStatus]);

  const handleRetry = async () => {
    setInitStatus('initializing');
    setError(null);
    
    try {
      await icManager.initialize();
      const identity = icManager.getIdentity();
      
      if (identity) {
        navigate('/quantum-vault', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      setInitStatus('complete');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Authentication failed'));
      setInitStatus('error');
    }
  };

  return (
    <>
      {(initStatus === 'initializing' || initStatus === 'idle') && (
        <LoadingFallback />
      )}
      
      {(initStatus === 'error' || error) && (
        <AuthError error={error} onRetry={handleRetry} />
      )}
      
      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-black"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Suspense>
    </>
  );
};