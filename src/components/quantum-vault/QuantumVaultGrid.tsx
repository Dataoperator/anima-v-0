import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, Star, Trophy } from 'lucide-react';
import { AnimaNFT } from '@/types';
import { useAnima } from '@/hooks/useAnima';

interface AnimaPreviewCardProps {
  anima: AnimaNFT;
  onClick: () => void;
}

const AnimaPreviewCard: React.FC<AnimaPreviewCardProps> = ({ anima, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative bg-gray-900/50 rounded-lg overflow-hidden 
                border border-violet-500/20 cursor-pointer group"
    >
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 
                    to-cyan-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* Content */}
      <div className="relative p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-violet-300">
              {anima.name}
            </h3>
            <p className="text-sm text-violet-400/60">
              #{anima.token_id.toString().padStart(4, '0')}
            </p>
          </div>
          
          {/* Edition Badge */}
          {anima.metadata.edition_type && (
            <div className="px-3 py-1 rounded-full bg-violet-500/20 
                         text-violet-300 text-xs font-medium">
              {anima.metadata.edition_type}
            </div>
          )}
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-2 rounded bg-black/20">
            <div className="text-xs text-violet-400/60">Coherence</div>
            <div className="text-lg font-medium text-violet-300">
              {(anima.quantum_state.coherence * 100).toFixed(1)}%
            </div>
          </div>
          <div className="p-2 rounded bg-black/20">
            <div className="text-xs text-violet-400/60">Evolution</div>
            <div className="text-lg font-medium text-violet-300">
              Level {anima.metadata.evolution_level}
            </div>
          </div>
        </div>

        {/* Genesis Traits */}
        {anima.metadata.genesis_traits && (
          <div className="space-y-2">
            <div className="text-xs text-violet-400/60">Genesis Traits</div>
            <div className="flex flex-wrap gap-2">
              {anima.metadata.genesis_traits.map((trait, i) => (
                <div
                  key={i}
                  className="px-2 py-1 rounded-full bg-violet-500/10 
                           text-violet-300 text-xs font-medium
                           flex items-center space-x-1"
                >
                  <Star className="w-3 h-3" />
                  <span>{trait}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rare Achievements */}
        {anima.metadata.achievements?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {anima.metadata.achievements.map((achievement, i) => (
              <div
                key={i}
                className="px-2 py-1 rounded-full bg-cyan-500/10 
                         text-cyan-300 text-xs font-medium
                         flex items-center space-x-1"
              >
                <Trophy className="w-3 h-3" />
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-violet-500/20 
                    to-transparent opacity-0 group-hover:opacity-100 
                    transition-opacity pointer-events-none" />
    </motion.div>
  );
};

export const QuantumVaultGrid: React.FC = () => {
  const { animas } = useAnima();
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-violet-300">
            Quantum Vault
          </h2>
          
          {/* Mint New ANIMA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/mint')}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-700 
                     rounded-lg text-white font-medium
                     flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Mint New ANIMA</span>
          </motion.button>
        </div>

        {/* ANIMA Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animas.map((anima) => (
            <AnimaPreviewCard
              key={anima.token_id}
              anima={anima}
              onClick={() => navigate(`/anima/${anima.token_id}`)}
            />
          ))}
          
          {animas.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <Sparkles className="w-12 h-12 text-violet-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-violet-300 mb-2">
                No ANIMAs Yet
              </h3>
              <p className="text-violet-400/60">
                Start your journey by minting your first ANIMA
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};