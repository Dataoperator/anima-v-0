import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const HEX_COLORS = [
  '#00ffff', // cyan
  '#00ccff', // light blue
  '#0099ff', // blue
  '#007fff', // darker blue
];

export const HexGrid = ({ 
  hexSize = 20,
  spacing = 2,
  pattern = 'random',
  className = ''
}) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate hex dimensions
    const a = hexSize / 2;
    const b = Math.sin(Math.PI / 3) * hexSize;
    const c = Math.cos(Math.PI / 3) * hexSize;
    const d = hexSize;

    // Calculate grid dimensions
    const cols = Math.ceil(width / (hexSize * 2));
    const rows = Math.ceil(height / (hexSize * 2));

    // Draw hexagons
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * (d + spacing) + (row % 2) * (d / 2);
        const y = row * (b + spacing);

        // Skip if outside canvas
        if (x > width || y > height) continue;

        // Get color based on pattern
        let color;
        switch (pattern) {
          case 'random':
            color = HEX_COLORS[Math.floor(Math.random() * HEX_COLORS.length)];
            break;
          case 'gradient':
            const index = Math.floor((x / width + y / height) * HEX_COLORS.length);
            color = HEX_COLORS[index % HEX_COLORS.length];
            break;
          default:
            color = HEX_COLORS[0];
        }

        // Set transparency based on position
        const alpha = Math.random() * 0.5 + 0.1;
        ctx.fillStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, '0');

        // Draw hexagon
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const hx = x + Math.cos(angle) * hexSize;
          const hy = y + Math.sin(angle) * hexSize;
          if (i === 0) {
            ctx.moveTo(hx, hy);
          } else {
            ctx.lineTo(hx, hy);
          }
        }
        ctx.closePath();
        ctx.fill();

        // Add glow effect
        ctx.shadowColor = color;
        ctx.shadowBlur = 5;
        ctx.stroke();
      }
    }

    // Animate hexagons
    const animate = () => {
      // Subtle animation of hexagon colors
      ctx.globalAlpha = 0.98;
      requestAnimationFrame(animate);
    };

    animate();
  }, [hexSize, spacing, pattern]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          background: 'transparent',
          mixBlendMode: 'screen'
        }}
      />
    </motion.div>
  );
};