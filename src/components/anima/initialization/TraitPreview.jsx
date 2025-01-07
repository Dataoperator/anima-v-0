import React from 'react';
import { motion } from 'framer-motion';

const TraitPreview = ({ name, value, icon: Icon, description }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ scale: 1.02 }}
    className="bg-white/5 backdrop-blur rounded-lg p-4 flex items-start space-x-3 border border-white/10"
  >
    <div className="shrink-0">
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
        className="p-2 bg-indigo-500/20 rounded-lg"
      >
        <Icon className="w-5 h-5 text-indigo-400" />
      </motion.div>
    </div>
    <div className="flex-1 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-300">{name}</span>
        <span className="text-sm text-indigo-400">{Math.round(value * 100)}%</span>
      </div>
      <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
        />
      </div>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  </motion.div>
);

export default TraitPreview;