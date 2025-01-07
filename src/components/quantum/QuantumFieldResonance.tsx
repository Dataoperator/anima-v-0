import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Sparkles, Waves, Zap } from 'lucide-react';

interface Props {
  fieldStrength: number;
  resonanceSignature?: string;
  harmony: number;
  onResonanceChange?: (harmony: number) => void;
}

const QuantumFieldResonance: React.FC<Props> = ({
  fieldStrength,
  resonanceSignature,
  harmony,
  onResonanceChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const controls = useAnimation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Array<{
      x: number;
      y: number;
      speed: number;
      size: number;
      color: string;
    }> = [];

    const createParticles = () => {
      particles = [];
      const numParticles = Math.floor(fieldStrength * 100);
      
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: (Math.random() * 2 + 1) * fieldStrength,
          size: Math.random() * 3 + 1,
          color: `hsl(${180 + Math.random() * 60}, 100%, ${50 + Math.random() * 20}%)`
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw resonance field
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );

      gradient.addColorStop(0, `rgba(0, 255, 255, ${harmony * 0.1})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw quantum particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Update particle position
        particle.y -= particle.speed;
        if (particle.y < 0) {
          particle.y = canvas.height;
          particle.x = Math.random() * canvas.width;
        }
      });

      animationFrameRef.current = requestAnimationFrame(drawParticles);
    };

    createParticles();
    drawParticles();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [fieldStrength, harmony]);

  useEffect(() => {
    controls.start({
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });
  }, []);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-300 font-semibold">Quantum Field</h3>
        <Sparkles className="w-5 h-5 text-cyan-500" />
      </div>

      <motion.div
        animate={controls}
        className="relative rounded-lg overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="w-full h-full bg-black/30"
        />
      </motion.div>

      <div className="mt-4 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-cyan-400">
              <Waves className="w-4 h-4" />
              <span>Field Strength</span>
            </div>
            <span className="text-cyan-500">{Math.round(fieldStrength * 100)}%</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${fieldStrength * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-purple-400">
              <Zap className="w-4 h-4" />
              <span>Harmonic Resonance</span>
            </div>
            <span className="text-purple-500">{Math.round(harmony * 100)}%</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${harmony * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </div>

      {resonanceSignature && (
        <div className="mt-4 pt-3 border-t border-gray-800">
          <div className="text-xs text-gray-500">Quantum Signature</div>
          <div className="font-mono text-xs text-gray-400 break-all">
            {resonanceSignature}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantumFieldResonance;