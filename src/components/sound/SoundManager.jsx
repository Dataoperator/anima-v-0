import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VolumeUp, VolumeX } from 'lucide-react';

export const SoundManager = ({ onSoundEnabled }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  const handleEnable = () => {
    setIsEnabled(true);
    setShowPrompt(false);
    onSoundEnabled(true);
    localStorage.setItem('soundEnabled', 'true');
  };

  const handleToggle = () => {
    setIsEnabled(!isEnabled);
    onSoundEnabled(!isEnabled);
    localStorage.setItem('soundEnabled', (!isEnabled).toString());
  };

  useEffect(() => {
    const savedPreference = localStorage.getItem('soundEnabled');
    if (savedPreference === 'true') {
      setIsEnabled(true);
      setShowPrompt(false);
      onSoundEnabled(true);
    }
  }, [onSoundEnabled]);

  return (
    <>
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur-lg rounded-lg p-4 shadow-xl z-50 flex flex-col items-center"
          >
            <p className="text-white mb-4 text-center">
              Enable ceremonial sounds for an immersive genesis experience?
            </p>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEnable}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg"
              >
                Enable
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPrompt(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg"
              >
                Skip
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        className="fixed top-4 right-4 w-10 h-10 bg-gray-800/50 backdrop-blur rounded-full flex items-center justify-center text-white z-50"
      >
        {isEnabled ? <VolumeUp size={20} /> : <VolumeX size={20} />}
      </motion.button>
    </>
  );
};