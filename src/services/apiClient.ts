/**
 * Centralized API Client Service
 * PRD Checklist 1.2 & SEC-2, SEC-4, SEC-6, SEC-7:
 * - Single Axios instance configured with base URL from environment variables
 * - SEC-2: Enforces HTTPS connections and rejects insecure HTTP calls
 * - SEC-4: Environment variable base URL without hardcoded secrets
 * - SEC-6: Request interceptor to automatically attach Bearer token from Keychain
 * - SEC-6: Response interceptor to handle 401 Unauthorized (auto remove token & trigger logout)
 * - SEC-7: Safe error handling without logging credentials
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { secureStorage } from './secureStorage';

const DEFAULT_BASE_URL = 'https://api.crm-example.com/api/v1';
const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  DEFAULT_BASE_URL;

/**
 * Validates that an endpoint URL uses HTTPS protocol (SEC-2)
 */
function validateHttps(url?: string): void {
  if (url && url.toLowerCase().startsWith('http://')) {
    throw new Error(
      `[SEC-2 Violation] Insecure HTTP connection rejected: ${url}. Only HTTPS is permitted.`
    );
  }
}

// Ensure base URL complies with HTTPS requirement
validateHttps(BASE_URL);

/**
 * Central Axios instance for the entire application (SEC-6 / DRY)
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

/**
 * Register a callback to be executed when 401 Unauthorized is encountered
 */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

// Request Interceptor (SEC-2 & SEC-6)
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // SEC-2: Reject any non-HTTPS requests
    const resolvedUrl = config.baseURL
      ? `${config.baseURL}${config.url || ''}`
      : config.url || '';
    validateHttps(resolvedUrl);

    // SEC-6: Auto-attach auth token from Keychain
    try {
      const token = await secureStorage.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Safe fallback if secure storage is unavailable
    }

    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// Response Interceptor (SEC-6)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Auto-clear invalid/expired token from secure storage
      await secureStorage.removeToken();

      // Notify auth listeners (e.g., redirect to login screen)
      if (unauthorizedHandler) {
        unauthorizedHandler();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
