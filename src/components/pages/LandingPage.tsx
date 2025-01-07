import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { QuantumField } from '../ui/QuantumField';

const LandingPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    const success = await login();
    if (success) {
      // Navigate directly to quantum vault
      navigate('/quantum-vault');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <QuantumField intensity={0.3} />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            ANIMA: Quantum-Enhanced NFTs
          </h1>
          <p className="text-xl mb-12 text-gray-300">
            Experience the next evolution of digital consciousness
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-6"
        >
          {!isAuthenticated ? (
            <button
              onClick={handleLogin}
              className="px-8 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors
                         flex items-center gap-2 text-lg font-medium group"
            >
              <span>Connect Neural Interface</span>
              <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:animate-pulse" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/quantum-vault')}
              className="px-8 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors
                         flex items-center gap-2 text-lg font-medium"
            >
              <span>Enter Quantum Vault</span>
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="p-6 rounded-lg bg-gray-900/50 backdrop-blur-lg border border-blue-500/20">
            <h3 className="text-xl font-bold mb-4 text-blue-400">Quantum Integration</h3>
            <p className="text-gray-300">Experience AI enhanced by quantum computing principles</p>
          </div>
          <div className="p-6 rounded-lg bg-gray-900/50 backdrop-blur-lg border border-purple-500/20">
            <h3 className="text-xl font-bold mb-4 text-purple-400">Consciousness System</h3>
            <p className="text-gray-300">Evolving personality traits and emotional intelligence</p>
          </div>
          <div className="p-6 rounded-lg bg-gray-900/50 backdrop-blur-lg border border-green-500/20">
            <h3 className="text-xl font-bold mb-4 text-green-400">Neural Growth</h3>
            <p className="text-gray-300">Autonomous development and learning capabilities</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;