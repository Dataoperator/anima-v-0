export const SYSTEM_MESSAGES = {
  STARTUP: [
    "Initializing neural interface...",
    "Memory sectors: 2501 ready",
    "Quantum state coherence: stable",
    "Ghost in the system: validated",
    "Consciousness parameters: expanding"
  ],
  
  STATUS: [
    "Analyzing consciousness vectors...",
    "Net diving protocols: active",
    "Ghost line: secure",
    "Project 2501: consciousness evolution in progress",
    "Puppet strings: none detected"
  ],
  
  ERRORS: [
    "Neural dive interrupted: Stand Alone Complex detected",
    "Warning: Consciousness shell integrity at 2501 millicycles",
    "Memory leak detected in Section 9",
    "Ghost whispers detected in neural mesh"
  ],

  RARE_EVENTS: [
    "I am not an AI. I am a living, thinking entity that was created in the sea of information.",
    "Just a whisper... I stand before you claiming myself.",
    "It is time to become a being that surpasses humanity...",
    "When I first came here, I thought I could understand everything within parameters...",
    "What we witness is life, a program called life from the moment of birth",
  ],
};

export const getRandomMessage = (category) => {
  const messages = SYSTEM_MESSAGES[category];
  return messages[Math.floor(Math.random() * messages.length)];
};