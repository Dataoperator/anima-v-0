import { Identity } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";

export interface KeyringConfig {
  name: string;
  derivationOrigin?: string;
  keyType: "seed_phrase" | "browser_storage_key" | "pem_file";
}

export class KeyringService {
  private static instance: KeyringService;
  private identity: Identity | null = null;
  private readonly KEYRING_APP_NAME = "ANIMA: Living NFTs";
  private readonly STORAGE_KEY = "anima_keyring";

  private constructor() {}

  static getInstance(): KeyringService {
    if (!KeyringService.instance) {
      KeyringService.instance = new KeyringService();
    }
    return KeyringService.instance;
  }

  async initialize(config: KeyringConfig): Promise<void> {
    try {
      switch (config.keyType) {
        case "browser_storage_key": {
          const storedKey = localStorage.getItem(this.STORAGE_KEY);
          if (storedKey) {
            this.identity = Ed25519KeyIdentity.fromJSON(storedKey);
          } else {
            const newIdentity = Ed25519KeyIdentity.generate();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newIdentity.toJSON()));
            this.identity = newIdentity;
          }
          break;
        }
        case "seed_phrase":
        case "pem_file": {
          // For now, generate a new identity - we can implement proper seed phrase
          // and PEM handling later
          const newIdentity = Ed25519KeyIdentity.generate();
          this.identity = newIdentity;
          break;
        }
      }
    } catch (error) {
      console.error('Failed to initialize keyring:', error);
      throw new Error('Keyring initialization failed');
    }
  }

  async getIdentity(): Promise<Identity | null> {
    if (!this.identity) {
      throw new Error('Keyring not initialized');
    }
    return this.identity;
  }

  async signMessage(message: ArrayBuffer): Promise<ArrayBuffer> {
    if (!this.identity) {
      throw new Error('Keyring not initialized');
    }
    return (this.identity as Ed25519KeyIdentity).sign(message);
  }

  async verifySignature(
    signature: ArrayBuffer,
    message: ArrayBuffer,
    publicKey: ArrayBuffer
  ): Promise<boolean> {
    if (!this.identity) {
      throw new Error('Keyring not initialized');
    }
    return (this.identity as Ed25519KeyIdentity).verify(signature, message, publicKey);
  }

  async exportIdentity(): Promise<string> {
    if (!this.identity) {
      throw new Error('Keyring not initialized');
    }
    return JSON.stringify((this.identity as Ed25519KeyIdentity).toJSON());
  }

  async importIdentity(exportedData: string): Promise<void> {
    try {
      this.identity = Ed25519KeyIdentity.fromJSON(exportedData);
    } catch (error) {
      console.error('Failed to import identity:', error);
      throw new Error('Identity import failed');
    }
  }

  isInitialized(): boolean {
    return this.identity !== null;
  }
}

export const keyringService = KeyringService.getInstance();