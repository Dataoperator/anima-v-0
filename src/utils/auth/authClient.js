import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';
import { createActor } from '@/declarations';
import { CANISTER_IDS, NETWORK_CONFIG } from '@/config';

const II_URL = `https://identity.ic0.app`;
const AUTH_MAX_TIME_TO_LIVE = BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000);

class EnhancedAuthClient {
  constructor() {
    this._authClient = null;
    this._identity = null;
    this._agent = null;
    this._actor = null;
    this._diagnostics = {
      lastError: null,
      lastAuthAttempt: null,
      connectionStatus: 'initializing'
    };
  }

  async init() {
    try {
      this._authClient = await AuthClient.create({
        idleOptions: {
          disableIdle: true, // We'll handle session management ourselves
          disableDefaultIdleCallback: true
        }
      });

      // Check if we're already authenticated
      if (await this._authClient.isAuthenticated()) {
        await this._setupIdentity();
      }

      return true;
    } catch (error) {
      this._diagnostics.lastError = {
        phase: 'initialization',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      throw error;
    }
  }

  async _setupIdentity() {
    try {
      this._identity = this._authClient.getIdentity();
      
      // Create agent with appropriate configuration
      this._agent = new HttpAgent({
        identity: this._identity,
        host: NETWORK_CONFIG.host,
        verifyQuerySignatures: !NETWORK_CONFIG.isLocal
      });

      // Fetch root key only in local development
      if (NETWORK_CONFIG.isLocal) {
        await this._agent.fetchRootKey();
      }

      // Create actor with enhanced error handling
      this._actor = await createActor(CANISTER_IDS.anima, {
        agent: this._agent,
        canisterId: CANISTER_IDS.anima
      });

      this._diagnostics.connectionStatus = 'connected';
      return true;
    } catch (error) {
      this._diagnostics.lastError = {
        phase: 'identity_setup',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      throw error;
    }
  }

  async login() {
    try {
      this._diagnostics.lastAuthAttempt = new Date().toISOString();
      
      return new Promise((resolve, reject) => {
        this._authClient.login({
          identityProvider: II_URL,
          maxTimeToLive: AUTH_MAX_TIME_TO_LIVE,
          onSuccess: async () => {
            try {
              await this._setupIdentity();
              resolve(this._identity);
            } catch (error) {
              reject(error);
            }
          },
          onError: (error) => {
            this._diagnostics.lastError = {
              phase: 'login',
              error: error.message,
              timestamp: new Date().toISOString()
            };
            reject(error);
          }
        });
      });
    } catch (error) {
      this._diagnostics.lastError = {
        phase: 'login_preparation',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      throw error;
    }
  }

  async logout() {
    try {
      await this._authClient?.logout();
      this._identity = null;
      this._agent = null;
      this._actor = null;
      this._diagnostics.connectionStatus = 'logged_out';
    } catch (error) {
      this._diagnostics.lastError = {
        phase: 'logout',
        error: error.message,
        timestamp: new Date().toISOString()
      };
      throw error;
    }
  }

  getIdentity() {
    return this._identity;
  }

  getAgent() {
    return this._agent;
  }

  getActor() {
    return this._actor;
  }

  getDiagnostics() {
    return {
      ...this._diagnostics,
      hasIdentity: !!this._identity,
      hasAgent: !!this._agent,
      hasActor: !!this._actor,
      principalId: this._identity?.getPrincipal().toString()
    };
  }

  isAuthenticated() {
    return this._authClient?.isAuthenticated() || false;
  }
}

// Singleton instance
let authClientInstance = null;

export const getAuthClient = async () => {
  if (!authClientInstance) {
    authClientInstance = new EnhancedAuthClient();
    await authClientInstance.init();
  }
  return authClientInstance;
};