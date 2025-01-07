import React, { useEffect, useRef } from 'react';

export const QuantumField = ({ intensity = 0.5, className = '' }) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const requestIdRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ensure intensity is within valid range
    const safeIntensity = Math.max(0.1, Math.min(1, intensity));

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      const numParticles = Math.floor(50 * safeIntensity);
      particles.current = Array.from({ length: numParticles }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.max(1, Math.random() * 3 * safeIntensity),
        speed: Math.max(0.2, Math.random() * safeIntensity)
      }));
    };

    const drawParticle = (particle) => {
      // Ensure positive radius
      const radius = Math.max(0.1, particle.radius);
      
      // Create gradient with safe radius
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, radius
      );
      gradient.addColorStop(0, `rgba(0, 150, 255, ${safeIntensity})`);
      gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach(particle => {
        // Update position with bounds checking
        particle.y = (particle.y - particle.speed + canvas.height) % canvas.height;
        
        // Draw particle
        drawParticle(particle);
      });

      // Draw connections
      ctx.strokeStyle = `rgba(0, 150, 255, ${safeIntensity * 0.2})`;
      ctx.lineWidth = 0.5;

      particles.current.forEach((p1, i) => {
        particles.current.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      requestIdRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ background: 'transparent' }}
    />
  );
};