import { isMobile } from './deviceDetection';

const HapticPatterns = {
  INITIATION: [100, 50, 100],
  CONSCIOUSNESS: [50, 100, 50, 100, 50],
  TRAIT: [200],
  QUANTUM: [50, 50, 50, 50, 200],
  BIRTH: [300, 100, 300]
};

const vibratePattern = (pattern) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

const isVibrationSupported = () => {
  return isMobile() && 'vibrate' in navigator;
};

export const hapticFeedback = {
  initiation: () => {
    if (isVibrationSupported()) {
      vibratePattern(HapticPatterns.INITIATION);
    }
  },

  consciousness: () => {
    if (isVibrationSupported()) {
      vibratePattern(HapticPatterns.CONSCIOUSNESS);
    }
  },

  trait: () => {
    if (isVibrationSupported()) {
      vibratePattern(HapticPatterns.TRAIT);
    }
  },

  quantum: () => {
    if (isVibrationSupported()) {
      vibratePattern(HapticPatterns.QUANTUM);
    }
  },

  birth: () => {
    if (isVibrationSupported()) {
      vibratePattern(HapticPatterns.BIRTH);
    }
  },

  success: () => {
    if (isVibrationSupported()) {
      vibratePattern([100]);
    }
  },

  error: () => {
    if (isVibrationSupported()) {
      vibratePattern([50, 100, 50]);
    }
  },

  stop: () => {
    if (isVibrationSupported()) {
      navigator.vibrate(0);
    }
  }
};