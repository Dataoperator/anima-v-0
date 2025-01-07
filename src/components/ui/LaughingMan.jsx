import React from 'react';
import { motion } from 'framer-motion';

export const LaughingMan = ({ size = 100, className = '' }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 240 240"
    className={className}
    initial={{ rotate: 0 }}
    animate={{ rotate: 360 }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  >
    {/* Outer Text Path */}
    <defs>
      <path
        id="textPath"
        d="M120,20 A100,100 0 1,1 119.9,20"
        fill="none"
      />
    </defs>
    <text fill="currentColor" fontSize="12">
      <textPath href="#textPath" startOffset="0%">
        I thought what I'd do was, I'd pretend I was one of those deaf-mutes or should I?
      </textPath>
    </text>

    {/* Inner Circle */}
    <circle cx="120" cy="120" r="70" fill="none" stroke="currentColor" strokeWidth="2" />

    {/* Smiling Face */}
    <g transform="translate(80,100)">
      {/* Eyes */}
      <circle cx="25" cy="20" r="5" fill="currentColor" />
      <circle cx="75" cy="20" r="5" fill="currentColor" />
      
      {/* Smile */}
      <path
        d="M25,40 Q50,60 75,40"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>

    {/* Data Glitch Effect */}
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.5, 0] }}
      transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 5 }}
    >
      <rect x="80" y="90" width="80" height="5" fill="currentColor" opacity="0.5" />
      <rect x="90" y="100" width="60" height="3" fill="currentColor" opacity="0.3" />
    </motion.g>
  </motion.svg>
);

export default LaughingMan;