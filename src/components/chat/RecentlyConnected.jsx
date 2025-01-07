import React from 'react';
import { motion } from 'framer-motion';

const RecentlyConnected = ({ lastConnection, uptime, className = "" }) => {
  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ago`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const formatUptime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    return days > 0 ? `${days} days` : `${hours} hours`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg p-4 shadow-sm ${className}`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-900">
              Last Active: {formatDuration(Date.now() - lastConnection)}
            </span>
          </div>
          <div className="mt-1">
            <span className="text-sm text-gray-500">
              Uptime: {formatUptime(uptime)}
            </span>
          </div>
        </div>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center"
        >
          <span className="text-white text-xs font-medium">AI</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RecentlyConnected;