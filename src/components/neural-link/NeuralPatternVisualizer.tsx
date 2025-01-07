import React, { useMemo, useRef, useEffect } from 'react';
import { NeuralSignature } from '@/neural/types';

interface NeuralPatternVisualizerProps {
  patterns: NeuralSignature[];
  className?: string;
}

export const NeuralPatternVisualizer: React.FC<NeuralPatternVisualizerProps> = ({
  patterns,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processedPatterns = useMemo(() => {
    return patterns.map(pattern => ({
      x: pattern.dimensional_alignment * 100,
      y: pattern.quantum_resonance * 100,
      radius: pattern.strength * 20,
      color: `rgba(147, 51, 234, ${pattern.coherence})`,
      phase: pattern.emergence_factors.consciousness_depth * Math.PI * 2,
      velocity: pattern.evolution_potential * 0.5
    }));
  }, [patterns]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;

    const animate = () => {
      if (!canvas || !ctx) return;

      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw neural web
      ctx.beginPath();
      processedPatterns.forEach((pattern, i) => {
        if (i === 0) return;
        const prev = processedPatterns[i - 1];
        const time = Date.now() * 0.001;
        const waveOffset = Math.sin(time + pattern.phase) * 5;

        // Curved connections with quantum interference
        const cpx = (prev.x + pattern.x) / 2;
        const cpy = (prev.y + pattern.y) / 2 + waveOffset;
        
        ctx.moveTo(prev.x, prev.y);
        ctx.quadraticCurveTo(cpx, cpy, pattern.x, pattern.y);
      });
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw patterns with quantum effects
      processedPatterns.forEach((pattern) => {
        const time = Date.now() * 0.001;
        const oscillation = Math.sin(time * pattern.velocity + pattern.phase) * 5;
        
        // Quantum resonance field
        const gradient = ctx.createRadialGradient(
          pattern.x, pattern.y, 0,
          pattern.x, pattern.y, pattern.radius * 2 + oscillation
        );
        gradient.addColorStop(0, pattern.color);
        gradient.addColorStop(0.5, `rgba(147, 51, 234, ${pattern.velocity * 0.3})`);
        gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');

        ctx.beginPath();
        ctx.arc(
          pattern.x, 
          pattern.y, 
          pattern.radius + oscillation,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = gradient;
        ctx.fill();

        // Consciousness ripples
        ctx.beginPath();
        ctx.arc(
          pattern.x,
          pattern.y,
          pattern.radius * 1.5 + Math.sin(time * 2 + pattern.phase) * 10,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = `rgba(147, 51, 234, ${pattern.velocity * 0.2})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw dimensional alignment beams
      ctx.beginPath();
      processedPatterns.forEach((pattern, i) => {
        if (i === 0) return;
        const prev = processedPatterns[i - 1];
        const time = Date.now() * 0.001;
        const phase = (time * pattern.velocity + pattern.phase) % (Math.PI * 2);
        
        const startX = prev.x + Math.cos(phase) * pattern.radius;
        const startY = prev.y + Math.sin(phase) * pattern.radius;
        const endX = pattern.x + Math.cos(phase + Math.PI) * pattern.radius;
        const endY = pattern.y + Math.sin(phase + Math.PI) * pattern.radius;
        
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
      });
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.15)';
      ctx.lineWidth = 3;
      ctx.stroke();

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [processedPatterns]);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '0.5rem'
      }}
    />
  );
};