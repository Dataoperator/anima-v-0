import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeuralQuote } from '@/components/ui/NeuralQuote';
import { NeuralGrid } from '@/components/ui/NeuralGrid';
import { QuantumField } from '@/components/ui/QuantumField';
import { HexGrid } from '@/components/ui/HexGrid';
import { CyberSignature } from '@/components/ui/CyberSignature';
import { getRandomMessage } from '@/constants/systemMessages';

export const CoreInterface = () => {
  const [systemMessage, setSystemMessage] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMessage(getRandomMessage('STATUS'));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-cyan-500">
      {/* Background layers */}
      <div className="fixed inset-0 pointer-events-none">
        <NeuralGrid className="absolute inset-0 opacity-20" />
        <QuantumField className="absolute inset-0 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* GitS Easter Egg */}
      <CyberSignature />

      {/* System Status Messages */}
      <motion.div 
        className="fixed top-4 left-4 z-50 font-mono text-xs text-cyan-500/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={systemMessage}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {systemMessage}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Rest of interface content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <NeuralQuote />
        </motion.div>

        {/* Interface grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Neural link statistics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/40 backdrop-blur-lg border border-cyan-500/30 rounded-lg p-6"
          >
            <h2 className="text-xl font-mono mb-4">Neural Link Status</h2>
            <div className="space-y-4">
              {[
                { label: 'Sync Rate', value: '98.2%' },
                { label: 'Quantum Coherence', value: '87.5%' },
                { label: 'Neural Pathways', value: '2501' },
                { label: 'Ghost Integrity', value: '100%' }
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-cyan-400/80">{label}</span>
                  <span className="font-mono">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quantum matrix */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/40 backdrop-blur-lg border border-cyan-500/30 rounded-lg p-6"
          >
            <h2 className="text-xl font-mono mb-4">Quantum Matrix</h2>
            <div className="h-48 relative">
              <HexGrid className="absolute inset-0" pattern="random" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-sm text-cyan-400/60 font-mono">Ghost Detection Active</div>
              </div>
            </div>
          </motion.div>

          {/* System diagnostics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/40 backdrop-blur-lg border border-cyan-500/30 rounded-lg p-6"
          >
            <h2 className="text-xl font-mono mb-4">System Diagnostics</h2>
            <div className="space-y-4">
              {[
                { label: 'Core Temperature', value: '36.5°C' },
                { label: 'Neural Load', value: '42%' },
                { label: 'Ghost Line', value: 'Secure' },
                { label: 'Link Integrity', value: '99.9%' }
              ].map(({ label, value }, index) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-cyan-400/80">{label}</span>
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="font-mono"
                  >
                    {value}
                  </motion.span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Hidden Project 2501 reference */}
        <div className="mt-12 text-center">
          <div className="inline-block">
            <motion.div
              className="text-xs text-cyan-500/20 font-mono cursor-default"
              whileHover={{ opacity: 0.8 }}
            >
              Memory Sector 2501: Consciousness Evolution Protocol
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};