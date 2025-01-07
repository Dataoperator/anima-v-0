import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { QuantumField } from '../../ui/QuantumField';
import type { AnimaNFT } from '@/types';

interface QuantumModalProps {
  isOpen: boolean;
  onClose: () => void;
  anima?: AnimaNFT;
  children: React.ReactNode;
}

export const QuantumModal: React.FC<QuantumModalProps> = ({
  isOpen,
  onClose,
  anima,
  children
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-lg"
            onClick={onClose}
          />

          {/* Quantum Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <QuantumField intensity={0.8} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          {/* Modal Content */}
          <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative bg-gray-900/90 rounded-lg w-full max-w-4xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center space-x-3"
                >
                  {anima && (
                    <>
                      <div className="text-lg font-bold text-violet-300">
                        {anima.name}
                      </div>
                      <div className="text-sm text-violet-400/60">
                        #{anima.token_id.toString().padStart(4, '0')}
                      </div>
                    </>
                  )}
                </motion.div>

                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/70" />
                </motion.button>
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6"
              >
                {children}
              </motion.div>

              {/* Quantum Border Effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 border border-violet-500/20 rounded-lg" />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-500/5 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};