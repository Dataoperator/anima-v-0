import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';
import { useAuth } from '@/contexts/AuthContext';

const ADMIN_PRINCIPAL = process.env.ADMIN_PRINCIPAL;

export function AppLayout() {
  const { isAuthenticated, identity, error, setError } = useAuth();

  const isAdmin = React.useMemo(() => {
    if (!identity) return false;
    const principal = identity.getPrincipal().toString();
    return principal === ADMIN_PRINCIPAL;
  }, [identity]);

  return (
    <div className="min-h-screen flex flex-col bg-anima-light dark:bg-anima-dark">
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg z-50"
          >
            <p className="mr-8">{error}</p>
            <button
              onClick={() => setError(null)}
              className="absolute top-2 right-2 text-sm hover:opacity-70"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </motion.div>
        )}

        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <TopNav isAdmin={isAdmin} />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={isAuthenticated ? 'auth' : 'unauth'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}