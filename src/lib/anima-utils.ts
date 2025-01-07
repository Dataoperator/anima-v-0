import type { AnimaToken } from '@/declarations/anima/anima.did';
import type { Identity } from '@dfinity/agent';

export const getEmotionDisplay = (anima?: AnimaToken) => {
  if (!anima?.personality?.emotional_state?.current_emotion) return 'NEUTRAL';
  return anima.personality.emotional_state.current_emotion.toUpperCase();
};

export const getDevelopmentalStage = (anima?: AnimaToken) => {
  if (!anima?.personality?.developmental_stage) return 'GENESIS';
  const stage = Object.keys(anima.personality.developmental_stage)[0];
  return stage ? stage.toUpperCase() : 'GENESIS';
};

export const isNFTMinted = (anima?: AnimaToken) => {
  return anima?.id ? true : false;
};

export const getOwnerDisplay = (anima?: AnimaToken, identity?: Identity | null) => {
  if (!anima?.owner) return 'UNKNOWN';

  try {
    const ownerStr = anima.owner.toString();
    const currentPrincipal = identity?.getPrincipal().toString();
    const isOwner = currentPrincipal && ownerStr === currentPrincipal;
    
    return isOwner ? 'YOU' : `${ownerStr.slice(0, 5)}...${ownerStr.slice(-5)}`;
  } catch (err) {
    console.error('Error displaying owner:', err);
    return 'UNKNOWN';
  }
};