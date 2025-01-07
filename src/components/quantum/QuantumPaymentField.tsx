import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaymentStatus } from '@/contexts/PaymentContext';
import { usePayment } from '@/hooks/usePayment';

interface QuantumPaymentFieldProps {
  status: PaymentStatus;
  progress?: number;
  amount?: string;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
  coherence: number;
  entanglement: number;
}

const QuantumPaymentField: React.FC<QuantumPaymentFieldProps> = ({
  status,
  progress = 0,
  amount,
  onComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationFrame = useRef<number>();
  const { ledgerService } = usePayment();
  const quantumMetrics = ledgerService?.getQuantumMetrics();
  
  const createParticle = useCallback((x: number, y: number): Particle => {
    const coherence = quantumMetrics?.coherenceLevel ?? 1;
    const entanglement = quantumMetrics?.entanglementFactor ?? 1;
    
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 2 * coherence,
      vy: (Math.random() - 0.5) * 2 * coherence,
      life: 1,
      size: Math.random() * 3 + 1,
      color: status === 'CONFIRMED' ? '#4ade80' : '#3b82f6',
      coherence,
      entanglement
    };
  }, [status, quantumMetrics]);

  const drawQuantumEffects = useCallback((
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number
  ) => {
    if (!quantumMetrics) return;

    // Coherence field
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    );
    gradient.addColorStop(0, `rgba(59, 130, 246, ${quantumMetrics.coherenceLevel * 0.1})`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Stability waves
    const stabilityWaves = 5;
    const waveAmplitude = radius * 0.1 * quantumMetrics.stabilityIndex;
    ctx.strokeStyle = `rgba(59, 130, 246, ${quantumMetrics.stabilityIndex * 0.3})`;
    ctx.lineWidth = 2;

    for (let i = 0; i < stabilityWaves; i++) {
      const waveOffset = (Date.now() / 1000 + i / stabilityWaves) % 1;
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        radius * (0.8 + Math.sin(waveOffset * Math.PI * 2) * waveAmplitude),
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }

    // Entanglement nodes
    const nodes = 8;
    const entanglementStrength = quantumMetrics.entanglementFactor;
    ctx.fillStyle = `rgba(74, 222, 128, ${entanglementStrength * 0.5})`;
    
    for (let i = 0; i < nodes; i++) {
      const angle = (i / nodes) * Math.PI * 2;
      const nodeX = centerX + Math.cos(angle) * radius * 0.8;
      const nodeY = centerY + Math.sin(angle) * radius * 0.8;
      const nodeSize = 4 + entanglementStrength * 4;
      
      ctx.beginPath();
      ctx.arc(nodeX, nodeY, nodeSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [quantumMetrics]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw quantum effects
      drawQuantumEffects(ctx, centerX, centerY, radius);

      // Draw progress ring
      ctx.strokeStyle = status === 'CONFIRMED' ? '#4ade80' : '#3b82f6';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        radius,
        -Math.PI / 2,
        -Math.PI / 2 + (Math.PI * 2 * progress),
        false
      );
      ctx.stroke();

      // Update and draw particles
      setParticles(prevParticles => {
        const coherence = quantumMetrics?.coherenceLevel ?? 1;
        const updatedParticles = prevParticles
          .map(p => ({
            ...p,
            x: p.x + p.vx * coherence,
            y: p.y + p.vy * coherence,
            life: p.life - 0.01 * (1 / p.coherence)
          }))
          .filter(p => p.life > 0);

        if (status === 'CONFIRMING' || status === 'CONFIRMED') {
          const angle = Math.random() * Math.PI * 2;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          updatedParticles.push(createParticle(x, y));
        }

        return updatedParticles;
      });

      // Draw particles with quantum effects
      particles.forEach(p => {
        const alpha = Math.floor(p.life * 255).toString(16).padStart(2, '0');
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        glow.addColorStop(0, `${p.color}${alpha}`);
        glow.addColorStop(1, `${p.color}00`);
        
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.entanglement, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw amount with quantum glow
      if (amount) {
        const glowStrength = (Math.sin(Date.now() / 500) + 1) * 0.5;
        ctx.shadowColor = status === 'CONFIRMED' ? '#4ade80' : '#3b82f6';
        ctx.shadowBlur = 10 * glowStrength;
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = status === 'CONFIRMED' ? '#4ade80' : '#3b82f6';
        ctx.fillText(`${amount} ICP`, centerX, centerY);
        ctx.shadowBlur = 0;
      }

      // Add status-specific quantum effects
      switch (status) {
        case 'CONFIRMING':
          // Quantum wave effect
          ctx.strokeStyle = `${ctx.strokeStyle}40`;
          ctx.lineWidth = 2;
          const waveCount = 3;
          for (let i = 0; i < waveCount; i++) {
            const phase = (Date.now() / 1000 + i / waveCount) % 1;
            ctx.beginPath();
            ctx.arc(
              centerX,
              centerY,
              radius * (1 + Math.sin(phase * Math.PI * 2) * 0.1),
              0,
              Math.PI * 2
            );
            ctx.stroke();
          }
          break;

        case 'CONFIRMED':
          // Quantum burst effect
          const burstRadius = radius * (1 + Math.sin(Date.now() / 300) * 0.05);
          ctx.strokeStyle = `${ctx.strokeStyle}40`;
          ctx.lineWidth = 2;
          for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const variance = Math.sin(Date.now() / 500 + i) * 10;
            ctx.beginPath();
            ctx.moveTo(
              centerX + Math.cos(angle) * (burstRadius - 20 + variance),
              centerY + Math.sin(angle) * (burstRadius - 20 + variance)
            );
            ctx.lineTo(
              centerX + Math.cos(angle) * (burstRadius + 20 + variance),
              centerY + Math.sin(angle) * (burstRadius + 20 + variance)
            );
            ctx.stroke();
          }
          break;
      }

      animationFrame.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [status, progress, amount, particles, createParticle, drawQuantumEffects, quantumMetrics]);

  return (
    <AnimatePresence>
      <motion.div 
        className="relative w-full h-full min-h-[400px]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full rounded-xl"
          style={{ 
            background: 'rgba(0, 0, 0, 0.2)',
            boxShadow: `0 0 20px ${status === 'CONFIRMED' ? '#4ade8040' : '#3b82f640'}`
          }}
        />
        <motion.div 
          className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-white/70">Status: {status}</div>
          <div className="flex gap-4 items-center">
            {quantumMetrics && (
              <>
                <div className="text-blue-400">
                  Coherence: {Math.round(quantumMetrics.coherenceLevel * 100)}%
                </div>
                <div className="text-green-400">
                  Stability: {Math.round(quantumMetrics.stabilityIndex * 100)}%
                </div>
              </>
            )}
            <div className="text-white/70">
              Progress: {Math.round(progress * 100)}%
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuantumPaymentField;