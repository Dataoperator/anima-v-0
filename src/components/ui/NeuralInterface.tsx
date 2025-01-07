import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Particles from 'react-particles';
import { loadFull } from 'tsparticles';

interface NeuralInterfaceProps {
  className?: string;
  onInitialized?: () => void;
}

const synapseConfig = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: "#00ffff"
    },
    shape: {
      type: "circle"
    },
    opacity: {
      value: 0.5,
      random: false
    },
    size: {
      value: 3,
      random: true
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#00ffff",
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "repulse"
      },
      resize: true
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4
      }
    }
  },
  retina_detect: true
};

const NeuralInterface: React.FC<NeuralInterfaceProps> = ({ 
  className = '', 
  onInitialized = () => {} 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let animationFrame: number;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const neurons: { x: number; y: number; vx: number; vy: number }[] = [];
    const numNeurons = 50;

    // Initialize neurons
    for (let i = 0; i < numNeurons; i++) {
      neurons.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw neurons
      neurons.forEach(neuron => {
        neuron.x += neuron.vx;
        neuron.y += neuron.vy;

        // Bounce off edges
        if (neuron.x < 0 || neuron.x > canvas.width) neuron.vx *= -1;
        if (neuron.y < 0 || neuron.y > canvas.height) neuron.vy *= -1;

        // Draw connections
        neurons.forEach(other => {
          const dx = other.x - neuron.x;
          const dy = other.y - neuron.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(neuron.x, neuron.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(0, 255, 255, ${1 - distance / 150})`;
            ctx.stroke();
          }
        });
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const particlesInit = async (engine: any) => {
    await loadFull(engine);
    onInitialized();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Neural Network Canvas Background */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      {/* Particle System Overlay */}
      <Particles
        className="absolute inset-0 z-10"
        options={synapseConfig}
        init={particlesInit}
      />

      {/* Neural Interface Elements */}
      <div className="relative z-20">
        {/* Interface Grid */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at center, rgba(0,255,255,0.1) 1px, transparent 1px),
              linear-gradient(rgba(0,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 20px 20px, 20px 20px',
            backgroundPosition: 'center',
          }}
        />

        {/* Neural Pulse Rings */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border border-cyan-500/20 rounded-full"
            animate={{
              scale: [1, 2, 1],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 4,
              delay: i * 1.3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Data Stream Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 200 + 100}px`,
              }}
              animate={{
                top: ['-100%', '200%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Interface Corners */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-16 h-16"
            style={{
              top: i < 2 ? '0' : 'auto',
              bottom: i >= 2 ? '0' : 'auto',
              left: i % 2 === 0 ? '0' : 'auto',
              right: i % 2 === 1 ? '0' : 'auto',
            }}
          >
            <motion.div
              className="w-full h-full"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.5,
              }}
            >
              <svg viewBox="0 0 64 64" className="w-full h-full">
                <path
                  d="M0 0 L24 0 L24 4 L4 4 L4 24 L0 24 Z"
                  fill="none"
                  stroke="rgba(0, 255, 255, 0.5)"
                  strokeWidth="2"
                  transform={`rotate(${i * 90} 32 32)`}
                />
              </svg>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeuralInterface;