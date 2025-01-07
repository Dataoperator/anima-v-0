import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Announcement {
  id: string;
  type: 'update' | 'alert' | 'info';
  message: string;
  timestamp: number;
}

interface Props {
  announcements: Announcement[];
}

export const GlobalAnnouncement: React.FC<Props> = ({ announcements }) => {
  const getTypeStyles = (type: Announcement['type']) => {
    switch (type) {
      case 'alert':
        return 'bg-red-500/10 border-red-500 text-red-400';
      case 'update':
        return 'bg-blue-500/10 border-blue-500 text-blue-400';
      case 'info':
        return 'bg-purple-500/10 border-purple-500 text-purple-400';
      default:
        return 'bg-gray-500/10 border-gray-500 text-gray-400';
    }
  };

  if (!announcements.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-100">Announcements</h2>
      <AnimatePresence>
        {announcements.map((announcement) => (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`p-4 rounded-lg border ${getTypeStyles(announcement.type)}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium">{announcement.message}</p>
                <p className="text-sm opacity-75">
                  {new Date(announcement.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};