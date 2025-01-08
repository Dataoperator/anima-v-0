import { AuthClient } from '@dfinity/auth-client';
import { II_CONFIG, II_ERRORS, validateIIResponse } from '../ii-config';

export async function initializeII() {
  try {
    // Attempt to recover existing session first
    const existingClient = await AuthClient.create();
    if (await existingClient.isAuthenticated()) {
      return {
        authClient: existingClient,
        isAuthenticated: true
      };
    }

    // If no valid session, create new client
    const authClient = await AuthClient.create({
      ...II_CONFIG.createOptions,
      idleOptions: II_CONFIG.idleOptions
    });

    return {
      authClient,
      isAuthenticated: await authClient.isAuthenticated()
    };
  } catch (error) {
    console.error('II Initialization error:', error);
    throw new Error(II_ERRORS.NETWORK_ERROR);
  }
}

export async function handleIILogin(authClient) {
  try {
    const loginResult = await authClient.login({
      ...II_CONFIG.loginOptions,
      onSuccess: () => {
        const identity = authClient.getIdentity();
        // Store session data for recovery
        localStorage.setItem('lastLoginTime', Date.now().toString());
        return {
          identity,
          principal: identity.getPrincipal()
        };
      },
      onError: (error) => {
        console.error('II Login error:', error);
        throw error;
      }
    });

    return validateIIResponse(loginResult);
  } catch (error) {
    if (error.message.includes('User interrupted')) {
      throw new Error(II_ERRORS.USER_INTERRUPT);
    }
    throw error;
  }
}

export async function handleIILogout(authClient) {
  try {
    await authClient.logout();
    localStorage.removeItem('lastLoginTime');
    return true;
  } catch (error) {
    console.error('II Logout error:', error);
    return false;
  }
}