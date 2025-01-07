import React from 'react';
import { motion } from 'framer-motion';

const PersonalityTraits = ({ traits = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Personality Traits</h3>
      <div className="space-y-4">
        {traits.map(([trait, value], index) => (
          <div key={trait} className="relative">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {trait}
              </span>
              <span className="text-sm font-medium text-gray-500">
                {(value * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalityTraits;