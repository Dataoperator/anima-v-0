import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface EmotionalState {
  joy: number;
  curiosity: number;
  calmness: number;
  excitement: number;
  focus: number;
}

interface EmotionVisualizerProps {
  emotionalState?: EmotionalState;
  className?: string;
}

export const EmotionVisualizer: React.FC<EmotionVisualizerProps> = ({ 
  emotionalState = {
    joy: 0.5,
    curiosity: 0.5,
    calmness: 0.5,
    excitement: 0.5,
    focus: 0.5
  },
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw emotion pentagon
    ctx.beginPath();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';

    const emotions = ['joy', 'curiosity', 'calmness', 'excitement', 'focus'];
    const points = emotions.map((emotion, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const value = emotionalState[emotion as keyof EmotionalState];
      return {
        x: centerX + Math.cos(angle) * radius * value,
        y: centerY + Math.sin(angle) * radius * value
      };
    });

    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw emotion labels
    ctx.font = '12px Inter';
    ctx.fillStyle = '#22c55e';
    ctx.textAlign = 'center';

    emotions.forEach((emotion, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * (radius + 20);
      const y = centerY + Math.sin(angle) * (radius + 20);
      const value = (emotionalState[emotion as keyof EmotionalState] * 100).toFixed(0);
      ctx.fillText(`${emotion} (${value}%)`, x, y);
    });
  }, [emotionalState]);

  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="w-full h-full"
      />
    </motion.div>
  );
};

export default EmotionVisualizer;