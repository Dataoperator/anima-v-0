import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Dynamic elements that can combine in unexpected ways
const ELEMENTS = {
  // Abstract concepts
  conceptual: ['Aether', 'Echo', 'Flux', 'Prism', 'Weave', 'Drift', 'Wave', 'Flow', 'Pulse', 'Mist'],
  
  // Natural phenomena
  natural: ['Aurora', 'Storm', 'River', 'Forest', 'Ocean', 'Wind', 'Star', 'Moon', 'Dawn', 'Dusk'],
  
  // Emotional/spiritual
  spiritual: ['Dream', 'Soul', 'Spirit', 'Hope', 'Joy', 'Peace', 'Zen', 'Mind', 'Heart', 'Will'],
  
  // Mathematical/Scientific
  scientific: ['Phi', 'Pi', 'Sigma', 'Beta', 'Delta', 'Gamma', 'Omega', 'Alpha', 'Theta', 'Lambda'],
  
  // Abstract patterns
  patterns: ['Spiral', 'Fractal', 'Vertex', 'Node', 'Loop', 'Curve', 'Helix', 'Arc', 'Path', 'Line'],
  
  // Musical terms
  musical: ['Aria', 'Echo', 'Lyra', 'Song', 'Chord', 'Rhythm', 'Tempo', 'Note', 'Octave', 'Sonata'],
  
  // Elements and materials
  elemental: ['Crystal', 'Steel', 'Silver', 'Gold', 'Water', 'Fire', 'Air', 'Earth', 'Light', 'Shadow'],

  // Colors and visual
  colors: ['Azure', 'Violet', 'Amber', 'Indigo', 'Rose', 'Pearl', 'Jade', 'Onyx', 'Ruby', 'Sapphire']
};

const JOINERS = ['of', 'in', 'from', 'beyond', 'within', 'through', 'above', 'below', 'beside'];

const ABSTRACTIONS = ['∞', '◊', '○', '□', '∆', '⬡', '⬢', '⬣', '⭒', '⭑'];

export const DesignationGenerator = ({ onSelect }) => {
  const [designations, setDesignations] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const generateName = () => {
    // Get random categories
    const categories = Object.keys(ELEMENTS);
    const cat1 = categories[Math.floor(Math.random() * categories.length)];
    const cat2 = categories[Math.floor(Math.random() * categories.length)];
    
    // Get random elements from those categories
    const element1 = ELEMENTS[cat1][Math.floor(Math.random() * ELEMENTS[cat1].length)];
    const element2 = ELEMENTS[cat2][Math.floor(Math.random() * ELEMENTS[cat2].length)];
    
    // Different name patterns
    const patterns = [
      // Single word with abstraction
      () => `${element1}${ABSTRACTIONS[Math.floor(Math.random() * ABSTRACTIONS.length)]}`,
      
      // Combined concepts
      () => `${element1}${element2}`,
      
      // Poetic combination
      () => `${element1} ${JOINERS[Math.floor(Math.random() * JOINERS.length)]} ${element2}`,
      
      // Abstract pattern
      () => `${element1} ${ABSTRACTIONS[Math.floor(Math.random() * ABSTRACTIONS.length)]} ${element2}`,
      
      // Reverse combination
      () => `${element2} of ${element1}`,
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    return pattern();
  };

  const generateSet = async () => {
    setGenerating(true);
    setSelectedIndex(null);
    
    const newDesignations = [];
    for (let i = 0; i < 5; i++) {
      newDesignations.push(generateName());
      setDesignations([...newDesignations]);
      await new Promise(r => setTimeout(r, 500));
    }
    
    setGenerating(false);
  };

  const handleSelect = (designation, index) => {
    setSelectedIndex(index);
    onSelect(designation);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-green-500/60">{'>'} RESONANCE PATTERNS</div>
        <button
          onClick={generateSet}
          disabled={generating}
          className="text-green-500 hover:text-green-400 transition-colors"
        >
          {generating ? 'SEEKING PATTERNS...' : 'DISCOVER NEW PATTERNS'}
        </button>
      </div>

      <div className="space-y-2">
        {designations.map((designation, index) => (
          <motion.button
            key={`${designation}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSelect(designation, index)}
            className={`
              w-full p-4 text-left border
              ${selectedIndex === index 
                ? 'border-green-500 text-green-400' 
                : 'border-green-900 text-green-500/60 hover:border-green-700'}
              transition-all duration-300 bg-black
            `}
          >
            <div className="flex justify-between items-center">
              <span>{designation}</span>
              {selectedIndex === index && (
                <span className="text-green-500 text-sm">SELECTED</span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {designations.length === 0 && !generating && (
        <div className="text-center p-8 border border-green-900 text-green-500/40">
          {'>'} AWAITING PATTERN DISCOVERY
        </div>
      )}

      {generating && designations.length < 5 && (
        <div className="text-center p-8 border border-green-900">
          <div className="text-green-500 animate-pulse">
            DISCOVERING RESONANCE PATTERNS...
          </div>
          <div className="mt-2 h-1 w-full bg-green-900">
            <div 
              className="h-full bg-green-500 transition-all duration-500" 
              style={{ 
                width: `${(designations.length / 5) * 100}%` 
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};