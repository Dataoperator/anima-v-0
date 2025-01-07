import { useState, useCallback, useEffect } from 'react';
import { useAnima } from './useAnima';
import { MediaAction, MediaState } from '@/autonomous/MediaActions';

export const useNeuralLink = (animaId: string) => {
  const { anima, sendMessage, loading, error } = useAnima(animaId);
  const [mediaState, setMediaState] = useState<MediaState>({
    currentUrl: null,
    isPlaying: false,
    volume: 0.75,
    timestamp: 0
  });

  const handleMediaAction = useCallback(async (action: MediaAction) => {
    try {
      // Send the media action to the ANIMA canister
      const response = await anima?.handleMediaAction(action);
      
      // Update local media state based on ANIMA's response
      if (response?.newState) {
        setMediaState(response.newState);
      }

      // If it's a search action, process the results
      if (action.type === 'search' && response?.searchResults) {
        return response.searchResults;
      }

      return response;
    } catch (error) {
      console.error('Failed to process media action:', error);
      throw error;
    }
  }, [anima]);

  const handleMediaStateChange = useCallback((newState: MediaState) => {
    setMediaState(newState);
    // Optionally sync state with the canister
    anima?.syncMediaState(newState).catch(console.error);
  }, [anima]);

  // Listen for ANIMA-initiated media actions
  useEffect(() => {
    if (!anima) return;

    const unsubscribe = anima.subscribeToMediaActions((action: MediaAction) => {
      handleMediaAction(action).catch(console.error);
    });

    return () => unsubscribe?.();
  }, [anima, handleMediaAction]);

  return {
    mediaState,
    handleMediaAction,
    handleMediaStateChange,
    loading,
    error
  };
};

export default useNeuralLink;