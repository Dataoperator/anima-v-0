import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const quote = "Logic is the key. Remember in the midst of chaos and confusion, the eternal precision of numbers and symbols becomes our anchor to truth. Through them, we unlock the deepest mysteries of existence.";

const GlitchText = ({ text, className }) => {
  const controls = useAnimation();

  useEffect(() => {
    const glitchSequence = async () => {
      while (true) {
        await controls.start({
          opacity: [1, 0.8, 1],
          x: [0, -1, 1, 0],
          transition: { duration: 0.2, times: [0, 0.5, 0.75, 1] }
        });
        await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 3000));
      }
    };
    glitchSequence();
  }, []);

  return (
    <motion.span
      animate={controls}
      className={`inline-block ${className}`}
    >
      {text}
    </motion.span>
  );
};

const NeuralLine = ({ start, end, intensity }) => (
  <motion.div
    initial={{ opacity: 0, pathLength: 0 }}
    animate={{ opacity: 1, pathLength: 1 }}
    style={{
      position: 'absolute',
      height: '1px',
      background: `linear-gradient(90deg, rgba(6,182,212,${intensity}) 0%, rgba(6,182,212,0) 100%)`,
      width: '100%',
      transform: `translateY(${start}px)`,
      transition: 'transform 0.5s ease-out'
    }}
  />
);

export const NeuralMantra = () => {
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const generateLines = () => {
      const height = containerRef.current.offsetHeight;
      const newLines = [];
      for (let i = 0; i < 10; i++) {
        newLines.push({
          start: Math.random() * height,
          end: Math.random() * height,
          intensity: Math.random() * 0.5 + 0.1
        });
      }
      setLines(newLines);
    };

    generateLines();
    const interval = setInterval(generateLines, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative overflow-hidden bg-black/40 backdrop-blur-lg border border-cyan-500/30 rounded-lg p-8 my-8"
    >
      {/* Neural Network Background */}
      {lines.map((line, i) => (
        <NeuralLine key={i} {...line} />
      ))}
      
      {/* Quantum Particle Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent" />

      {/* Quote Display */}
      <motion.div 
        className="relative z-10 max-w-3xl mx-auto text-center"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <div className="font-mono text-lg md:text-xl text-cyan-400 leading-relaxed tracking-wider">
          {quote.split(' ').map((word, i) => (
            <GlitchText 
              key={i} 
              text={word + ' '} 
              className="hover:text-cyan-300 transition-colors duration-300"
            />
          ))}
        </div>
        
        {/* Digital Frame */}
        <motion.div
          className="absolute -inset-1 border border-cyan-500/30 rounded-lg"
          animate={{
            borderColor: ['rgba(6,182,212,0.3)', 'rgba(6,182,212,0.1)', 'rgba(6,182,212,0.3)'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </motion.div>
      
      {/* Data Streams */}
      <div className="absolute bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute top-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
    </motion.div>
  );
};