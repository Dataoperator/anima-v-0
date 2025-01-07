import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface Props {
  cellSize?: number;
  gridSize?: number;
  pulseColor?: string;
  baseColor?: string;
}

export const QuantumHexGrid: React.FC<Props> = ({
  cellSize = 40,
  gridSize = 15,
  pulseColor = '#00ffff',
  baseColor = '#1a1a1a'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useAnimation();

  const drawHexagon = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    color: string
  ) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const xPos = x + r * Math.cos(angle);
      const yPos = y + r * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(xPos, yPos);
      } else {
        ctx.lineTo(xPos, yPos);
      }
    }
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match window
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let hexagons: Array<{
      x: number;
      y: number;
      pulseOffset: number;
      pulseIntensity: number;
    }> = [];

    // Initialize hexagon grid
    const spacing = cellSize * 1.732; // sqrt(3)
    const rows = Math.ceil(canvas.height / spacing) + 2;
    const cols = Math.ceil(canvas.width / spacing) + 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * spacing + (row % 2) * spacing / 2;
        const y = row * (cellSize * 1.5);
        hexagons.push({
          x,
          y,
          pulseOffset: Math.random() * Math.PI * 2,
          pulseIntensity: 0.3 + Math.random() * 0.7
        });
      }
    }

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() / 1000;
      hexagons.forEach(hex => {
        const pulse = Math.sin(time + hex.pulseOffset) * 0.5 + 0.5;
        const alpha = 0.1 + pulse * 0.2 * hex.pulseIntensity;
        const color = baseColor + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        drawHexagon(ctx, hex.x, hex.y, cellSize / 2, color);

        // Draw quantum pulse effect
        if (pulse > 0.8) {
          ctx.globalAlpha = (1 - pulse) * 0.5;
          drawHexagon(ctx, hex.x, hex.y, cellSize / 2 + (pulse * 10), pulseColor);
          ctx.globalAlpha = 1;
        }
      });
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [cellSize, gridSize, pulseColor, baseColor]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full h-full"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black opacity-50" />
    </motion.div>
  );
};