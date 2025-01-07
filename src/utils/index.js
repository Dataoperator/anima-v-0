export { initializeAgent, createAuthClient } from './agent';
export { cn } from './cn';
export { default as logger } from './logging';
export { verifyActorHealth, checkActorMethods, getActorMethodStatus } from './actorVerification';

export const isOnline = () => {
  return window.navigator.onLine;
};

export const withTimeout = (promise, timeout = 10000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    ),
  ]);
};