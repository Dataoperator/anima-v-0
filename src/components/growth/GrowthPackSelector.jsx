import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';

const rarityColors = {
  Common: 'from-blue-500 to-blue-600',
  Rare: 'from-purple-500 to-purple-600',
  Epic: 'from-pink-500 to-pink-600',
  Legendary: 'from-yellow-500 to-yellow-600',
};

const rarityBorders = {
  Common: 'border-blue-400',
  Rare: 'border-purple-400',
  Epic: 'border-pink-400',
  Legendary: 'border-yellow-400',
};

export const GrowthPackSelector = ({ anima, onPackApplied }) => {
  // Component implementation remains exactly the same
  const { actor } = useAuth();
  const [availablePacks, setAvailablePacks] = useState([]);
  const [selectedPack, setSelectedPack] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    fetchAvailablePacks();
  }, [anima]);

  const fetchAvailablePacks = async () => {
    try {
      const packs = await actor.list_available_packs(BigInt(anima.token_id));
      setAvailablePacks(packs);
    } catch (err) {
      console.error('Failed to fetch growth packs:', err);
      setError('Failed to load growth packs');
    }
  };

  const handlePackSelection = async (pack) => {
    setSelectedPack(pack);
  };

  const handlePackPurchase = async () => {
    if (!selectedPack) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await actor.purchase_growth_pack(
        BigInt(anima.token_id),
        BigInt(selectedPack.id)
      );

      if ('Ok' in result) {
        const updates = result.Ok;
        await onPackApplied(updates);
        setSelectedPack(null);
        fetchAvailablePacks();
      } else {
        setError(result.Err);
      }
    } catch (err) {
      console.error('Failed to purchase growth pack:', err);
      setError('Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return (price / 100000000).toFixed(2) + ' ICP';
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
      {/* Component JSX remains exactly the same */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Growth Packs</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'available'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            Available
          </button>
          <button
            onClick={() => setActiveTab('owned')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'owned'
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            Owned
          </button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4"
        >
          <p className="text-red-400">{error}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {availablePacks.map((pack) => (
            <motion.div
              key={pack.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              className={`relative bg-white/5 rounded-xl p-4 border-2 ${
                rarityBorders[pack.rarity]
              } cursor-pointer transition-colors hover:bg-white/10 ${
                selectedPack?.id === pack.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => handlePackSelection(pack)}
            >
              <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${rarityColors[pack.rarity]}`}>
                {pack.rarity}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">{pack.name}</h3>
                <p className="text-gray-300 text-sm">{pack.description}</p>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-purple-300">Trait Boosts:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {pack.traits_boost.map(([trait, value]) => (
                      <div key={trait} className="flex items-center space-x-1">
                        <span className="text-gray-300 text-sm">{trait}</span>
                        <span className="text-green-400 text-sm">+{(value * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-purple-300">Unlocks Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {pack.skill_unlocks.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-white/10 rounded-lg text-xs text-gray-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-purple-300">Requirements:</h4>
                  <div className="text-sm text-gray-300">
                    <p>Level {pack.requirements.min_level}+</p>
                    {pack.requirements.required_traits.map(([trait, value]) => (
                      <p key={trait}>
                        {trait}: {(value * 100).toFixed(0)}%
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-white font-semibold">{formatPrice(pack.price)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePackPurchase(pack);
                    }}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      isLoading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                    }`}
                  >
                    {isLoading ? 'Processing...' : 'Purchase'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {selectedPack && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedPack(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white">Confirm Purchase</h3>
            <p className="text-gray-300">
              Are you sure you want to purchase the {selectedPack.name} pack for {formatPrice(selectedPack.price)}?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedPack(null)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePackPurchase}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition"
              >
                {isLoading ? 'Processing...' : 'Confirm Purchase'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};