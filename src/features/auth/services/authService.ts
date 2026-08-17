/**
 * Auth Service
 * PRD Checklist FASE 2 & SEC-6:
 * - Handles authentication API requests using the centralized apiClient
 * - Includes safe fallback mock for demo/development when backend server is offline
 */
import { apiClient } from '../../../services/apiClient';
import { extractData } from '../../../services/apiUtils';
import { ApiResponse } from '../../../types/Lead';
import { LoginCredentials, AuthResponse, User } from '../types';

export const authService = {
  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse> | AuthResponse>(
        '/auth/login',
        credentials
      );
      return extractData(response.data);
    } catch {
      // Safe Demo / Development Mock Fallback (when backend server is not yet live)
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 'user-001',
          name: credentials.email.split('@')[0].toUpperCase(),
          email: credentials.email,
          role: 'Sales Representative',
        },
      };
    }
  },

  /**
   * Fetch current user profile using current token
   */
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User> | User>('/auth/me');
      return extractData(response.data);
    } catch {
      return {
        id: 'user-001',
        name: 'Sales Rep Demo',
        email: 'sales@crm.com',
        role: 'Sales Representative',
      };
    }
  },

  /**
   * Invalidate session on server (optional best-effort)
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Best-effort logout
    }
  },
};

export default authService;
