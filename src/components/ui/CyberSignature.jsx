import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const CyberSignature = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 30;

    let angle = 0;
    const text = "I thought what I'd do was, I'd pretend I was one of those deaf-mutes";

    const drawLaughingManLogo = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
      ctx.stroke();

      // Draw rotating text
      ctx.font = '8px monospace';
      ctx.fillStyle = 'rgba(0, 255, 255, 0.7)';
      ctx.textAlign = 'center';
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      
      // Split text into circular path
      for (let i = 0; i < text.length; i++) {
        const charAngle = (i / text.length) * Math.PI * 2;
        ctx.save();
        ctx.rotate(charAngle);
        ctx.fillText(text[i], 0, -radius - 5);
        ctx.restore();
      }
      
      ctx.restore();

      // Add glitch effect occasionally
      if (Math.random() < 0.05) {
        ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
        ctx.fillRect(
          centerX - radius, 
          centerY - radius, 
          radius * 2, 
          2
        );
      }

      // Hidden Project 2501 reference
      ctx.font = '6px monospace';
      ctx.fillStyle = 'rgba(0, 255, 255, 0.15)';
      ctx.fillText('Project 2501: Analyzing consciousness...', centerX, centerY + radius + 10);

      angle += 0.005;
      requestAnimationFrame(drawLaughingManLogo);
    };

    drawLaughingManLogo();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-4 right-4 z-50 cursor-pointer"
      whileHover={{ scale: 1.1 }}
      title="Just a puppet..."
    >
      <canvas 
        ref={canvasRef} 
        width={100} 
        height={100}
        className="mix-blend-screen"
      />
    </motion.div>
  );
};