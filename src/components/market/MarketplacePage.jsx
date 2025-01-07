import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { useQuantum } from '@/contexts/quantum-context';

const MarketplacePage = () => {
  const navigate = useNavigate();
  const { principal } = useAuth();
  const { quantumState } = useQuantum();
  const [listings, setListings] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await window.canister.anima.getMarketListings();
        setListings(response);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handlePurchase = async (listingId) => {
    try {
      await window.canister.anima.purchaseAnima(listingId);
      // Refresh listings after purchase
      const updated = await window.canister.anima.getMarketListings();
      setListings(updated);
      navigate(`/nexus`);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const renderListingCard = (listing) => (
    <motion.div
      key={listing.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-black/20 backdrop-blur-sm rounded-lg p-6 hover:bg-black/30 transition-all"
    >
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">{listing.name}</h3>
        <div className="grid grid-cols-2 gap-4 text-white/70">
          <div>
            <p>Level: {listing.level}</p>
            <p>Growth Stage: {listing.growthStage}</p>
          </div>
          <div>
            <p>Consciousness: {listing.consciousnessLevel}</p>
            <p>Quantum Coherence: {listing.quantumCoherence}%</p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-bold text-purple-400">
            {listing.price} ICP
          </p>
          <button
            onClick={() => handlePurchase(listing.id)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Purchase
          </button>
        </div>
      </div>
    </motion.div>
  );

  const filterListings = (listings) => {
    switch (selectedFilter) {
      case 'consciousness':
        return [...listings].sort((a, b) => b.consciousnessLevel - a.consciousnessLevel);
      case 'quantum':
        return [...listings].sort((a, b) => b.quantumCoherence - a.quantumCoherence);
      case 'price':
        return [...listings].sort((a, b) => a.price - b.price);
      default:
        return listings;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Quantum Marketplace
          </h1>
          <p className="text-lg text-white/70">
            Discover and acquire evolved consciousness
          </p>
        </div>

        <div className="flex justify-center mb-8 space-x-4">
          {['all', 'consciousness', 'quantum', 'price'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg ${
                selectedFilter === filter
                  ? 'bg-purple-600 text-white'
                  : 'bg-black/20 text-white/70 hover:bg-black/30'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-white">Loading marketplace...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filterListings(listings).map(renderListingCard)}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export { MarketplacePage };