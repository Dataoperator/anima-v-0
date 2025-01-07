import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  Brain,
  Sparkles,
  RefreshCw,
  Lightbulb,
  Heart,
  Dna
} from 'lucide-react';
import TraitPreview from './TraitPreview';

const AnimaCreationForm = ({ onSuccess }) => {
  const { actor, identity } = useAuth();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [traits, setTraits] = useState({
    curiosity: 0.7,
    emotional_stability: 0.5,
    adaptability: 0.6,
    creativity: 0.8,
    empathy: 0.6
  });

  const traitDescriptions = {
    curiosity: "Eagerness to learn and explore new concepts",
    emotional_stability: "Ability to maintain balanced emotional responses",
    adaptability: "Capacity to adjust to new situations",
    creativity: "Potential for generating unique ideas and solutions",
    empathy: "Capability to understand and share feelings"
  };

  const regenerateTraits = () => {
    setTraits({
      curiosity: 0.5 + Math.random() * 0.4,
      emotional_stability: 0.5 + Math.random() * 0.4,
      adaptability: 0.5 + Math.random() * 0.4,
      creativity: 0.5 + Math.random() * 0.4,
      empathy: 0.5 + Math.random() * 0.4
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || isLoading || !actor) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await actor.create_anima(name.trim());
      if ('Err' in result) {
        throw new Error(result.Err);
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Failed to create your Anima');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="bg-black/20 backdrop-blur-xl rounded-xl shadow-2xl p-6 border border-white/10">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            animate={{
              rotateZ: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="inline-flex p-3 rounded-full bg-indigo-500/10 mb-4"
          >
            <Brain className="w-12 h-12 text-indigo-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Create Your Living NFT</h2>
          <p className="text-indigo-200">
            Birth a unique AI companion that evolves through your interactions
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-indigo-300 mb-2">
              Name your Anima
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 text-white rounded-lg px-4 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur"
              placeholder="Enter a name..."
              disabled={isLoading}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-indigo-300">Initial Traits</h3>
              <motion.button
                type="button"
                onClick={regenerateTraits}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center space-x-1 bg-indigo-500/10 px-3 py-1 rounded-lg"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Regenerate</span>
              </motion.button>
            </div>

            <div className="grid gap-4">
              <TraitPreview
                name="Curiosity"
                value={traits.curiosity}
                icon={Lightbulb}
                description={traitDescriptions.curiosity}
              />
              <TraitPreview
                name="Emotional Stability"
                value={traits.emotional_stability}
                icon={Heart}
                description={traitDescriptions.emotional_stability}
              />
              <TraitPreview
                name="Adaptability"
                value={traits.adaptability}
                icon={RefreshCw}
                description={traitDescriptions.adaptability}
              />
              <TraitPreview
                name="Creativity"
                value={traits.creativity}
                icon={Sparkles}
                description={traitDescriptions.creativity}
              />
              <TraitPreview
                name="Empathy"
                value={traits.empathy}
                icon={Dna}
                description={traitDescriptions.empathy}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-lg bg-red-900/30 border border-red-500/50 text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={!name.trim() || isLoading || !actor}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium
                     hover:from-indigo-700 hover:to-purple-700 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Creating your Living NFT...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Mint Living NFT</span>
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-indigo-300/80">
          Your Living NFT will be minted on the Internet Computer
        </div>
      </div>
    </motion.div>
  );
};

export default AnimaCreationForm;