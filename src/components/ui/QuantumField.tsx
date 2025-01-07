import React, { useEffect, useRef } from 'react';

interface QuantumParticle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  phase: number;
  frequency: number;
  coherence: number;
  entangled?: QuantumParticle;
}

interface QuantumFieldProps {
  intensity?: number;
  coherence?: number;
  resonance?: number;
  className?: string;
}

export const QuantumField: React.FC<QuantumFieldProps> = ({ 
  intensity = 0.5,
  coherence = 0.5,
  resonance = 0.5,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<QuantumParticle[]>([]);
  const requestIdRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createEntangledPair = (particle: QuantumParticle): QuantumParticle => ({
      x: canvas.width - particle.x,
      y: canvas.height - particle.y,
      radius: particle.radius,
      speed: particle.speed,
      phase: particle.phase + Math.PI, // Opposite phase
      frequency: particle.frequency,
      coherence: particle.coherence,
      entangled: particle
    });

    const initParticles = () => {
      particles.current = [];
      const baseParticles = Math.floor(30 * intensity);
      const entangledPairs = Math.floor(10 * coherence);
      
      // Create normal particles
      for (let i = 0; i < baseParticles; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.max(1, Math.random() * 3 * intensity),
          speed: Math.max(0.1, Math.random() * intensity),
          phase: Math.random() * Math.PI * 2,
          frequency: 0.01 + Math.random() * 0.02,
          coherence: Math.random()
        });
      }

      // Create entangled pairs
      for (let i = 0; i < entangledPairs; i++) {
        const particle: QuantumParticle = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.max(2, Math.random() * 4 * intensity),
          speed: Math.max(0.2, Math.random() * intensity),
          phase: Math.random() * Math.PI * 2,
          frequency: 0.02 + Math.random() * 0.03,
          coherence: coherence
        };
        const entangledParticle = createEntangledPair(particle);
        particle.entangled = entangledParticle;
        particles.current.push(particle, entangledParticle);
      }
    };

    const drawQuantumField = () => {
      ctx.fillStyle = `rgba(0, 0, 0, ${0.1 / intensity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      timeRef.current += 0.016; // ~60fps

      // Update and draw particles
      particles.current.forEach(particle => {
        // Quantum wave behavior
        const waveOffset = Math.sin(timeRef.current * particle.frequency + particle.phase) * 2;
        particle.y -= particle.speed + (waveOffset * particle.coherence);
        
        if (particle.y < 0) {
          particle.y = canvas.height;
          particle.x = Math.random() * canvas.width;
          if (particle.entangled) {
            particle.entangled.y = 0;
            particle.entangled.x = canvas.width - particle.x;
          }
        }

        // Quantum glow effect
        const glowIntensity = 0.3 + Math.sin(timeRef.current * particle.frequency) * 0.2;
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * (1 + particle.coherence)
        );

        // Color based on entanglement and resonance
        const hue = particle.entangled ? 200 + (resonance * 60) : 180;
        const saturation = 80 + (coherence * 20);
        gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, 50%, ${glowIntensity})`);
        gradient.addColorStop(1, 'hsla(200, 100%, 50%, 0)');

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * (1 + Math.sin(timeRef.current) * 0.2), 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw entanglement connections
        if (particle.entangled) {
          const opacity = (coherence * 0.3) * (1 + Math.sin(timeRef.current * 2) * 0.2);
          ctx.beginPath();
          ctx.strokeStyle = `hsla(200, 100%, 50%, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.entangled.x, particle.entangled.y);
          ctx.stroke();
        }
      });

      // Quantum interference patterns
      ctx.strokeStyle = `hsla(200, 100%, 50%, ${0.05 * resonance})`;
      ctx.lineWidth = 0.5;

      particles.current.forEach((p1, i) => {
        particles.current.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 100 * (1 + coherence);

          if (distance < maxDistance) {
            const interference = Math.cos(timeRef.current + p1.phase - p2.phase);
            const opacity = (1 - distance / maxDistance) * Math.abs(interference) * 0.3;
            
            ctx.beginPath();
            ctx.strokeStyle = `hsla(200, 100%, 50%, ${opacity})`;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      requestIdRef.current = requestAnimationFrame(drawQuantumField);
    };

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    initParticles();
    drawQuantumField();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [intensity, coherence, resonance]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ background: 'transparent' }}
    />
  );
};