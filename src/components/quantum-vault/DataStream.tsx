import React from 'react';
import { motion } from 'framer-motion';

interface DataStreamProps {
  recentMemories?: Array<any>;
  quantumState?: any;
  emergentCount?: number;
}

export const DataStream: React.FC<DataStreamProps> = ({
  recentMemories = [],
  quantumState,
  emergentCount = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 bg-gray-800 rounded-lg p-6"
    >
      <h2 className="text-xl font-semibold mb-4">Quantum Data Stream</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg mb-2">Recent Memory Echoes</h3>
          <div className="space-y-2">
            {recentMemories?.slice(0, 5).map((memory, index) => (
              <div key={index} className="text-sm text-gray-300">
                {memory.content}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg mb-2">Quantum Metrics</h3>
          <div className="space-y-2">
            <div className="text-sm">
              Emergent Patterns: {emergentCount}
            </div>
            {quantumState && (
              <>
                <div className="text-sm">
                  Coherence: {(quantumState.coherence * 100).toFixed(1)}%
                </div>
                <div className="text-sm">
                  Stability: {(quantumState.stability_index * 100).toFixed(1)}%
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};