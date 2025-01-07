import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface QuantumSignatureProps {
  signature: string;
  resonance: number;
  coherence: number;
}

export const QuantumSignature: React.FC<QuantumSignatureProps> = ({
  signature,
  resonance,
  coherence
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestIdRef = useRef<number>();
  const timeRef = useRef(0);

  // Convert signature to numeric values for visualization
  const getSignatureValues = (sig: string): number[] => {
    return sig.split('-')
      .flatMap(part => {
        // Convert hex-like strings to numbers
        if (part.match(/^[0-9a-f]+$/i)) {
          return parseInt(part, 16) / 0xFFFFFFFF;
        }
        // Convert numeric strings to numbers
        if (part.match(/^[\d.]+$/)) {
          return parseFloat(part);
        }
        // Convert other characters to numbers
        return Array.from(part).map(char => char.charCodeAt(0) / 255);
      })
      .filter(n => !isNaN(n));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 100;

    const values = getSignatureValues(signature);
    
    const drawSignature = () => {
      timeRef.current += 0.016;
      
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw quantum signature pattern
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      for (let i = 0; i < canvas.width; i++) {
        const x = i;
        
        // Calculate y position using quantum values
        let y = canvas.height / 2;
        values.forEach((value, index) => {
          const frequency = 0.01 + (value * 0.05);
          const amplitude = 20 * value * coherence;
          const phase = timeRef.current * frequency + (index * Math.PI / 4);
          y += Math.sin(phase + (x * 0.02)) * amplitude;
        });

        // Add quantum fluctuations
        const fluctuation = Math.sin(timeRef.current * 2 + x * 0.1) * (5 * resonance);
        y += fluctuation;

        ctx.lineTo(x, y);
      }

      // Create gradient for the line
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, `hsla(${200 + resonance * 60}, 100%, 50%, ${0.5 + coherence * 0.5})`);
      gradient.addColorStop(0.5, `hsla(${240 + coherence * 60}, 100%, 50%, ${0.5 + resonance * 0.5})`);
      gradient.addColorStop(1, `hsla(${280 + (resonance + coherence) * 30}, 100%, 50%, ${0.5 + coherence * 0.5})`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add quantum particles along the signature
      const particleCount = Math.floor(10 * resonance);
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const baseY = canvas.height / 2;
        const y = baseY + Math.sin(timeRef.current + x * 0.02) * 20;

        const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, 5);
        particleGradient.addColorStop(0, `hsla(200, 100%, 50%, ${coherence})`);
        particleGradient.addColorStop(1, 'hsla(200, 100%, 50%, 0)');

        ctx.beginPath();
        ctx.fillStyle = particleGradient;
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      requestIdRef.current = requestAnimationFrame(drawSignature);
    };

    drawSignature();

    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [signature, resonance, coherence]);

  return (
    <motion.div
      className="rounded-lg p-4 bg-gray-900/50 backdrop-blur-lg border border-blue-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-sm font-medium text-blue-300 mb-2">Quantum Signature</h3>
      <canvas
        ref={canvasRef}
        className="w-full h-[100px] rounded-lg"
      />
      <div className="mt-2 text-xs text-blue-300/70 flex justify-between">
        <span>Coherence: {(coherence * 100).toFixed(1)}%</span>
        <span>Resonance: {(resonance * 100).toFixed(1)}%</span>
      </div>
    </motion.div>
  );
};