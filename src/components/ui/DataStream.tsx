import React, { useEffect, useRef } from 'react';

interface DataStreamProps {
  className?: string;
}

export const DataStream: React.FC<DataStreamProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const streamers: { x: number; y: number; speed: number; char: string }[] = [];

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Initialize streamers
    for (let i = 0; i < Math.floor(canvas.width / 20); i++) {
      streamers.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 1 + Math.random() * 3,
        char: String.fromCharCode(0x30A0 + Math.random() * 96)
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0fa';
      ctx.font = '12px monospace';

      streamers.forEach(streamer => {
        ctx.fillText(streamer.char, streamer.x, streamer.y);
        streamer.y += streamer.speed;

        if (streamer.y > canvas.height) {
          streamer.y = 0;
          streamer.x = Math.random() * canvas.width;
          streamer.char = String.fromCharCode(0x30A0 + Math.random() * 96);
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={`fixed inset-0 ${className}`} />;
};

export default DataStream;