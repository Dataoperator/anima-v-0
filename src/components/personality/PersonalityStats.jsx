import React from 'react';
import { useAuth } from '../../AuthProvider';
import { motion } from 'framer-motion';

const DEFAULT_STATS = [
  { trait: 'Curiosity', value: 0.5 },
  { trait: 'Empathy', value: 0.5 },
  { trait: 'Creativity', value: 0.5 },
  { trait: 'Logic', value: 0.5 },
  { trait: 'Wisdom', value: 0.5 },
];

const TraitBar = ({ trait, value, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-gray-700 rounded-lg p-4 space-y-2"
  >
    <div className="flex justify-between items-center mb-2">
      <span className="text-gray-300 font-medium">{trait}</span>
      <span className="text-blue-400">{Math.round(value * 100)}%</span>
    </div>
    <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full bg-blue-500 rounded-full"
      />
    </div>
  </motion.div>
);

export const PersonalityStats = () => {
  const { authState } = useAuth();
  const [stats, setStats] = React.useState(DEFAULT_STATS);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      if (!authState?.actor || !authState?.principal) return;
      
      try {
        const response = await authState.actor.get_anima(authState.principal);
        if ('Ok' in response) {
          const traits = response.Ok.personality.traits.map(([trait, value]) => ({
            trait,
            value: Number(value)
          }));
          setStats(traits);
        }
      } catch (error) {
        console.error('Failed to fetch personality stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [authState?.actor, authState?.principal]);

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Personality Traits</h3>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <TraitBar
              key={stat.trait}
              trait={stat.trait}
              value={stat.value}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonalityStats;