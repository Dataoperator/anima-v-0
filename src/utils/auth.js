import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';
import { createAnimaActor } from './auth/createActor';
import { NETWORK_CONFIG } from '@/config';
import { logError } from './errorReporting';

const AUTH_TIMER_KEY = 'anima_auth_timer';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export class AuthManager {
  static instance = null;
  
  constructor() {
    this.authClient = null;
    this.agent = null;
    this.identity = null;
    this.actor = null;
    this.refreshTimer = null;
  }

  static async getInstance() {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
      await AuthManager.instance.initialize();
    }
    return AuthManager.instance;
  }

  async initialize() {
    try {
      this.authClient = await AuthClient.create({
        idleOptions: {
          idleTimeout: SESSION_TIMEOUT,
          disableDefaultIdleCallback: true
        }
      });

      if (await this.authClient.isAuthenticated()) {
        await this.setupAuthentication();
      }
    } catch (error) {
      logError(error, { context: 'AuthManager.initialize' });
      throw error;
    }
  }

  async setupAuthentication() {
    this.identity = this.authClient.getIdentity();
    
    this.agent = new HttpAgent({
      identity: this.identity,
      host: NETWORK_CONFIG.host
    });

    if (NETWORK_CONFIG.local) {
      await this.agent.fetchRootKey();
    }

    try {
      this.actor = await createAnimaActor(this.identity);
      this.startRefreshTimer();
    } catch (error) {
      logError(error, { context: 'AuthManager.setupAuthentication' });
      throw error;
    }
  }

  startRefreshTimer() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    this.updateActivityTimestamp();

    this.refreshTimer = setInterval(() => {
      const lastActivity = parseInt(localStorage.getItem(AUTH_TIMER_KEY) || '0');
      if (Date.now() - lastActivity > SESSION_TIMEOUT) {
        this.logout();
      }
    }, 60000);
  }

  updateActivityTimestamp() {
    localStorage.setItem(AUTH_TIMER_KEY, Date.now().toString());
  }

  async login() {
    if (!this.authClient) {
      throw new Error('Auth client not initialized');
    }

    return new Promise((resolve, reject) => {
      try {
        this.authClient.login({
          identityProvider: 'https://identity.ic0.app',
          maxTimeToLive: BigInt(SESSION_TIMEOUT * 1000000), // Convert to nanoseconds
          onSuccess: async () => {
            try {
              await this.setupAuthentication();
              resolve(this.identity);
            } catch (error) {
              logError(error, { context: 'AuthManager.login.onSuccess' });
              reject(error);
            }
          },
          onError: (error) => {
            logError(error, { context: 'AuthManager.login.onError' });
            reject(error);
          }
        });
      } catch (error) {
        logError(error, { context: 'AuthManager.login' });
        reject(error);
      }
    });
  }

  async logout() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }

    localStorage.removeItem(AUTH_TIMER_KEY);

    if (this.authClient) {
      await this.authClient.logout();
      this.identity = null;
      this.agent = null;
      this.actor = null;
    }
  }

  getIdentity() {
    return this.identity;
  }

  getAgent() {
    return this.agent;
  }

  getActor() {
    return this.actor;
  }

  async isAuthenticated() {
    return this.authClient ? this.authClient.isAuthenticated() : false;
  }

  updateActivity() {
    this.updateActivityTimestamp();
  }
}

export const getAuthManager = () => AuthManager.getInstance();