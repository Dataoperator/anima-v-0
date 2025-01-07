import React from 'react';
import { motion } from 'framer-motion';

interface LaughingManProps {
  className?: string;
}

export const LaughingMan: React.FC<LaughingManProps> = ({ className }) => {
  const text = "I thought what I'd do was, I'd pretend I was one of those deaf-mutes";
  const radius = 100;
  const characters = text.split('');
  const step = (2 * Math.PI) / characters.length;

  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="w-full h-full relative"
      >
        {characters.map((char, i) => {
          const angle = step * i;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          return (
            <div
              key={i}
              className="absolute text-cyan-500 text-xs font-mono"
              style={{
                transform: `translate(${x}px, ${y}px) rotate(${angle + Math.PI/2}rad)`,
                transformOrigin: "center",
              }}
            >
              {char}
            </div>
          );
        })}
      </motion.div>

      {/* Central Logo */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-1/2 h-1/2">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-cyan-500"
          />
          <path
            d="M25 65 Q50 35 75 65"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-cyan-500"
          />
          <circle
            cx="35"
            cy="45"
            r="5"
            className="fill-cyan-500"
          />
          <circle
            cx="65"
            cy="45"
            r="5"
            className="fill-cyan-500"
          />
        </svg>
      </motion.div>
    </div>
  );
};