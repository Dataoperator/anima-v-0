import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Heart, Zap } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
  >
    <Icon className="w-8 h-8 text-indigo-400 mb-4" />
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-indigo-100/80">{description}</p>
  </motion.div>
);

export function IntroView({ onConnect }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
      </div>

      <motion.div 
        className="relative container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.02, 0.98, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block"
          >
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
              Living NFT
            </h1>
          </motion.div>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Experience the next evolution of digital companions. Your NFT lives, learns, and grows with you on the Internet Computer.
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 w-full max-w-6xl"
        >
          <FeatureCard
            icon={Brain}
            title="AI-Powered"
            description="Autonomous personality that evolves through your interactions"
          />
          <FeatureCard
            icon={Heart}
            title="Forms Bonds"
            description="Creates unique relationships based on your interactions"
          />
          <FeatureCard
            icon={Sparkles}
            title="Growth Packs"
            description="Unlock new abilities and traits for your companion"
          />
          <FeatureCard
            icon={Zap}
            title="On-Chain Memory"
            description="All experiences are permanently stored on the blockchain"
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-4"
        >
          <motion.button
            onClick={onConnect}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg shadow-lg shadow-purple-500/30 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Connect with Internet Identity
          </motion.button>
          
          <a 
            href="https://internetcomputer.org/docs/current/tokenomics/identity-auth/what-is-ic-identity"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-300 hover:text-indigo-200 text-sm"
          >
            Learn more about Internet Identity →
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}