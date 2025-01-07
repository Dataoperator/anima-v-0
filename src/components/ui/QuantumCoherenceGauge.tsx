import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface QuantumCoherenceGaugeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: {
    width: 80,
    height: 4,
    fontSize: 'text-xs',
  },
  md: {
    width: 100,
    height: 6,
    fontSize: 'text-sm',
  },
  lg: {
    width: 120,
    height: 8,
    fontSize: 'text-base',
  },
};

export const QuantumCoherenceGauge: React.FC<QuantumCoherenceGaugeProps> = ({
  value,
  size = 'md',
  className = '',
}) => {
  const gaugeRef = useRef<HTMLDivElement>(null);
  const { width, height, fontSize } = sizes[size];

  useEffect(() => {
    if (gaugeRef.current) {
      const color = value >= 0.7 ? '#8B5CF6' : value >= 0.4 ? '#60A5FA' : '#EF4444';
      gaugeRef.current.style.setProperty('--gauge-color', color);
    }
  }, [value]);

  const getStatusText = () => {
    if (value >= 0.7) return 'Stable';
    if (value >= 0.4) return 'Moderate';
    return 'Critical';
  };

  return (
    <div className={`relative ${className}`} ref={gaugeRef}>
      {/* Background Bar */}
      <div 
        className="rounded-full bg-gray-800"
        style={{ width, height }}
      >
        {/* Fill Bar */}
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'var(--gauge-color, #8B5CF6)',
            backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Quantum Glow Effect */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: `0 0 10px var(--gauge-color, #8B5CF6)`,
          opacity: value * 0.5,
        }}
      />

      {/* Status Text */}
      <div className={`flex justify-between mt-1 ${fontSize} text-gray-400`}>
        <span>{getStatusText()}</span>
        <span>{`${(value * 100).toFixed(0)}%`}</span>
      </div>

      {/* Quantum Particles Effect */}
      {value > 0.3 && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 h-full w-1 bg-white/20 rounded-full"
              animate={{
                x: ['-100%', '200%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.6,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Prevent unnecessary re-renders
export default React.memo(QuantumCoherenceGauge);