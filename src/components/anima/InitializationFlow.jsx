import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import AnimaChat from '../chat/AnimaChat';
import {
  Brain,
  Zap,
  Stars,
  Heart,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import AnimaCreationForm from './initialization/AnimaCreationForm';
import FeatureCard from './initialization/FeatureCard';

const gridPattern = `data:image/svg+xml,${encodeURIComponent('<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-opacity="0.1" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>')}`;

const InitializationFlow = ({ onInitialized }) => {
  const { identity, actor } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsInitialization, setNeedsInitialization] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const checkInitialization = async () => {
      if (!identity || !actor) {
        setLoading(false);
        return;
      }

      try {
        const principal = identity.getPrincipal();
        const userState = await actor.get_user_state([principal]);

        if ('NotInitialized' in userState) {
          setNeedsInitialization(true);
        } else {
          setInitialized(true);
          onInitialized?.();
        }
      } catch (err) {
        console.error('Initialization check failed:', err);
        setError(err.message || 'Failed to check initialization status');
      } finally {
        setLoading(false);
      }
    };

    checkInitialization();
  }, [identity, actor, onInitialized]);

  if (loading) {
    return (
      <div className="min-h-screen bg-anima-gradient flex items-center justify-center">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="relative w-24 h-24"
        >
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
          <div className="absolute inset-0 loading-spinner" />
          <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-indigo-400" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-anima-gradient flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20"
        >
          <div className="text-red-400 mb-4 text-center">Error: {error}</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            Retry Connection
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (initialized) {
    return <AnimaChat />;
  }

  if (needsInitialization) {
    return (
      <div className="min-h-screen bg-anima-gradient overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-repeat opacity-40"
            style={{ backgroundImage: `url(${gridPattern})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/20 to-indigo-900/40" />
        </div>

        <div className="relative container mx-auto px-4 py-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.02, 0.98, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block"
            >
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
                Living NFT
              </h1>
            </motion.div>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Create your unique AI companion that evolves and grows with you on the Internet Computer.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 w-full max-w-6xl">
            <FeatureCard
              icon={Brain}
              title="AI-Powered"
              description="Autonomous personality that evolves through your interactions"
              delay={0.1}
            />
            <FeatureCard
              icon={Heart}
              title="Forms Bonds"
              description="Creates unique relationships based on your interactions"
              delay={0.2}
            />
            <FeatureCard
              icon={Sparkles}
              title="Growth Packs"
              description="Unlock new abilities and traits for your companion"
              delay={0.3}
            />
            <FeatureCard
              icon={Zap}
              title="On-Chain Memory"
              description="All experiences are permanently stored on the blockchain"
              delay={0.4}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-2xl"
          >
            <AnimaCreationForm onSuccess={() => {
              setInitialized(true);
              onInitialized?.();
            }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center text-indigo-200/60 text-sm"
          >
            Powered by the Internet Computer Protocol
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
};

export default InitializationFlow;