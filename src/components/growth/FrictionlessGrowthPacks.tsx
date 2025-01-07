import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import { hapticFeedback } from '@/utils/haptics';
import { formatICPPrice } from '@/utils/format';
import { Card } from '@/components/ui/card';

interface Pack {
  id: string;
  name: string;
  price: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
  traits_boost: [string, number][];
  skill_unlocks: string[];
  requirements: {
    min_level: number;
    required_traits: [string, number][];
  };
  timeRemaining?: number;
  discountPercent?: number;
}

export const FrictionlessGrowthPacks: React.FC<{
  packs: Pack[];
  onPurchase: (packId: string) => Promise<void>;
  onPreview: (packId: string) => void;
}> = ({ packs, onPurchase, onPreview }) => {
  const { playSuccess, playHover, playError } = useSound();
  const [expandedPack, setExpandedPack] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  // Quick purchase with haptic feedback
  const handleQuickBuy = async (pack: Pack, e: React.MouseEvent) => {
    e.stopPropagation();
    setPurchasing(pack.id);
    hapticFeedback.success();
    
    try {
      await onPurchase(pack.id);
      playSuccess();
      // Show success animation
    } catch (err) {
      playError();
      hapticFeedback.error();
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {packs.map((pack) => (
            <motion.div
              key={pack.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                playHover();
                hapticFeedback.light();
                onPreview(pack.id);
              }}
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-black/60 to-black/40 backdrop-blur border border-amber-500/30 hover:border-amber-500">
                {/* Floating orbs background effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div 
                    className="absolute w-20 h-20 rounded-full blur-xl"
                    style={{
                      background: pack.rarity === 'Legendary' ? 
                        'radial-gradient(circle, rgba(255,215,0,0.2) 0%, rgba(255,215,0,0) 70%)' :
                        'radial-gradient(circle, rgba(138,43,226,0.2) 0%, rgba(138,43,226,0) 70%)'
                    }}
                    animate={{
                      x: [0, 100, 0],
                      y: [0, -50, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </div>

                {/* Limited time offer indicator */}
                {pack.timeRemaining && (
                  <motion.div 
                    className="absolute top-2 right-2 text-amber-400 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className="animate-pulse">⌛</span> {pack.timeRemaining}h left
                  </motion.div>
                )}

                <div className="p-4 relative z-10">
                  {/* Title and quick-buy */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-amber-400">{pack.name}</h3>
                    <motion.button
                      className="px-3 py-1 bg-amber-500 text-black rounded-full text-sm font-bold hover:bg-amber-400"
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleQuickBuy(pack, e)}
                      disabled={purchasing === pack.id}
                    >
                      {purchasing === pack.id ? (
                        <span className="flex items-center">
                          <motion.span 
                            className="inline-block"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            ⚡
                          </motion.span>
                        </span>
                      ) : (
                        <>
                          {pack.discountPercent ? (
                            <span className="flex items-center gap-2">
                              <span className="line-through text-xs opacity-60">
                                {formatICPPrice(pack.price)}
                              </span>
                              <span className="text-black font-bold">
                                {formatICPPrice(pack.price * (1 - pack.discountPercent/100))}
                              </span>
                            </span>
                          ) : (
                            formatICPPrice(pack.price)
                          )}
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Preview content */}
                  <motion.div
                    initial={false}
                    animate={{ height: expandedPack === pack.id ? 'auto' : '0' }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 text-amber-300/80">
                      <p>{pack.description}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {pack.traits_boost.map(([trait, boost]) => (
                          <div key={trait} className="flex items-center gap-1">
                            <span>{trait}:</span>
                            <span className="text-green-400">+{(boost * 100).toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Popular badge */}
                  {pack.rarity === 'Legendary' && (
                    <motion.div
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-bl-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      MOST POPULAR
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};