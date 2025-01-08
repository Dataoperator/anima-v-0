import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, Star, Trophy, Loader2 } from 'lucide-react';
import { AnimaNFT } from '@/types';
import { useAnima } from '@/hooks/useAnima';
import { useQuantumState } from '@/hooks/useQuantumState';

// [Previous code remains unchanged until AnimatePresence...]

        {/* ANIMA Grid */}
        <AnimatePresence mode="wait">
          {animasLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full flex items-center justify-center py-20"
            >
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                <p className="text-violet-400">Loading Quantum Vault...</p>
              </div>
            </motion.div>
          ) : animas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full py-20 text-center"
            >
              <Sparkles className="w-12 h-12 text-violet-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-violet-300 mb-2">
                No ANIMAs Yet
              </h3>
              <p className="text-violet-400/60">
                Start your journey by minting your first ANIMA
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/mint')}
                className="mt-6 px-6 py-3 bg-violet-600 hover:bg-violet-700 
                         rounded-lg text-white font-medium
                         inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Mint Now</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {animas.map((anima) => (
                <AnimaPreviewCard
                  key={anima.token_id}
                  anima={anima}
                  onClick={() => navigate(`/anima/${anima.token_id}`)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};