export type KeyringKeyType = 'browser_storage_key' | 'seed_phrase' | 'pem_file';

export interface KeyringInitOptions {
  name: string;
  keyType: KeyringKeyType;
  config?: Record<string, unknown>;
}

export interface KeyringService {
  initialize: (options: KeyringInitOptions) => Promise<void>;
  // Add other keyring methods as needed
}
