/**
 * Secure Storage Service
 * PRD Checklist 1.3 & SEC-1: Secure storage wrapper for auth token using react-native-keychain.
 * NOTE: AsyncStorage is strictly forbidden for sensitive tokens.
 */
import * as Keychain from 'react-native-keychain';

const AUTH_SERVICE = 'com.crm.app.auth_token';
const AUTH_USERNAME = 'auth_token_user';

export const secureStorage = {
  /**
   * Save authentication token securely into Keychain/Keystore
   * @param token JWT or Auth token string
   */
  async setToken(token: string): Promise<boolean> {
    try {
      const result = await Keychain.setGenericPassword(AUTH_USERNAME, token, {
        service: AUTH_SERVICE,
        accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
        securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
      });
      return result !== false;
    } catch {
      return false;
    }
  },

  /**
   * Retrieve authentication token securely from Keychain/Keystore
   * @returns Token string or null if not found/error
   */
  async getToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: AUTH_SERVICE,
      });

      if (credentials && credentials.password) {
        return credentials.password;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Remove authentication token from Keychain/Keystore (e.g. upon logout or 401)
   */
  async removeToken(): Promise<boolean> {
    try {
      return await Keychain.resetGenericPassword({
        service: AUTH_SERVICE,
      });
    } catch {
      return false;
    }
  },

  /**
   * Check if authentication token exists in secure storage
   */
  async hasToken(): Promise<boolean> {
    try {
      return await Keychain.hasGenericPassword({
        service: AUTH_SERVICE,
      });
    } catch {
      return false;
    }
  },
};

export default secureStorage;
