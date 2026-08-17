/**
 * Auth Context & Provider
 * PRD Checklist 2.1 & SEC-1, SEC-6:
 * - Central auth state management (user, token, isLoading)
 * - Persists and restores tokens strictly via Keychain/Keystore (secureStorage)
 * - Automatically registers 401 unauthorized handler to synchronize logout state
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { secureStorage } from '../../services/secureStorage';
import { setUnauthorizedHandler } from '../../services/apiClient';
import { authService } from '../../features/auth/services/authService';
import { User, LoginCredentials, AuthContextType } from '../../types/User';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronous logout state reset (SEC-1 / FR-4)
  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network errors during logout
    } finally {
      await secureStorage.removeToken();
      setToken(null);
      setUser(null);
    }
  }, []);

  // Initialize session from secureStorage on app launch (2.1)
  useEffect(() => {
    let isMounted = true;

    // Register 401 interceptor handler (SEC-6)
    setUnauthorizedHandler(() => {
      if (isMounted) {
        setToken(null);
        setUser(null);
      }
    });

    const initAuth = async () => {
      try {
        const storedToken = await secureStorage.getToken();
        if (storedToken) {
          if (isMounted) {
            setToken(storedToken);
          }
          // Attempt to fetch fresh profile with stored token
          try {
            const profile = await authService.getProfile();
            if (isMounted) {
              setUser(profile);
            }
          } catch {
            // If profile fetch fails (e.g. invalid/expired token), clean up
            await secureStorage.removeToken();
            if (isMounted) {
              setToken(null);
              setUser(null);
            }
          }
        }
      } catch {
        if (isMounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
      setUnauthorizedHandler(null);
    };
  }, []);

  // Login handler saving token via secureStorage (SEC-1)
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      // Save token in Keychain
      await secureStorage.setToken(response.token);
      setToken(response.token);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isLoading,
      login,
      logout: handleLogout,
    }),
    [user, token, isLoading, login, handleLogout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
