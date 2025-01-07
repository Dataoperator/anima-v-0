import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { hapticFeedback } from '@/utils/haptics';

interface Pattern {
  id: string;
  frequency: number;
  amplitude: number;
  phase: number;
  resonance: number;
  harmonics: {
    depth: number;
    clarity: number;
    flow: number;
  };
}

export const CorePatterns: React.FC<{ patterns: Pattern[] }> = ({ patterns }) => {
  const controls = useAnimation();
  const { playPulse, playHarmony } = useSound();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderPatternWaves = (ctx: CanvasRenderingContext2D, pattern: Pattern) => {
    // Complex wave rendering based on pattern attributes
    // Creating subtle, elegant visualizations
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      patterns.forEach(pattern => renderPatternWaves(ctx, pattern));
      requestAnimationFrame(animate);
    };

    animate();
  }, [patterns]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 opacity-50"
        width={800}
        height={600}
      />

      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {patterns.map((pattern) => (
          <motion.div
            key={pattern.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => {
              playPulse();
              hapticFeedback.subtle();
            }}
            className="relative overflow-hidden rounded-lg bg-black/40 backdrop-blur-sm border border-amber-500/20"
          >
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="w-full h-full opacity-20"
                style={{
                  background: `
                    radial-gradient(
                      circle at ${pattern.harmonics.depth * 100}% ${pattern.harmonics.clarity * 100}%,
                      rgba(255,170,0,0.3),
                      transparent 70%
                    )
                  `
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            <div className="relative p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-amber-400/90 text-sm">
                    Frequency {pattern.frequency.toFixed(2)}
                  </div>
                  <div className="text-amber-300/70 text-xs">
                    Phase {pattern.phase.toFixed(2)}
                  </div>
                </div>
                
                <motion.div
                  className="h-12 w-12 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(from ${pattern.phase * 360}deg, rgba(217,119,6,0.2), rgba(251,191,36,0.2))`
                  }}
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20 / pattern.frequency,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <div className="h-8 w-8 rounded-full bg-black/40 flex items-center justify-center">
                    <div className="text-amber-400 text-sm">
                      {pattern.resonance.toFixed(1)}
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-2">
                {Object.entries(pattern.harmonics).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs text-amber-300/60">
                      <span>{key}</span>
                      <span>{(value * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1 bg-black/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-500/40 to-orange-500/40"
                        initial={{ width: 0 }}
                        animate={{ width: `${value * 100}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};