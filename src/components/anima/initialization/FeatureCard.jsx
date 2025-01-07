import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.05, y: -5 }}
    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 p-6 flex flex-col"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10" />
    <div className="relative z-10">
      <div className="mb-4 p-3 bg-indigo-500/20 rounded-xl w-fit">
        <Icon className="w-6 h-6 text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-indigo-100/80">{description}</p>
    </div>
  </motion.div>
);

export default FeatureCard;