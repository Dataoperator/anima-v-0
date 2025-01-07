import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnima } from '@/hooks/useAnima';
import { HexGrid } from '@/components/ui/HexGrid';
import { useAuth } from '@/hooks/useAuth';
import { Alert } from '@/components/ui/alert';

const DataStream = ({ value, label }) => (
  <div className="flex items-center space-x-2 bg-cyan-900/20 rounded-md p-2">
    <div className="text-cyan-400 font-mono">{label}</div>
    <div className="text-cyan-300 font-mono">{value}</div>
  </div>
);

const NeuralPathway = ({ active = true }) => (
  <div 
    className={`h-1 rounded-full ${
      active ? 'bg-gradient-to-r from-cyan-500 to-cyan-300' : 'bg-gray-700'
    }`}
  />
);

const QuantumState = ({ state }) => {
  const colors = {
    stable: 'bg-green-500',
    evolving: 'bg-yellow-500',
    unstable: 'bg-red-500'
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${colors[state] || colors.stable}`} />
      <span className="text-xs uppercase">{state}</span>
    </div>
  );
};

export const NexusView = () => {
  const { id } = useParams();
  const { actor, getAnima } = useAnima();
  const { identity } = useAuth();
  const [animaData, setAnimaData] = useState(null);
  const [neuralActivity, setNeuralActivity] = useState([]);
  const [systemStatus, setSystemStatus] = useState('stable');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnimaData();
    startNeuralMonitoring();
  }, [id, identity]);

  const loadAnimaData = async () => {
    try {
      if (!actor || !identity) return;
      const data = await getAnima(id);
      setAnimaData(data);
    } catch (err) {
      console.error('Failed to load anima:', err);
      setError(err.message);
    }
  };

  const startNeuralMonitoring = () => {
    // Simulated neural activity for visual effect
    const interval = setInterval(() => {
      setNeuralActivity(prev => [
        ...prev.slice(-20),
        Math.random() * 100
      ]);
    }, 1000);

    return () => clearInterval(interval);
  };

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <div className="font-mono text-sm">{error}</div>
      </Alert>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black text-cyan-500 p-4"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Neural Interface */}
        <div className="lg:col-span-2">
          <div className="bg-black/40 backdrop-blur-lg border border-cyan-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-mono mb-4 text-cyan-400">
              Neural Interface {id?.slice(0, 8)}...
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <DataStream 
                label="Sync Rate" 
                value={`${(Math.random() * 20 + 80).toFixed(1)}%`} 
              />
              <DataStream 
                label="Memory Blocks" 
                value={animaData?.memories?.length || 0} 
              />
              <DataStream 
                label="Neural Paths" 
                value={`${(Math.random() * 500 + 1000).toFixed(0)}`} 
              />
              <DataStream 
                label="Quantum State" 
                value={systemStatus.toUpperCase()} 
              />
            </div>

            {/* Neural Activity Visualization */}
            <div className="h-48 bg-black/60 rounded-lg p-4 mb-6">
              <div className="h-full flex items-end space-x-1">
                {neuralActivity.map((value, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    className="w-2 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-t"
                  />
                ))}
              </div>
            </div>

            {/* Neural Pathways */}
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <NeuralPathway key={i} active={Math.random() > 0.3} />
              ))}
            </div>
          </div>
        </div>

        {/* Quantum States */}
        <div className="bg-black/40 backdrop-blur-lg border border-cyan-500/30 rounded-lg p-6">
          <h2 className="text-xl font-mono mb-4 text-cyan-400">
            Quantum Matrix
          </h2>
          
          <HexGrid
            className="h-[400px] w-full"
            hexSize={20}
            spacing={2}
            pattern="random"
          />

          <div className="mt-6 space-y-4">
            <div className="bg-black/60 rounded-lg p-4">
              <h3 className="text-sm font-mono mb-2">System Status</h3>
              <QuantumState state={systemStatus} />
            </div>

            <div className="bg-black/60 rounded-lg p-4">
              <h3 className="text-sm font-mono mb-2">Active Processes</h3>
              <div className="space-y-2">
                {['Neural Sync', 'Memory Index', 'Quantum Field'].map(process => (
                  <div key={process} className="flex justify-between text-xs">
                    <span>{process}</span>
                    <span className="text-cyan-300">ACTIVE</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};