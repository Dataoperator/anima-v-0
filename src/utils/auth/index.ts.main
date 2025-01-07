import { AuthClient } from "@dfinity/auth-client";
import { II_URL, AUTH_MAX_TIME_TO_LIVE } from "@/config/ii-config";
import { Actor, Identity, type AuthManager } from "./types";
import { createActor } from "../agent";
import { canisterId } from "@/declarations/anima";

let authInstance: Auth | null = null;

class Auth implements AuthManager {
  private authClient: AuthClient | null = null;
  private actor: Actor | null = null;
  private refreshTimer: ReturnType<typeof setInterval> | null = null;
  private lastActivity: number = Date.now();

  public async init(): Promise<void> {
    this.authClient = await AuthClient.create();
    await this.checkAuth();
  }

  public async login(): Promise<Identity> {
    if (!this.authClient) {
      throw new Error("Auth client not initialized");
    }

    return new Promise<Identity>((resolve, reject) => {
      void this.authClient?.login({
        identityProvider: II_URL,
        maxTimeToLive: AUTH_MAX_TIME_TO_LIVE,
        derivationOrigin: window.location.origin,
        onSuccess: async () => {
          if (!this.authClient) {
            reject(new Error("Auth client not initialized"));
            return;
          }
          const identity = this.authClient.getIdentity();
          await this.setupActor(identity);
          resolve(identity);
        },
        onError: (error?: string) => {
          reject(new Error(error || "Login failed"));
        }
      });
    });
  }

  public async logout(): Promise<void> {
    if (!this.authClient) {
      throw new Error("Auth client not initialized");
    }

    await this.authClient.logout();
    this.actor = null;
    this.stopRefreshTimer();
  }

  public async isAuthenticated(): Promise<boolean> {
    if (!this.authClient) {
      return false;
    }
    return this.authClient.isAuthenticated();
  }

  public getIdentity(): Identity {
    if (!this.authClient) {
      throw new Error("Auth client not initialized");
    }
    return this.authClient.getIdentity();
  }

  public getActor(): Actor | null {
    return this.actor;
  }

  public updateActivity(): void {
    this.lastActivity = Date.now();
  }

  private async checkAuth(): Promise<void> {
    if (!this.authClient) {
      throw new Error("Auth client not initialized");
    }

    if (await this.authClient.isAuthenticated()) {
      const identity = this.authClient.getIdentity();
      await this.setupActor(identity);
      this.startRefreshTimer();
    }
  }

  private async setupActor(identity: Identity): Promise<void> {
    this.actor = await createActor(canisterId, {
      agentOptions: {
        identity
      }
    });
  }

  private startRefreshTimer(): void {
    this.stopRefreshTimer();
    this.refreshTimer = setInterval(async () => {
      if (Date.now() - this.lastActivity > 30 * 60 * 1000) { // 30 minutes
        await this.logout();
      }
    }, 60 * 1000);
  }

  private stopRefreshTimer(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}

export async function getAuthManager(): Promise<Auth> {
  if (!authInstance) {
    authInstance = new Auth();
    await authInstance.init();
  }
  return authInstance;
}

export { Auth as authManager };