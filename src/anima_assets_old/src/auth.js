import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';

// Internet Identity URL
const II_URL = process.env.DFX_NETWORK === 'ic' 
  ? 'https://identity.ic0.app'
  : `http://localhost:4943/?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}`;

export async function createAuthClient() {
  return await AuthClient.create({
    idleOptions: {
      disableIdle: true
    }
  });
}

export async function handleAuthenticated(authClient) {
  const identity = authClient.getIdentity();
  const agent = new HttpAgent({ identity });
  
  if (process.env.DFX_NETWORK !== 'ic') {
    await agent.fetchRootKey();
  }
  
  return agent;
}

export async function login() {
  const authClient = await createAuthClient();
  
  return new Promise((resolve) => {
    authClient.login({
      identityProvider: II_URL,
      onSuccess: async () => {
        const agent = await handleAuthenticated(authClient);
        resolve({ agent, authClient });
      },
      onError: (error) => {
        console.error('Login failed:', error);
        resolve(null);
      }
    });
  });
}

export async function logout(authClient) {
  await authClient.logout();
  window.location.reload();
}