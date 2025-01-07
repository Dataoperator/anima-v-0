import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface EmotionalState {
  valence: number;    // Positivity (0-1)
  arousal: number;    // Intensity (0-1)
  dominance: number;  // Control (0-1)
}

interface Props {
  emotionalState: EmotionalState;
  confidence: number;
}

export const EmotionVisualizer: React.FC<Props> = ({ emotionalState, confidence }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate visualization parameters
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    // Draw emotional state visualization
    const drawEmotionalField = () => {
      // Create gradient based on emotional valence
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius
      );

      // Color mapping based on emotional state
      const colorIntensity = Math.floor(emotionalState.valence * 255);
      const baseColor = emotionalState.valence > 0.5 
        ? `rgb(${0}, ${colorIntensity}, ${colorIntensity})` // Cyan for positive
        : `rgb(${colorIntensity}, ${0}, ${colorIntensity})`; // Magenta for negative

      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(1, 'transparent');

      // Draw base field
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw intensity rings
      const numRings = Math.floor(emotionalState.arousal * 10) + 3;
      ctx.strokeStyle = `rgba(255, 255, 255, ${confidence * 0.5})`;
      
      for (let i = 0; i < numRings; i++) {
        const ringRadius = (radius * (i + 1)) / numRings;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw dominance vectors
      const numVectors = Math.floor(emotionalState.dominance * 12) + 4;
      const angleStep = (Math.PI * 2) / numVectors;

      ctx.strokeStyle = `rgba(255, 255, 255, ${confidence * 0.7})`;
      ctx.lineWidth = 2;

      for (let i = 0; i < numVectors; i++) {
        const angle = i * angleStep;
        const x1 = centerX + Math.cos(angle) * (radius * 0.3);
        const y1 = centerY + Math.sin(angle) * (radius * 0.3);
        const x2 = centerX + Math.cos(angle) * (radius * 0.7);
        const y2 = centerY + Math.sin(angle) * (radius * 0.7);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Draw confidence indicator
      ctx.strokeStyle = `rgba(255, 255, 255, ${confidence})`;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.9, 0, Math.PI * 2 * confidence);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // Animation loop
    let animationFrame: number;
    let rotation = 0;

    const animate = () => {
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Rotate based on arousal
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      ctx.translate(-centerX, -centerY);
      
      drawEmotionalField();
      
      ctx.restore();
      
      rotation += 0.001 * emotionalState.arousal;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [emotionalState, confidence]);

  return (
    <div className="relative w-full aspect-square">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          boxShadow: [
            'inset 0 0 20px rgba(6,182,212,0.1)',
            'inset 0 0 40px rgba(6,182,212,0.2)',
            'inset 0 0 20px rgba(6,182,212,0.1)'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs text-cyan-500/70 font-mono">
        <div>VAL: {(emotionalState.valence * 100).toFixed(1)}%</div>
        <div>ARO: {(emotionalState.arousal * 100).toFixed(1)}%</div>
        <div>DOM: {(emotionalState.dominance * 100).toFixed(1)}%</div>
      </div>
    </div>
  );
};