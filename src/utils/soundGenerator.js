let audioContext;

const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

// Ethereal ambient pad sound
export const createAmbientSound = () => {
  const ctx = initAudioContext();
  const oscillators = [];
  const gains = [];
  
  // Create multiple oscillators for rich texture
  const frequencies = [220, 277.18, 329.63, 440]; // A3, C#4, E4, A4
  frequencies.forEach(freq => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0;
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    oscillators.push(osc);
    gains.push(gain);
    
    osc.start();
  });

  // Fade in
  gains.forEach(gain => {
    gain.gain.setTargetAtTime(0.1, ctx.currentTime, 2);
  });

  return {
    stop: () => {
      gains.forEach(gain => {
        gain.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
      });
      setTimeout(() => {
        oscillators.forEach(osc => osc.stop());
      }, 1000);
    }
  };
};

// Quantum alignment sound
export const createQuantumSound = () => {
  const ctx = initAudioContext();
  const mainOsc = ctx.createOscillator();
  const modulatorOsc = ctx.createOscillator();
  const modulatorGain = ctx.createGain();
  const mainGain = ctx.createGain();
  
  modulatorOsc.frequency.value = 2;
  modulatorOsc.type = 'sine';
  modulatorGain.gain.value = 100;
  
  mainOsc.frequency.value = 440;
  mainOsc.type = 'sine';
  mainGain.gain.value = 0;
  
  modulatorOsc.connect(modulatorGain);
  modulatorGain.connect(mainOsc.frequency);
  mainOsc.connect(mainGain);
  mainGain.connect(ctx.destination);
  
  mainOsc.start();
  modulatorOsc.start();
  
  // Fade in
  mainGain.gain.setTargetAtTime(0.2, ctx.currentTime, 0.1);
  
  return {
    stop: () => {
      mainGain.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
      setTimeout(() => {
        mainOsc.stop();
        modulatorOsc.stop();
      }, 200);
    }
  };
};

// Consciousness emergence sound
export const createConsciousnessSound = () => {
  const ctx = initAudioContext();
  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 500;
  filter.Q.value = 1;
  
  const gain = ctx.createGain();
  gain.gain.value = 0;
  
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  noise.start();
  
  // Fade in
  gain.gain.setTargetAtTime(0.15, ctx.currentTime, 1);
  
  // Sweep filter
  filter.frequency.setTargetAtTime(2000, ctx.currentTime, 2);
  
  return {
    stop: () => {
      gain.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
      setTimeout(() => noise.stop(), 1000);
    }
  };
};

// Birth completion sound
export const createBirthSound = () => {
  const ctx = initAudioContext();
  const oscillators = [];
  const gains = [];

  // Create a chord progression
  const progressionBase = [
    [440, 554.37, 659.25], // A4, C#5, E5
    [493.88, 587.33, 739.99], // B4, D5, F#5
    [523.25, 659.25, 783.99], // C5, E5, G5
    [587.33, 739.99, 880] // D5, F#5, A5
  ];

  const progression = [];
  progressionBase.forEach(chord => {
    // Add overtones for each note
    chord.forEach(freq => {
      progression.push(freq);
      progression.push(freq * 2); // Octave
      progression.push(freq * 3); // Fifth
    });
  });

  progression.forEach(freq => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0;
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    oscillators.push(osc);
    gains.push(gain);
    
    osc.start();
  });

  // Create ascending progression
  gains.forEach((gain, i) => {
    const startTime = i * 0.1;
    gain.gain.setTargetAtTime(0.05, ctx.currentTime + startTime, 0.1);
    gain.gain.setTargetAtTime(0, ctx.currentTime + startTime + 1, 0.1);
  });

  return {
    stop: () => {
      gains.forEach(gain => {
        gain.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
      });
      setTimeout(() => {
        oscillators.forEach(osc => osc.stop());
      }, 200);
    }
  };
};

// Trait manifestation sound
export const createTraitSound = () => {
  const ctx = initAudioContext();
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  const gain2 = ctx.createGain();
  
  osc1.frequency.value = 220;
  osc2.frequency.value = 440;
  osc1.type = 'triangle';
  osc2.type = 'sine';
  
  gain1.gain.value = 0;
  gain2.gain.value = 0;
  
  osc1.connect(gain1);
  osc2.connect(gain2);
  gain1.connect(ctx.destination);
  gain2.connect(ctx.destination);
  
  osc1.start();
  osc2.start();
  
  // Create ascending tone
  gain1.gain.setTargetAtTime(0.2, ctx.currentTime, 0.1);
  gain2.gain.setTargetAtTime(0.1, ctx.currentTime, 0.2);
  osc1.frequency.setTargetAtTime(440, ctx.currentTime, 1);
  osc2.frequency.setTargetAtTime(880, ctx.currentTime, 1);

  return {
    stop: () => {
      gain1.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
      gain2.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
      setTimeout(() => {
        osc1.stop();
        osc2.stop();
      }, 200);
    }
  };
};