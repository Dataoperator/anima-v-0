import { HttpAgent, Actor } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { idlFactory } from '@/declarations/anima/anima.did.js';
import { canisterEnv } from '@/config/canisterEnv';

const HOSTS = {
  IC: 'https://ic0.app',
  IC0: 'https://icp0.io',
  RAW: 'https://raw.ic0.app'
};

const createFetch = (host) => {
  return async (resource, options) => {
    const headers = new Headers(options?.headers || {});
    
    // Only add x-ic-request-id for non-preflight requests
    if (options?.method !== 'OPTIONS') {
      headers.set('x-ic-request-id', crypto.randomUUID());
    }
    
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/cbor');
    }

    const modifiedOptions = {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'omit'
    };

    try {
      const response = await fetch(resource, modifiedOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      console.warn(`Fetch failed for ${resource}:`, error);
      throw error;
    }
  };
};

const verifyConnection = async (agent, host) => {
  try {
    await agent.fetchRootKey();
    await agent.status();
    return true;
  } catch (error) {
    console.warn(`Connection verification failed for ${host}:`, error);
    return false;
  }
};

const createAgent = async (identity) => {
  let agent = null;
  let lastError = null;

  // Try each host in sequence
  for (const [name, host] of Object.entries(HOSTS)) {
    try {
      agent = new HttpAgent({
        identity,
        host,
        fetch: createFetch(host),
        retryTimes: 2,
        fetchRootKey: process.env.DFX_NETWORK !== 'ic'
      });

      if (await verifyConnection(agent, host)) {
        console.log(`Successfully connected to ${name}`);
        return agent;
      }
    } catch (error) {
      lastError = error;
      console.warn(`Failed to create agent for ${name}:`, error);
    }
  }

  throw new Error(`Failed to connect to IC network: ${lastError?.message}`);
};

export const initializeAgent = async (identity) => {
  try {
    const agent = await createAgent(identity);
    
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: canisterEnv.anima
    });

    return { agent, actor };
  } catch (error) {
    console.error('Agent initialization failed:', error);
    throw error;
  }
};

export const createAuthClient = async () => {
  const storageWrapper = {
    get: (key) => {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (e) {
        console.error('Storage get error:', e);
        return null;
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error('Storage set error:', e);
      }
    },
    remove: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Storage remove error:', e);
      }
    }
  };

  return AuthClient.create({
    idleOptions: {
      idleTimeout: 1000 * 60 * 30,
      disableDefaultIdleCallback: true
    },
    storage: storageWrapper,
    keyType: 'Ed25519'
  });
};