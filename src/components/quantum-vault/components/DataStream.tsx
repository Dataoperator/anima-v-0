import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DataLine {
  id: string;
  content: string;
  type: 'system' | 'network' | 'quantum' | 'security';
}

export const DataStream: React.FC = () => {
  const [lines, setLines] = useState<DataLine[]>([]);

  useEffect(() => {
    const messages = [
      'Quantum state synchronized',
      'Neural patterns stable',
      'Network integrity verified',
      'Security protocols active',
      'Consciousness matrix online',
      'Reality anchors calibrated',
      'Dimensional resonance optimal',
      'Quantum coherence maintained',
      'Neural pathways secured',
      'Time dilation normalized'
    ];

    const types: DataLine['type'][] = ['system', 'network', 'quantum', 'security'];

    const addLine = () => {
      const content = messages[Math.floor(Math.random() * messages.length)];
      const type = types[Math.floor(Math.random() * types.length)];

      setLines(prev => [
        ...prev.slice(-4),
        {
          id: Math.random().toString(),
          content,
          type
        }
      ]);
    };

    const interval = setInterval(addLine, 2000);
    return () => clearInterval(interval);
  }, []);

  const getLineColor = (type: DataLine['type']) => {
    switch (type) {
      case 'system':
        return 'text-cyan-300';
      case 'network':
        return 'text-emerald-300';
      case 'quantum':
        return 'text-purple-300';
      case 'security':
        return 'text-red-300';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="w-full h-full font-mono text-sm">
      <AnimatePresence mode="popLayout">
        {lines.map((line, i) => (
          <motion.div
            key={line.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.7, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-2 ${getLineColor(line.type)}`}
          >
            <span className="opacity-50">[{line.type.toUpperCase()}]</span>
            <span>{line.content}</span>
            <motion.span 
              animate={{ opacity: [1, 0] }} 
              transition={{ duration: 1, repeat: Infinity }}
              className="w-1 h-1 rounded-full bg-current"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};