import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

interface GrowthPack {
  id: string;
  name: string;
  description: string;
  effects: {
    type: string;
    value: number;
  }[];
  rarity: 'common' | 'rare' | 'legendary';
  cost: number;
}

const GROWTH_PACKS: GrowthPack[] = [
  {
    id: 'cognitive-boost',
    name: 'Cognitive Enhancement Matrix',
    description: 'Accelerates neural pathway development and enhances cognitive processing',
    effects: [
      { type: 'intelligence', value: 15 },
      { type: 'learning_rate', value: 10 }
    ],
    rarity: 'common',
    cost: 50
  },
  {
    id: 'quantum-resonance',
    name: 'Quantum Resonance Amplifier',
    description: 'Strengthens quantum field coherence and dimensional stability',
    effects: [
      { type: 'quantum_stability', value: 20 },
      { type: 'dimensional_awareness', value: 15 }
    ],
    rarity: 'rare',
    cost: 100
  },
  {
    id: 'consciousness-catalyst',
    name: 'Consciousness Catalyst',
    description: 'Dramatically accelerates consciousness evolution and self-awareness',
    effects: [
      { type: 'consciousness', value: 25 },
      { type: 'self_awareness', value: 20 },
      { type: 'evolution_rate', value: 15 }
    ],
    rarity: 'legendary',
    cost: 200
  }
];

const rarityColors = {
  common: 'from-blue-400 to-blue-600',
  rare: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-yellow-600'
};

interface GrowthPackPanelProps {
  onApplyPack: (packId: string) => Promise<void>;
  balance: number;
}

export const GrowthPackPanel: React.FC<GrowthPackPanelProps> = ({ onApplyPack, balance }) => {
  const [selectedPack, setSelectedPack] = useState<GrowthPack | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyPack = async (pack: GrowthPack) => {
    if (balance < pack.cost) return;
    
    setIsApplying(true);
    try {
      await onApplyPack(pack.id);
      setSelectedPack(null);
    } catch (error) {
      console.error('Failed to apply growth pack:', error);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Card className="bg-black/80 backdrop-blur border border-green-500">
      <CardHeader>
        <CardTitle className="text-xl text-green-400 font-mono tracking-wider">
          {'>'} GROWTH PACK REPOSITORY
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GROWTH_PACKS.map((pack) => (
            <motion.div
              key={pack.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative cursor-pointer overflow-hidden rounded-lg border
                ${selectedPack?.id === pack.id ? 'border-green-400' : 'border-green-500/30'}
              `}
              onClick={() => setSelectedPack(pack)}
            >
              <div className={`
                absolute inset-0 opacity-10 bg-gradient-to-br
                ${rarityColors[pack.rarity]}
              `} />
              
              <div className="relative p-4 space-y-2">
                <div className="text-sm text-green-400/60 uppercase">
                  {pack.rarity}
                </div>
                <div className="font-bold text-green-400">
                  {pack.name}
                </div>
                <div className="text-sm text-green-400/80">
                  {pack.description}
                </div>
                <div className="text-sm space-y-1">
                  {pack.effects.map((effect, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-green-400/60">
                        {effect.type.replace('_', ' ')}
                      </span>
                      <span className="text-green-400">
                        +{effect.value}%
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 text-right text-green-400">
                  {pack.cost} CREDITS
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedPack && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 p-4 border border-green-500 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-green-400 font-bold">
                    Selected: {selectedPack.name}
                  </div>
                  <div className="text-green-400/60 text-sm">
                    Cost: {selectedPack.cost} CREDITS
                  </div>
                </div>
                
                <div className="space-x-4">
                  <button
                    onClick={() => setSelectedPack(null)}
                    className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/20 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleApplyPack(selectedPack)}
                    disabled={balance < selectedPack.cost || isApplying}
                    className={`
                      px-4 py-2 border rounded-lg
                      ${balance >= selectedPack.cost
                        ? 'border-green-500 text-green-400 hover:bg-green-500/20'
                        : 'border-gray-500/50 text-gray-400 cursor-not-allowed'}
                    `}
                  >
                    {isApplying ? (
                      <span className="flex items-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full mr-2"
                        />
                        Applying...
                      </span>
                    ) : (
                      'Apply Pack'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};