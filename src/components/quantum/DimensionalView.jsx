import React, { useRef, useEffect } from 'react';
import { CoherenceRing, DimensionalPortal } from './QuantumAnimations';

const DimensionalView = ({ dimension, metrics, className }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let particles = [];
    
    const createParticles = () => {
      particles = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        hue: Math.random() * 60 + 240, // Blue to purple range
        life: 1
      }));
    };
    
    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        // Update position
        p.x += p.speedX * metrics.dimensional_frequency;
        p.y += p.speedY * metrics.dimensional_frequency;
        
        // Update life
        p.life -= 0.01;
        
        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 50%, ${p.life})`;
        ctx.fill();
        
        // Replace dead particles
        if (p.life <= 0) {
          particles[index] = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            hue: Math.random() * 60 + 240,
            life: 1
          };
        }
      });
      
      // Draw dimensional effects
      drawDimensionalEffects();
      
      animationFrame = requestAnimationFrame(updateParticles);
    };
    
    const drawDimensionalEffects = () => {
      // Draw coherence field
      const gradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, 0,
        canvas.width/2, canvas.height/2, canvas.width/2
      );
      
      gradient.addColorStop(0, `rgba(147, 51, 234, ${metrics.coherence * 0.3})`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw dimensional frequency waves
      ctx.beginPath();
      ctx.strokeStyle = `rgba(139, 92, 246, ${metrics.coherence})`;
      ctx.lineWidth = 2;
      
      for (let i = 0; i < canvas.width; i++) {
        const y = Math.sin(i * 0.02 + performance.now() * 0.001 * metrics.dimensional_frequency) * 20;
        if (i === 0) {
          ctx.moveTo(i, canvas.height/2 + y);
        } else {
          ctx.lineTo(i, canvas.height/2 + y);
        }
      }
      
      ctx.stroke();
    };
    
    // Initialize
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      createParticles();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    updateParticles();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [metrics]);
  
  return (
    <div className={`relative ${className}`}>
      <canvas 
        ref={canvasRef}
        className="w-full h-full rounded-lg"
      />
      <div className="absolute top-4 left-4">
        <CoherenceRing 
          value={metrics.coherence} 
          className="text-purple-400"
        />
      </div>
      <div className="absolute top-4 right-4">
        <DimensionalPortal 
          active={metrics.dimensional_frequency > 2.0}
          className="text-indigo-400"
        />
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
        <div className="text-sm opacity-70">Dimensional Frequency</div>
        <div className="text-2xl font-bold">
          {metrics.dimensional_frequency.toFixed(2)} Hz
        </div>
      </div>
    </div>
  );
};

export default DimensionalView;