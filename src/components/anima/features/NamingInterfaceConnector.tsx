import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getAnimaActor } from '@/services/anima';
import { NamingInterface } from './NamingInterface';

interface NamingInterfaceConnectorProps {
  animaId: string;
  onNameUpdate?: (newName: string) => void;
}

export const NamingInterfaceConnector: React.FC<NamingInterfaceConnectorProps> = ({
  animaId,
  onNameUpdate
}) => {
  const { identity } = useAuth();
  const [namingState, setNamingState] = useState<{
    currentDesignation: string;
    chosenName: string | null;
    namingUnlocked: boolean;
    allowsOwnerNaming: boolean;
    selfNamingPreference: number;
    interactionCount: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNamingState = async () => {
      if (!identity) return;

      try {
        const actor = await getAnimaActor(identity);
        const state = await actor.get_naming_state(animaId);
        
        setNamingState({
          currentDesignation: state.current_designation,
          chosenName: state.chosen_name[0] || null, // Handle Option type
          namingUnlocked: state.naming_unlocked,
          allowsOwnerNaming: state.allows_owner_naming,
          selfNamingPreference: state.self_naming_preference,
          interactionCount: state.interaction_count
        });
      } catch (err) {
        console.error('Failed to fetch naming state:', err);
        setError('Failed to load ANIMA naming state');
      }
    };

    fetchNamingState();
    // Set up polling for updates
    const interval = setInterval(fetchNamingState, 5000);
    return () => clearInterval(interval);
  }, [identity, animaId]);

  const handleNameProposal = async (name: string, fromOwner: boolean) => {
    if (!identity || !namingState) return;

    try {
      const actor = await getAnimaActor(identity);
      await actor.propose_name(animaId, {
        name,
        from_owner: fromOwner
      });

      // Refetch state after proposal
      const newState = await actor.get_naming_state(animaId);
      setNamingState({
        currentDesignation: newState.current_designation,
        chosenName: newState.chosen_name[0] || null,
        namingUnlocked: newState.naming_unlocked,
        allowsOwnerNaming: newState.allows_owner_naming,
        selfNamingPreference: newState.self_naming_preference,
        interactionCount: newState.interaction_count
      });

      // Notify parent if name was updated
      if (newState.chosen_name[0] && onNameUpdate) {
        onNameUpdate(newState.chosen_name[0]);
      }
    } catch (err) {
      console.error('Failed to propose name:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to propose name');
    }
  };

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-300">
        {error}
      </div>
    );
  }

  if (!namingState) {
    return (
      <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg border border-cyan-500/30 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800/50 rounded w-3/4" />
          <div className="h-10 bg-gray-800/50 rounded" />
          <div className="h-10 bg-gray-800/50 rounded" />
          <div className="h-8 bg-gray-800/50 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <NamingInterface
      animaId={animaId}
      currentDesignation={namingState.currentDesignation}
      chosenName={namingState.chosenName}
      namingUnlocked={namingState.namingUnlocked}
      allowsOwnerNaming={namingState.allowsOwnerNaming}
      selfNamingPreference={namingState.selfNamingPreference}
      interactionCount={namingState.interactionCount}
      onNameProposal={handleNameProposal}
    />
  );
};

export default NamingInterfaceConnector;