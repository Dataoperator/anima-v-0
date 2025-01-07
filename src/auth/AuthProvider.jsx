import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { II_URL, II_CONFIG } from '../ii-config';

const AuthContext = createContext();

const defaultOptions = {
  createOptions: {
    idleOptions: {
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider: II_URL,
    // Using front-end canister URL as derivation origin
    derivationOrigin: process.env.DFX_NETWORK === 'ic' 
      ? 'https://identity.ic0.app'
      : undefined,
    maxTimeToLive: II_CONFIG.maxTimeToLive,
  },
};

export function AuthProvider({ children }) {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  async function initAuth() {
    try {
      const client = await AuthClient.create({
        ...defaultOptions.createOptions,
        // Important: Do not set idleOptions here to avoid conflicts
      });
      
      const isAuthenticated = await client.isAuthenticated();
      
      setAuthClient(client);
      setIsAuthenticated(isAuthenticated);
      
      if (isAuthenticated) {
        const identity = client.getIdentity();
        const principal = identity.getPrincipal();
        setIdentity(identity);
        setPrincipal(principal);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setIsInitializing(false);
    }
  }

  async function login() {
    try {
      await authClient?.login({
        ...defaultOptions.loginOptions,
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal();
          setIsAuthenticated(true);
          setIdentity(identity);
          setPrincipal(principal);
        },
        onError: (error) => {
          console.error('Login error:', error);
          // Reset auth state on error
          setIsAuthenticated(false);
          setIdentity(null);
          setPrincipal(null);
        }
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  async function logout() {
    try {
      await authClient?.logout();
      setIsAuthenticated(false);
      setIdentity(null);
      setPrincipal(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  const value = {
    authClient,
    isAuthenticated,
    identity,
    principal,
    login,
    logout,
    isInitializing,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}