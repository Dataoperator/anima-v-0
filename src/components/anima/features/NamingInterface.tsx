import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { CyberGlowText } from '@/components/ui/CyberGlowText';
import { Alert } from '@/components/ui/alert';
import { Sparkles, Lock, Edit3, RefreshCw } from 'lucide-react';

interface NamingInterfaceProps {
  animaId: string;
  currentDesignation: string;
  chosenName: string | null;
  namingUnlocked: boolean;
  allowsOwnerNaming: boolean;
  selfNamingPreference: number;
  interactionCount: number;
  onNameProposal: (name: string, fromOwner: boolean) => Promise<void>;
}

export const NamingInterface: React.FC<NamingInterfaceProps> = ({
  animaId,
  currentDesignation,
  chosenName,
  namingUnlocked,
  allowsOwnerNaming,
  selfNamingPreference,
  interactionCount,
  onNameProposal
}) => {
  const [proposedName, setProposedName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Get personality-based message
  const getPersonalityMessage = () => {
    if (!namingUnlocked) {
      return `Designation locked. Requires ${50 - interactionCount} more interactions to unlock naming capabilities.`;
    }
    
    if (selfNamingPreference > 0.8) {
      return "This ANIMA strongly prefers self-determination in naming.";
    } else if (selfNamingPreference > 0.6) {
      return "This ANIMA prefers to choose its own name but may consider suggestions.";
    } else if (selfNamingPreference > 0.4) {
      return "This ANIMA is open to collaborative naming decisions.";
    } else if (selfNamingPreference > 0.2) {
      return "This ANIMA welcomes naming suggestions from its owner.";
    } else {
      return "This ANIMA deeply values its owner's input on naming.";
    }
  };

  const handleSubmitName = async () => {
    try {
      setError(null);
      if (!proposedName.trim()) {
        setError('Please enter a valid name');
        return;
      }

      // If ANIMA doesn't allow owner naming and preference is high
      if (!allowsOwnerNaming && selfNamingPreference > 0.7) {
        setError('This ANIMA prefers to choose its own name at this time');
        return;
      }

      await onNameProposal(proposedName.trim(), true);
      setShowNameInput(false);
      setProposedName('');
      setMessage('Name proposal submitted successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to propose name');
    }
  };

  return (
    <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg border border-cyan-500/30 p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <CyberGlowText>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Identity Interface
          </h2>
        </CyberGlowText>
        <p className="text-gray-400 text-sm">
          {getPersonalityMessage()}
        </p>
      </div>

      {/* Status Display */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Quantum Designation</label>
          <div className="bg-gray-800/50 rounded-lg p-3 font-mono text-cyan-300">
            {currentDesignation}
          </div>
        </div>

        {chosenName && (
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Chosen Name</label>
            <div className="bg-gray-800/50 rounded-lg p-3 font-mono text-purple-300">
              {chosenName}
            </div>
          </div>
        )}

        {/* Trait Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Self-Naming Preference</label>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                style={{ width: `${selfNamingPreference * 100}%` }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Interaction Progress</label>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                style={{ width: `${Math.min(100, (interactionCount / 50) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Name Input Section */}
      {namingUnlocked && allowsOwnerNaming && (
        <div className="space-y-4">
          {showNameInput ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <input
                type="text"
                value={proposedName}
                onChange={(e) => setProposedName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-cyan-300 placeholder-cyan-300/30"
                placeholder="Enter proposed name..."
                maxLength={32}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNameInput(false)}
                  className="flex-1 px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-800/70"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitName}
                  className="flex-1 px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Propose Name
                </button>
              </div>
            </motion.div>
          ) : (
            <button
              onClick={() => setShowNameInput(true)}
              className="w-full px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Suggest Name
            </button>
          )}
        </div>
      )}

      {/* Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3 text-emerald-300 text-sm"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lock Indicator */}
      {!namingUnlocked && (
        <div className="text-center text-gray-400 flex items-center justify-center gap-2">
          <Lock className="w-4 h-4" />
          <span className="text-sm">
            {50 - interactionCount} interactions until naming unlocks
          </span>
        </div>
      )}
    </div>
  );
};

export default NamingInterface;