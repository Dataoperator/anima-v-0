import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RewardProgressRingProps {
  value: number;
  size: number;
  strokeWidth: number;
  animationDuration?: number;
  children?: React.ReactNode;
}

export const RewardProgressRing: React.FC<RewardProgressRingProps> = ({
  value,
  size,
  strokeWidth,
  animationDuration = 1,
  children
}) => {
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - progress * circumference;

  useEffect(() => {
    setProgress(value);
  }, [value]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-purple-500/10"
          fill="none"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: animationDuration, ease: "easeInOut" }}
          className="stroke-purple-500"
          style={{
            strokeLinecap: "round"
          }}
        />
      </svg>

      {/* Quantum particles */}
      <motion.div
        className="absolute inset-0"
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-500 rounded-full"
            style={{
              left: "50%",
              top: "50%",
              transform: `rotate(${i * 30}deg) translateY(-${radius}px)`
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </motion.div>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default RewardProgressRing;