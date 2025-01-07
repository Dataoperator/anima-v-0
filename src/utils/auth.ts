import { AuthClient } from '@dfinity/auth-client';
import { II_CONFIG, II_URL } from '../ii-config';

export const initAuth = async (): Promise<AuthClient> => {
  try {
    const client = await AuthClient.create({
      idleOptions: II_CONFIG.idleOptions
    });
    return client;
  } catch (err) {
    console.error('Auth initialization failed:', err);
    throw new Error('Failed to initialize authentication');
  }
};

export const login = async (authClient: AuthClient): Promise<boolean> => {
  return new Promise((resolve) => {
    authClient.login({
      identityProvider: II_URL,
      onSuccess: () => resolve(true),
      onError: () => resolve(false)
    });
  });
};

export const getAuthenticatedIdentity = (authClient: AuthClient) => {
  if (!authClient.isAuthenticated()) {
    throw new Error('Not authenticated');
  }
  return authClient.getIdentity();
};