import React, { useRef, useEffect } from 'react';

type WaveformProps = {
  type: 'Stable' | 'Fluctuating' | 'Entangled';
  amplitude: number;
  frequency: number;
  className?: string;
};

export const WaveformGenerator: React.FC<WaveformProps> = ({
  type,
  amplitude,
  frequency,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up animation
    let animationFrameId: number;
    let time = 0;

    const render = () => {
      if (!canvas || !ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set line style
      ctx.lineWidth = 2;
      ctx.strokeStyle = type === 'Entangled' 
        ? '#FF61DC' // quantum-pink
        : '#7B61FF'; // quantum-purple

      // Start drawing path
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      // Generate waveform based on type
      for (let x = 0; x < canvas.width; x++) {
        let y = canvas.height / 2;

        switch (type) {
          case 'Stable':
            // Straight line with slight noise
            y += Math.random() * 2 - 1;
            break;

          case 'Fluctuating':
            // Sine wave with varying amplitude
            y += Math.sin(x * frequency + time) * 
                 amplitude * (canvas.height / 4);
            break;

          case 'Entangled':
            // Double sine wave with phase relationship
            const wave1 = Math.sin(x * frequency + time) * 
                         amplitude * (canvas.height / 6);
            const wave2 = Math.sin(x * frequency + time + Math.PI) * 
                         amplitude * (canvas.height / 6);
            y += (wave1 + wave2) / 2;
            break;
        }

        ctx.lineTo(x, y);
      }

      // Stroke the path
      ctx.stroke();

      // Update time for animation
      time += 0.05;

      // Request next frame
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [type, amplitude, frequency]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{
        filter: type === 'Entangled' 
          ? 'drop-shadow(0 0 8px rgba(255, 97, 220, 0.3))' 
          : 'drop-shadow(0 0 8px rgba(123, 97, 255, 0.3))'
      }}
    />
  );
};