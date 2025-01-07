import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAnima } from '@/contexts/anima-context';
import { useAuth } from '@/contexts/auth-context';

interface AnimaGuardProps {
  children: React.ReactNode;
  requireOwnership?: boolean;
}

export const AnimaGuard: React.FC<AnimaGuardProps> = ({ 
  children, 
  requireOwnership = false 
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { selectedAnima, loading, error } = useAnima();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (!loading && !selectedAnima) {
      navigate('/quantum-vault');
      return;
    }

    if (requireOwnership && selectedAnima?.owner.toString() !== id) {
      navigate('/quantum-vault');
      return;
    }
  }, [isAuthenticated, loading, selectedAnima, id, requireOwnership]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-amber-400 font-serif flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full mx-auto"
          />
          <div className="animate-pulse">Aligning Neural Pathways...</div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-red-400 font-serif flex items-center justify-center">
        <div className="text-center space-y-4">
          <div>Neural Link Disrupted</div>
          <button 
            onClick={() => navigate('/quantum-vault')}
            className="text-amber-400 hover:text-amber-300"
          >
            Return to Quantum Vault
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};