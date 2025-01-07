import { AuthClient } from "@dfinity/auth-client";
import { II_URL, AUTH_MAX_TIME_TO_LIVE } from "@/config/ii-config";

export class IdentityService {
  private authClient: AuthClient | null = null;

  public async init(): Promise<void> {
    this.authClient = await AuthClient.create();
    await this.checkAuthenticated();
  }

  public async isAuthenticated(): Promise<boolean> {
    if (!this.authClient) {
      throw new Error("Auth client not initialized");
    }
    return this.authClient.isAuthenticated();
  }

  public async checkAuthenticated(): Promise<void> {
    const isAuthenticated = await this.isAuthenticated();
    if (!isAuthenticated) {
      throw new Error("Not authenticated");
    }
  }

  public async login(): Promise<void> {
    if (!this.authClient) {
      throw new Error("Auth client not initialized");
    }

    const loginOptions = {
      identityProvider: II_URL,
      maxTimeToLive: AUTH_MAX_TIME_TO_LIVE,
      derivationOrigin: window.location.origin,
      onSuccess: async () => {
        await this.checkAuthenticated();
      },
      onError: (error?: string) => {
        console.error("Login failed:", error);
        throw new Error(error || "Login failed");
      }
    };

    await this.authClient.login(loginOptions);
  }

  public async logout(): Promise<void> {
    if (!this.authClient) {
      throw new Error("Auth client not initialized");
    }
    await this.authClient.logout();
  }

  public getIdentity() {
    if (!this.authClient) {
      throw new Error("Auth client not initialized");
    }
    return this.authClient.getIdentity();
  }
}