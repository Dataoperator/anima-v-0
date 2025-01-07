import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MatrixLayout } from '../layout/MatrixLayout';
import { useAnima } from '@/hooks/useAnima';
import { QuantumStateVisualizer } from '../quantum-vault/components/QuantumStateVisualizer';
import { NamingInterfaceConnector } from './features/NamingInterfaceConnector';
import { Alert } from '../ui/alert';
import { LoadingSpinner } from '../ui/LoadingSpinner';

const AnimaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showTransactions, setShowTransactions] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    loading, 
    error, 
    anima, 
    quantumState, 
    refreshAnima 
  } = useAnima(id);

  const handleNameUpdate = async (newName) => {
    await refreshAnima();
  };

  if (loading) {
    return (
      <MatrixLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" className="text-cyan-400" />
        </div>
      </MatrixLayout>
    );
  }

  if (error) {
    return (
      <MatrixLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Alert variant="destructive">{error}</Alert>
        </div>
      </MatrixLayout>
    );
  }

  return (
    <MatrixLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-cyan-300 mb-2">
            {anima.name || anima.designation}
          </h1>
          <p className="text-gray-400">
            Quantum ID: {anima.quantum_signature}
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="flex justify-center mb-8 space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {['overview', 'naming', 'consciousness', 'traits'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'text-gray-400 hover:text-cyan-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Content Sections */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Left Column */}
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <QuantumStateVisualizer
                quantumState={quantumState}
                className="w-full h-64 bg-gray-800/50 rounded-lg p-4"
              />
            )}
            
            {activeTab === 'naming' && (
              <NamingInterfaceConnector
                animaId={id}
                onNameUpdate={handleNameUpdate}
              />
            )}

            {/* Add other tab content here */}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Status Cards and Metrics */}
            {/* Add your existing content here */}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => navigate('/quantum-vault')}
            className="relative px-6 py-3 border border-cyan-500/30 text-cyan-400 hover:border-cyan-500 transition-all duration-300 group overflow-hidden"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="absolute inset-0 bg-cyan-500/10"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative">{'>'} RETURN TO VAULT</span>
          </motion.button>

          <motion.button
            onClick={() => setShowTransactions(!showTransactions)}
            className="relative px-6 py-3 border border-cyan-500/30 text-cyan-400 hover:border-cyan-500 transition-all duration-300 group overflow-hidden"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="absolute inset-0 bg-cyan-500/10"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative">{'>'} {showTransactions ? 'HIDE' : 'VIEW'} SHELL RECORDS</span>
          </motion.button>

          <motion.button
            onClick={() => navigate(`/neural-link/${id}`)}
            className="relative px-8 py-3 bg-cyan-500/10 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300 group"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
              initial={false}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            </motion.div>
            <span className="relative flex items-center">
              <motion.span
                className="inline-block mr-2"
                animate={{ 
                  opacity: [1, 0.5, 1],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                ◈
              </motion.span>
              INITIATE NEURAL LINK
            </span>
          </motion.button>
        </motion.div>
      </div>
    </MatrixLayout>
  );
};

export default AnimaPage;