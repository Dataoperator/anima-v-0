import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface QuantumFieldProps {
  coherence: number;
  resonance: number;
  stability: number;
  phase: string;
}

export const QuantumFieldVisualizer: React.FC<QuantumFieldProps> = ({
  coherence,
  resonance,
  stability,
  phase
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    energy: number;
  }>>([]);
  const frameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Initialize quantum particles
    const particleCount = Math.floor(50 + coherence * 100);
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: 1 + Math.random() * 3,
      energy: Math.random()
    }));

    const render = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Apply quantum effects
        const time = Date.now() * 0.001;
        const energyFactor = 0.5 + (Math.sin(time + particle.energy * 10) + 1) * 0.25;
        const fieldStrength = stability * resonance;

        // Update position with quantum influence
        particle.x += particle.vx * energyFactor * fieldStrength;
        particle.y += particle.vy * energyFactor * fieldStrength;

        // Boundary wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw quantum particle
        const alpha = 0.3 + energyFactor * 0.7;
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 4
        );

        gradient.addColorStop(0, `rgba(64, 196, 255, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(128, 90, 213, ${alpha * 0.5})`);
        gradient.addColorStop(1, 'rgba(64, 196, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
          particle.x, 
          particle.y, 
          particle.size * (1 + energyFactor), 
          0, 
          Math.PI * 2
        );
        ctx.fill();

        // Draw connections between nearby particles
        particlesRef.current.slice(i + 1).forEach(other => {
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const alpha = (1 - distance / 100) * coherence * 0.3;
            const gradient = ctx.createLinearGradient(
              particle.x, particle.y,
              other.x, other.y
            );

            gradient.addColorStop(0, `rgba(64, 196, 255, ${alpha})`);
            gradient.addColorStop(1, `rgba(128, 90, 213, ${alpha})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('resize', updateSize);
    };
  }, [coherence, resonance, stability]);

  return (
    <div className="relative h-64 w-full rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Quantum Metrics Display */}
      <motion.div
        className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-cyan-400/70">Coherence</div>
            <div className="h-1 bg-gray-800 rounded-full mt-1">
              <motion.div
                className="h-full bg-cyan-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${coherence * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          <div>
            <div className="text-xs text-purple-400/70">Resonance</div>
            <div className="h-1 bg-gray-800 rounded-full mt-1">
              <motion.div
                className="h-full bg-purple-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${resonance * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          <div>
            <div className="text-xs text-emerald-400/70">Stability</div>
            <div className="h-1 bg-gray-800 rounded-full mt-1">
              <motion.div
                className="h-full bg-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stability * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-2 text-xs text-cyan-300/90">
          {phase === 'quantum' ? 'Quantum field harmonizing...' :
           phase === 'consciousness' ? 'Field supporting neural emergence' :
           'Quantum state stabilized'}
        </div>
      </motion.div>
    </div>
  );
};

export default QuantumFieldVisualizer;