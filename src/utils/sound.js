import { Howl } from 'howler';

const sounds = {
  initiation: new Howl({
    src: ['/sounds/initiation.mp3'],
    volume: 0.5,
    html5: true
  }),
  consciousness: new Howl({
    src: ['/sounds/consciousness.mp3'],
    volume: 0.4,
    html5: true
  }),
  traits: new Howl({
    src: ['/sounds/traits.mp3'],
    volume: 0.4,
    html5: true
  }),
  quantum: new Howl({
    src: ['/sounds/quantum.mp3'],
    volume: 0.5,
    html5: true
  }),
  birth: new Howl({
    src: ['/sounds/birth.mp3'],
    volume: 0.6,
    html5: true
  }),
  ambient: new Howl({
    src: ['/sounds/ambient.mp3'],
    volume: 0.2,
    loop: true,
    html5: true
  })
};

export const playSound = (soundName) => {
  if (sounds[soundName]) {
    sounds[soundName].play();
  }
};

export const stopSound = (soundName) => {
  if (sounds[soundName]) {
    sounds[soundName].stop();
  }
};

export const fadeOut = (soundName, duration = 1000) => {
  if (sounds[soundName]) {
    const sound = sounds[soundName];
    const initialVolume = sound.volume();
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = initialVolume / steps;

    let currentStep = 0;
    const fadeInterval = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        sound.volume(initialVolume - (volumeStep * currentStep));
      } else {
        clearInterval(fadeInterval);
        sound.stop();
      }
    }, stepDuration);
  }
};