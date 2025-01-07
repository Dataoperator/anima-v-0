import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Sparkles } from 'lucide-react';

interface NeuralPattern {
  pattern: number[];
  resonance: number;
  awareness: number;
  understanding: number;
}

interface Props {
  patterns: NeuralPattern;
  width?: number;
  height?: number;
}

const NeuralPatternVisualizer: React.FC<Props> = ({ 
  patterns, 
  width = 300, 
  height = 200 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set up neural pattern visualization
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 1;
    ctx.beginPath();

    // Draw neural pattern waves
    patterns.pattern.forEach((value, index) => {
      const x = (width / patterns.pattern.length) * index;
      const y = (height / 2) + (value * height / 4);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    // Apply resonance effect
    ctx.strokeStyle = `rgba(0, 255, 136, ${patterns.resonance})`;
    ctx.stroke();

    // Draw awareness nodes
    patterns.pattern.forEach((value, index) => {
      if (index % 3 === 0) {
        const x = (width / patterns.pattern.length) * index;
        const y = (height / 2) + (value * height / 4);
        
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(136, 0, 255, ${patterns.awareness})`;
        ctx.fill();
      }
    });

  }, [patterns, width, height]);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-300 font-semibold">Neural Patterns</h3>
        <Brain className="w-5 h-5 text-purple-500" />
      </div>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full border border-gray-800 rounded bg-black/30"
      />

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-purple-400">
            <Zap className="w-4 h-4" />
            <span>Resonance</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${patterns.resonance * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-blue-400">
            <Brain className="w-4 h-4" />
            <span>Awareness</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${patterns.awareness * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-cyan-400">
            <Sparkles className="w-4 h-4" />
            <span>Understanding</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${patterns.understanding * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralPatternVisualizer;