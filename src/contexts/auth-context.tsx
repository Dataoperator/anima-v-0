import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { ErrorTracker } from '../error/quantum_error';  // Updated path
import { icManager } from '../ic-init';  // Updated path

interface AuthContextType {
  authClient: AuthClient | null;
  isAuthenticated: boolean;
  identity: any;
  principal: Principal | null;
  isInitializing: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const II_URL = process.env.DFX_NETWORK === 'ic' 
  ? 'https://identity.ic0.app'
  : process.env.INTERNET_IDENTITY_URL;

const defaultOptions = {
  loginOptions: {
    identityProvider: II_URL,
    derivationOrigin: process.env.DFX_NETWORK === 'ic' 
      ? 'https://identity.ic0.app'
      : undefined,
    maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000_000_000)
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const errorTracker = ErrorTracker.getInstance();

  useEffect(() => {
    console.log('🔄 Starting auth initialization sequence...');
    const initAuth = async () => {
      try {
        console.log('📡 Waiting for IC Manager initialization...');
        
        // Wait for IC Manager with timeout
        const maxWaitTime = 10000; // 10 seconds
        const startTime = Date.now();
        
        while (!icManager.isInitialized() && Date.now() - startTime < maxWaitTime) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (!icManager.isInitialized()) {
          throw new Error('IC Manager initialization timeout');
        }

        console.log('✅ IC Manager initialized, getting auth client...');
        const authClient = icManager.getAuthClient();
        if (!authClient) {
          throw new Error('Auth client not initialized');
        }

        console.log('🔒 Checking authentication status...');
        const isAuth = await authClient.isAuthenticated();
        console.log(`🔑 Authentication status: ${isAuth}`);
        setIsAuthenticated(isAuth);
        
        if (isAuth) {
          console.log('👤 Getting identity...');
          const currentIdentity = icManager.getIdentity();
          if (currentIdentity) {
            console.log('✨ Setting identity and principal...');
            setIdentity(currentIdentity);
            setPrincipal(currentIdentity.getPrincipal());
          }
        }

        console.log('🎉 Auth initialization complete!');

      } catch (error) {
        console.error('❌ Auth initialization failed:', error);
        await errorTracker.trackError({
          errorType: 'AUTH_INIT',
          severity: 'HIGH',
          context: 'Authentication Initialization',
          error: error instanceof Error ? error : new Error('Auth initialization failed')
        });
      } finally {
        setIsInitializing(false);
        console.log('🏁 Auth initialization sequence finished');
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    try {
      console.log('🔄 Starting login process...');
      setIsInitializing(true);
      
      const authClient = icManager.getAuthClient();
      if (!authClient) {
        throw new Error('Auth client not initialized');
      }

      await authClient.login({
        ...defaultOptions.loginOptions,
        onSuccess: async () => {
          console.log('✅ Login successful, updating state...');
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal();
          setIsAuthenticated(true);
          setIdentity(identity);
          setPrincipal(principal);
          console.log('🎉 Login complete!');
        }
      });
    } catch (error) {
      console.error('❌ Login failed:', error);
      await errorTracker.trackError({
        errorType: 'AUTH_LOGIN',
        severity: 'HIGH',
        context: 'Login Attempt',
        error: error instanceof Error ? error : new Error('Login failed')
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🔄 Starting logout process...');
      const authClient = icManager.getAuthClient();
      if (authClient) {
        await authClient.logout();
        setIsAuthenticated(false);
        setIdentity(null);
        setPrincipal(null);
        console.log('🎉 Logout complete!');
      }
    } catch (error) {
      console.error('❌ Logout failed:', error);
      await errorTracker.trackError({
        errorType: 'AUTH_LOGOUT',
        severity: 'MEDIUM',
        context: 'Logout Attempt',
        error: error instanceof Error ? error : new Error('Logout failed')
      });
    }
  };

  const contextValue = {
    authClient: icManager.getAuthClient(),
    isAuthenticated,
    identity,
    principal,
    isInitializing,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
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