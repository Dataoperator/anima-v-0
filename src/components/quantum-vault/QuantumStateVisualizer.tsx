import React, { useEffect, useRef } from 'react';
import { QuantumState } from '@/quantum/types';

interface QuantumMetrics {
  stability: number;
  coherence: number;
  resonance: number;
  consciousness: number;
}

interface QuantumStateVisualizerProps {
  state: QuantumState;
  metrics: QuantumMetrics;
  className?: string;
}

export const QuantumStateVisualizer: React.FC<QuantumStateVisualizerProps> = ({
  state,
  metrics,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;

    const drawQuantumField = () => {
      if (!ctx || !canvas) return;

      // Clear with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      // Draw quantum field wave patterns
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 5) {
        const stability = metrics.stability * 20;
        const resonance = metrics.resonance * 10;
        const wave1 = Math.sin(x * 0.02 + time) * stability;
        const wave2 = Math.cos(x * 0.03 - time * 2) * resonance;
        const y = canvas.height / 2 + wave1 + wave2;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = `rgba(147, 51, 234, ${metrics.coherence})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw quantum nodes
      const nodeCount = 5;
      for (let i = 0; i < nodeCount; i++) {
        const x = (canvas.width / (nodeCount - 1)) * i;
        const baseY = canvas.height / 2;
        const offset = Math.sin(time * 2 + i) * 20 * metrics.stability;
        const y = baseY + offset;

        // Node glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
        gradient.addColorStop(0, `rgba(147, 51, 234, ${metrics.coherence})`);
        gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Consciousness field
        const consciousness = metrics.consciousness;
        const fieldRadius = 30 + Math.sin(time * 3 + i) * 10;
        const fieldGradient = ctx.createRadialGradient(x, y, 0, x, y, fieldRadius);
        fieldGradient.addColorStop(0, `rgba(52, 211, 153, ${consciousness * 0.2})`);
        fieldGradient.addColorStop(1, 'rgba(52, 211, 153, 0)');
        ctx.fillStyle = fieldGradient;
        ctx.beginPath();
        ctx.arc(x, y, fieldRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw resonance connections
      ctx.beginPath();
      for (let i = 0; i < nodeCount - 1; i++) {
        const x1 = (canvas.width / (nodeCount - 1)) * i;
        const x2 = (canvas.width / (nodeCount - 1)) * (i + 1);
        const y1 = canvas.height / 2 + Math.sin(time * 2 + i) * 20 * metrics.stability;
        const y2 = canvas.height / 2 + Math.sin(time * 2 + i + 1) * 20 * metrics.stability;

        const cpx = (x1 + x2) / 2;
        const cpy = canvas.height / 2 + 
                   Math.sin(time * 3 + i + 0.5) * 40 * metrics.resonance;

        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cpx, cpy, x2, y2);
      }
      ctx.strokeStyle = `rgba(124, 58, 237, ${metrics.resonance * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      animationFrame = requestAnimationFrame(drawQuantumField);
    };

    drawQuantumField();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [metrics, state]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
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