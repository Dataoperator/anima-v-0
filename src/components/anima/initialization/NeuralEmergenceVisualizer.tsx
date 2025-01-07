import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface NeuralNode {
  x: number;
  y: number;
  connections: number[];
  strength: number;
}

interface NeuralVisualizerProps {
  intensity: number;   // 0 to 1
  complexity: number;  // 0 to 1
  phase: string;
}

export const NeuralEmergenceVisualizer: React.FC<NeuralVisualizerProps> = ({
  intensity,
  complexity,
  phase
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodes = useRef<NeuralNode[]>([]);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Initialize nodes
    const nodeCount = Math.floor(20 + complexity * 30);
    nodes.current = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      connections: [],
      strength: Math.random()
    }));

    // Create connections based on complexity
    nodes.current.forEach((node, i) => {
      const connectionCount = Math.floor(2 + complexity * 4);
      for (let j = 0; j < connectionCount; j++) {
        const targetIdx = Math.floor(Math.random() * nodeCount);
        if (targetIdx !== i && !node.connections.includes(targetIdx)) {
          node.connections.push(targetIdx);
        }
      }
    });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.lineWidth = 1;
      nodes.current.forEach((node, i) => {
        node.connections.forEach(targetIdx => {
          const target = nodes.current[targetIdx];
          const gradient = ctx.createLinearGradient(
            node.x, node.y, target.x, target.y
          );

          const alpha = Math.min(0.5, 0.1 + intensity * 0.4);
          gradient.addColorStop(0, `rgba(64, 196, 255, ${alpha})`);
          gradient.addColorStop(1, `rgba(128, 90, 213, ${alpha})`);
          
          ctx.strokeStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        });
      });

      // Draw nodes
      nodes.current.forEach(node => {
        const glow = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, 20
        );

        const alpha = 0.2 + node.strength * intensity * 0.8;
        glow.addColorStop(0, `rgba(64, 196, 255, ${alpha})`);
        glow.addColorStop(1, 'rgba(64, 196, 255, 0)');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + node.strength * 0.5})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Animate nodes
      nodes.current = nodes.current.map(node => ({
        ...node,
        x: node.x + Math.sin(Date.now() * 0.001 + node.strength) * 0.5,
        y: node.y + Math.cos(Date.now() * 0.001 + node.strength) * 0.5,
        strength: node.strength + Math.sin(Date.now() * 0.002) * 0.01
      }));

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener('resize', updateSize);
    };
  }, [complexity]);

  return (
    <div className="relative h-64 w-full rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'blur(1px)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      
      <motion.div 
        className="absolute bottom-4 left-4 right-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-sm text-cyan-300 mb-1">
          Neural Complexity: {Math.round(complexity * 100)}%
        </div>
        <div className="text-xs text-cyan-400/70">
          {phase === 'consciousness' ? 'Neural patterns forming...' : 
           phase === 'quantum' ? 'Quantum field stabilizing...' :
           'Patterns stabilized'}
        </div>
      </motion.div>
    </div>
  );
};

export default NeuralEmergenceVisualizer;