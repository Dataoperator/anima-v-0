import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Principal } from '@dfinity/principal';
import { useAnima } from '@/hooks/useAnima';
import { useLedger } from '@/hooks/useLedger';
import { useAuth } from '@/hooks/useAuth';

// Cyberpunk style blur overlay for depth
const BlurOverlay = ({ children, intensity = 8 }) => (
  <div className="relative">
    <div 
      className="absolute inset-0 backdrop-blur-md" 
      style={{ backdropFilter: `blur(${intensity}px)` }} 
    />
    {children}
  </div>
);

// Dynamic interface grid
const InterfaceGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    {children}
  </div>
);

// Core interface component
export const QuantumInterface = () => {
  const { actor, userAnimas, fetchUserAnimas } = useAnima();
  const { identity } = useAuth();
  const { createPaymentLink, verifyPayment } = useLedger();
  const navigate = useNavigate();
  const [animaData, setAnimaData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnima, setSelectedAnima] = useState(null);

  useEffect(() => {
    loadAnimaData();
  }, [identity]);

  const loadAnimaData = async () => {
    try {
      setIsLoading(true);
      if (!actor || !identity) return;
      
      const animas = await actor.get_user_animas(identity.getPrincipal());
      setAnimaData(animas);
      
    } catch (err) {
      console.error('Failed to load anima data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAnima = async () => {
    try {
      const paymentLink = await createPaymentLink();
      
      const paymentVerified = await verifyPayment(paymentLink.id);
      if (paymentVerified) {
        const result = await actor.create_anima();
        await loadAnimaData();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectAnima = (anima) => {
    setSelectedAnima(anima);
    navigate('/nexus/' + anima.id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black text-cyan-500"
    >
      <BlurOverlay>
        <div className="max-w-7xl mx-auto py-8 px-4">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-mono font-bold text-cyan-400 mb-2">
              Quantum Interface
            </h1>
            <p className="text-cyan-300 opacity-80">
              Neural Link Status: {isLoading ? 'Syncing...' : 'Connected'}
            </p>
          </motion.div>

          <InterfaceGrid>
            {animaData.map((anima) => (
              <motion.div
                key={anima.id.toString()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black/40 backdrop-blur-lg border border-cyan-500/30 rounded-lg p-4 cursor-pointer"
                onClick={() => handleSelectAnima(anima)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-mono text-cyan-400">
                    Neural Link {anima.id.toString().slice(0, 8)}...
                  </h3>
                  <span className="px-2 py-1 text-xs bg-cyan-500/20 rounded-full">
                    v{anima.version || '1.0'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm opacity-80">
                  <div>Sync Rate: 98.2%</div>
                  <div>Quantum State: Stable</div>
                  <div>Memory Blocks: {anima.memories?.length || 0}</div>
                  <div>Neural Paths: Active</div>
                </div>
              </motion.div>
            ))}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateAnima}
              className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
            >
              <div className="w-12 h-12 mb-4 rounded-full border-2 border-cyan-500 flex items-center justify-center">
                +
              </div>
              <p className="text-cyan-400 font-mono">Initialize New Neural Link</p>
            </motion.div>
          </InterfaceGrid>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400"
            >
              {error}
            </motion.div>
          )}
        </div>
      </BlurOverlay>
    </motion.div>
  );
};

export default QuantumInterface;