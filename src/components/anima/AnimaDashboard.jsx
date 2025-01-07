import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import InitializationFlow from './InitializationFlow';
import AnimaChat from '../chat/AnimaChat';

const AnimaDashboard = () => {
  const { actor, identity } = useAuth();
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkInitialization = async () => {
      if (!actor || !identity) return;

      try {
        const principal = identity.getPrincipal();
        const state = await actor.get_user_state([principal]);
        setInitialized(!('NotInitialized' in state));
      } catch (err) {
        console.error('Error checking initialization:', err);
      } finally {
        setLoading(false);
      }
    };

    checkInitialization();
  }, [actor, identity]);

  if (loading) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-screen bg-anima-gradient"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="loading-spinner w-12 h-12"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    );
  }

  if (!initialized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-screen bg-anima-gradient"
      >
        <InitializationFlow onInitialized={() => setInitialized(true)} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-anima-gradient"
    >
      <AnimaChat />
    </motion.div>
  );
};

export default AnimaDashboard;