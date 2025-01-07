import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const NeuralGrid = ({ className = '', intensity = 1.0 }) => {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const connectionsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Initialize nodes
    const initNodes = () => {
      nodesRef.current = Array(50).fill().map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        pulsePhase: Math.random() * Math.PI * 2,
        activity: Math.random()
      }));
    };

    // Update node positions and connections
    const update = () => {
      const nodes = nodesRef.current;
      
      // Update nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulsePhase += 0.05;
        
        // Bounce off boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        
        // Keep within bounds
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));
      });

      // Update connections
      connectionsRef.current = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            connectionsRef.current.push({
              from: nodes[i],
              to: nodes[j],
              strength: 1 - (distance / 100)
            });
          }
        }
      }
    };

    // Draw the neural network
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw connections
      connectionsRef.current.forEach(conn => {
        const gradient = ctx.createLinearGradient(
          conn.from.x, conn.from.y,
          conn.to.x, conn.to.y
        );
        
        const alpha = conn.strength * 0.5 * intensity;
        gradient.addColorStop(0, `rgba(0, 255, 255, ${alpha})`);
        gradient.addColorStop(1, `rgba(0, 128, 255, ${alpha})`);
        
        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.lineTo(conn.to.x, conn.to.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = conn.strength * 2;
        ctx.stroke();
      });

      // Draw nodes
      nodesRef.current.forEach(node => {
        const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5;
        const size = node.size * (1 + pulse * 0.5);
        
        // Glow effect
        ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
        ctx.shadowBlur = 10;
        
        // Node fill
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, ${155 + pulse * 100}, ${255}, ${0.8 * intensity})`;
        ctx.fill();
        
        // Node ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, size * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 * pulse * intensity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    };

    // Animation loop
    let animationFrame;
    const animate = () => {
      update();
      draw();
      animationFrame = requestAnimationFrame(animate);
    };

    // Initialize and start animation
    initNodes();
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [intensity]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  );
};