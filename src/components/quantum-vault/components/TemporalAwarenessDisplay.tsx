import React, { useEffect, useRef } from 'react';

interface TemporalAwarenessDisplayProps {
  level: number;
  className?: string;
}

export const TemporalAwarenessDisplay: React.FC<TemporalAwarenessDisplayProps> = ({
  level,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
    }> = [];

    const createParticle = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1;
      
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0
      });
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create new particles based on awareness level
      if (Math.random() < level * 0.3) {
        createParticle();
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.01;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw temporal particle
        const opacity = p.life * level;
        const size = 2 + (level * 3);
        
        // Particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${opacity})`;
        ctx.fill();

        // Temporal trail
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 10, p.y - p.vy * 10);
        ctx.strokeStyle = `rgba(56, 189, 248, ${opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Connect nearby particles
        particles.forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 50) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - distance / 50) * opacity * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [level]);

  return (
    <div className={`rounded-lg bg-cyan-900/20 p-3 ${className}`}>
      <div className="text-cyan-400 text-sm font-medium mb-2">
        Temporal Awareness
      </div>
      <canvas
        ref={canvasRef}
        width={200}
        height={100}
        className="w-full h-full rounded"
      />
      <div className="mt-2 flex items-center justify-between">
        <div className="flex-grow bg-cyan-900/30 h-1.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${level * 100}%` }}
          />
        </div>
        <div className="ml-2 text-cyan-300 text-sm font-medium">
          {(level * 100).toFixed(1)}%
        </div>
      </div>
    </div>
  );
};
