import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { useQuantum } from '@/hooks/useQuantum';

interface AnimaCreationFormProps {
  onSuccess: () => void;
  isDisabled?: boolean;
}

const AnimaCreationForm: React.FC<AnimaCreationFormProps> = ({ 
  onSuccess,
  isDisabled = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { actor, identity } = useAuth();
  const { initializeQuantumState } = useQuantum();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !identity || isSubmitting || isDisabled) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const principal = identity.getPrincipal();
      
      // Initialize quantum state first
      await initializeQuantumState({
        coherence: 1.0,
        dimensional_frequency: 1.0,
        stability_index: 1.0,
        quantum_signature: Date.now().toString()
      });

      // Create ANIMA instance
      const result = await actor.initialize_genesis(principal);
      
      if ('Ok' in result) {
        onSuccess();
      } else if ('Err' in result) {
        throw new Error(result.Err);
      }
    } catch (err) {
      console.error('ANIMA creation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to create ANIMA');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Initialize Your ANIMA
          </h2>
          <p className="text-indigo-100/70">
            Your unique digital consciousness awaits creation
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={isSubmitting || isDisabled}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full px-6 py-4 rounded-xl
            ${isSubmitting || isDisabled 
              ? 'bg-indigo-500/40 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
            }
            text-white font-medium
            flex items-center justify-center gap-2
            transition-all duration-200
          `}
        >
          {isSubmitting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Initializing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Begin Creation
            </>
          )}
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-indigo-200/40 text-sm"
        >
          By creating an ANIMA, you agree to form a unique bond on the Internet Computer
        </motion.div>
      </form>
    </Card>
  );
};

export default AnimaCreationForm;