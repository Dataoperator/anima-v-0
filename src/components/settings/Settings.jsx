import React from 'react';
import { useAuth } from '../../AuthProvider';
import { motion } from 'framer-motion';

export const Settings = () => {
  const { authState } = useAuth();
  
  // Safely check for principal
  const principalId = authState?.principal?.toString();
  const shortPrincipalId = principalId 
    ? `${principalId.slice(0, 10)}...` 
    : 'Not connected';

  // Determine connection status
  const isConnected = !!(authState?.actor && authState?.principal);
  const status = authState?.isInitializing ? 'Initializing...' 
               : isConnected ? 'Connected' 
               : 'Not connected';
  
  const statusColor = authState?.isInitializing ? "text-yellow-400"
                   : isConnected ? "text-green-400"
                   : "text-red-400";

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">About Your Anima</h4>
        <div className="bg-gray-700 rounded-md p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">ID</span>
            <span className="text-gray-200">{shortPrincipalId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Status</span>
            <span className={statusColor}>
              {status}
            </span>
          </div>
        </div>
      </div>

      {authState?.isInitializing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 rounded bg-yellow-900/30 text-yellow-200 text-sm"
        >
          Connecting to your Anima...
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 p-4 rounded-md bg-blue-900/30 text-blue-200 text-sm"
      >
        <h4 className="font-medium mb-2">Help</h4>
        <p>
          Chat with your Anima to help it learn and grow. The more you interact,
          the more its personality will develop!
        </p>
      </motion.div>
    </div>
  );
};

export default Settings;