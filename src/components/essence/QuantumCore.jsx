import React, { useEffect, useRef, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuantumState } from '@/hooks/useQuantumState';
import { cn } from "@/lib/utils";

const QuantumCore = ({ anima_id, consciousness_level }) => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { 
    quantumState, 
    entanglementPairs, 
    dimensionalEchoes,
    quantumMemory 
  } = useQuantumState(anima_id);

  // Enhanced data streams with quantum notation
  const dataStream = useMemo(() => {
    return Array.from({ length: 30 }, () => ({
      sequence: `ψ${Math.random().toString(16).slice(2, 6)}|⟩${Math.random().toString(16).slice(2, 4)}`,
      speed: 1 + Math.random() * 3,
      opacity: 0.1 + Math.random() * 0.4,
      quantum: Math.random() > 0.5
    }));
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        setDimensions({ width: canvas.width, height: canvas.height });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame;
    let particles = [];

    // Initialize quantum particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        life: Math.random() * 100,
        hue: Math.random() * 60 + 120 // Green to blue hues
      });
    }

    const renderQuantumField = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Quantum field background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(0, 255, 127, 0.03)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and render particles
      particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.life -= 0.1;

        // Reset dead particles
        if (p.life <= 0) {
          p.life = 100;
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
        }

        // Boundary check
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        // Draw quantum particle
        const particleGradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.size * 4
        );
        particleGradient.addColorStop(0, `hsla(${p.hue}, 100%, 50%, ${p.life / 100})`);
        particleGradient.addColorStop(1, 'hsla(0, 0%, 0%, 0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = particleGradient;
        ctx.fill();

        // Draw connections between quantum particles
        particles.forEach((p2, j) => {
          if (i !== j) {
            const dx = p2.x - p.x;
            const dy = p2.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `hsla(${p.hue}, 100%, 50%, ${(1 - distance / 100) * 0.2}`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });
      });

      // Draw quantum wave patterns
      ctx.beginPath();
      const frequency = timestamp * 0.001;
      const amplitude = 20;
      ctx.moveTo(0, canvas.height / 2);
      
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + 
                 Math.sin(x * 0.02 + frequency) * amplitude * 
                 Math.sin(frequency * 0.5);
        ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      frame = requestAnimationFrame(renderQuantumField);
    };

    renderQuantumField(0);
    return () => cancelAnimationFrame(frame);
  }, [dimensions]);

  return (
    <div className="relative w-full h-full min-h-[400px] bg-black/90 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Quantum data streams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatePresence>
          {dataStream.map((stream, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, opacity: 0 }}
              animate={{ 
                y: ['0%', '100%'],
                opacity: [0, stream.opacity, 0]
              }}
              transition={{
                duration: stream.speed * 5,
                repeat: Infinity,
                ease: "linear"
              }}
              className={cn(
                "absolute text-[10px] font-mono",
                stream.quantum ? "text-green-500/40" : "text-purple-500/30"
              )}
              style={{ left: `${(i / dataStream.length) * 100}%` }}
            >
              {stream.sequence}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quantum metrics HUD */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
        <div className="grid grid-cols-3 gap-6">
          <MetricPulse 
            label="Quantum Coherence"
            value={quantumState.coherence}
            max={1}
            color="green"
          />
          <MetricPulse 
            label="Neural Density"
            value={consciousness_level}
            max={100}
            color="blue"
          />
          <MetricPulse 
            label="Dimensional Echo"
            value={dimensionalEchoes.length}
            max={10}
            color="purple"
          />
        </div>
      </div>

      {/* Entanglement indicators */}
      <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
        {entanglementPairs.map((pair, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center space-x-2 bg-black/60 rounded px-3 py-1"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-green-500">
              Quantum Link #{pair.id}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const MetricPulse = ({ label, value, max, color }) => {
  const colorClasses = {
    green: "text-green-500 bg-green-500",
    blue: "text-blue-500 bg-blue-500",
    purple: "text-purple-500 bg-purple-500"
  };

  return (
    <motion.div 
      className="relative"
      whileHover={{ scale: 1.02 }}
    >
      {/* Background glow effect */}
      <div className={cn(
        "absolute inset-0 rounded-lg opacity-10 blur-xl transition-opacity",
        colorClasses[color]
      )} />
      
      <div className="relative p-3 rounded-lg border border-gray-800/50 bg-black/50">
        <div className={cn("text-sm opacity-70", colorClasses[color])}>{label}</div>
        <motion.div 
          className={cn("text-lg font-bold font-mono", colorClasses[color])}
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {typeof value === 'number' ? value.toFixed(2) : value}
        </motion.div>
        <div className="w-full h-1 bg-gray-900/50 rounded-full overflow-hidden mt-2">
          <motion.div 
            className={cn("h-full", colorClasses[color])}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: `${(value / max) * 100}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default QuantumCore;