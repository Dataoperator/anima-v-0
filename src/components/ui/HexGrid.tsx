import React from 'react';
import { motion } from 'framer-motion';

export const HexGrid: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" className="opacity-10">
        <defs>
          <pattern 
            id="hexagons" 
            width="50" 
            height="43.4" 
            patternUnits="userSpaceOnUse" 
            patternTransform="scale(2)"
          >
            <path
              d="M25 0L50 14.4v28.8L25 43.4L0 28.8V14.4z"
              fill="none"
              stroke="rgba(59, 130, 246, 0.5)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagons)" />
      </svg>
    </div>
  );
};