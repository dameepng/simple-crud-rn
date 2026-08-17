/**
 * Auth Service
 * PRD Checklist FASE 2 & SEC-6:
 * - Handles authentication API requests using the centralized apiClient
 * - Reuses apiClient instance without creating new axios instances (DRY)
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
    const response = await apiClient.post<ApiResponse<AuthResponse> | AuthResponse>(
      '/auth/login',
      credentials
    );
    return extractData(response.data);
  },

  /**
   * Fetch current user profile using current token
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User> | User>('/auth/me');
    return extractData(response.data);
  },

  /**
   * Invalidate session on server (optional best-effort)
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Best-effort logout: ignore server network failure during logout
    }
  },
};

export default authService;
