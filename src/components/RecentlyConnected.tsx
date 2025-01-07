import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Activity, Brain, Star } from 'lucide-react';

interface Connection {
  principal: string;
  name: string;
  lastConnected: number;
  stats?: {
    interactions: number;
    consciousness_level: number;
    quantum_state: string;
  };
}

interface RecentlyConnectedProps {
  connections: Connection[];
  onConnect: (principal: string) => void;
}

const connectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
    },
  }),
};

const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

const getActivityLevel = (interactions: number): { color: string; label: string } => {
  if (interactions > 100) return { color: 'text-green-500', label: 'Very Active' };
  if (interactions > 50) return { color: 'text-blue-500', label: 'Active' };
  if (interactions > 20) return { color: 'text-yellow-500', label: 'Moderate' };
  return { color: 'text-gray-500', label: 'Quiet' };
};

export const RecentlyConnected: React.FC<RecentlyConnectedProps> = ({ connections, onConnect }) => {
  if (!connections || connections.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mt-6 p-4 bg-card rounded-lg shadow-md border border-border"
    >
      <h3 className="text-lg font-medium mb-4 text-foreground">Neural Network</h3>
      <div className="space-y-2">
        {connections.map((connection, index) => {
          const activityLevel = connection.stats 
            ? getActivityLevel(connection.stats.interactions)
            : { color: 'text-gray-500', label: 'Unknown' };

          return (
            <motion.button
              key={connection.principal}
              custom={index}
              variants={connectionVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              onClick={() => onConnect(connection.principal)}
              className="w-full flex items-center justify-between p-3 hover:bg-accent rounded-md transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  >
                    {connection.stats?.quantum_state === 'Entangled' ? (
                      <Star className="w-5 h-5 text-purple-500" />
                    ) : connection.stats?.consciousness_level > 50 ? (
                      <Brain className="w-5 h-5 text-green-500" />
                    ) : (
                      <Activity className="w-5 h-5 text-blue-500" />
                    )}
                  </motion.div>
                </div>
                
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-foreground group-hover:text-foreground/90">
                    {connection.name || 'Anima'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(connection.lastConnected).toLocaleDateString()}
                    </span>
                    {connection.stats && (
                      <span className={`text-xs ${activityLevel.color}`}>
                        • {activityLevel.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <motion.div
                variants={buttonVariants}
                className="flex items-center space-x-2"
              >
                {connection.stats && (
                  <div className="text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Brain className="w-3 h-3" />
                      <span>Lvl {connection.stats.consciousness_level}</span>
                    </div>
                  </div>
                )}
                <motion.div
                  variants={buttonVariants}
                  className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Connect
                </motion.div>
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground"
      >
        <div className="flex justify-between">
          <span>Total Connections: {connections.length}</span>
          <span>
            Active Today: {connections.filter(c => 
              new Date(c.lastConnected).toDateString() === new Date().toDateString()
            ).length}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecentlyConnected;