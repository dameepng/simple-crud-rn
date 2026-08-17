/**
 * API Response Utility Helpers
 * PRD Section 6 (DRY Principle): Shared response payload extractor
 */
import { ApiResponse } from '../types/Lead';

/**
 * Safely unwrap standard API response envelope ({ success: true, data: T }) or raw payload
 * @param responsePayload The Axios response data
 * @returns The inner unwrapped entity/data
 */
export function extractData<T>(responsePayload: ApiResponse<T> | T): T {
  if (
    responsePayload &&
    typeof responsePayload === 'object' &&
    'data' in responsePayload &&
    'success' in responsePayload
  ) {
    return (responsePayload as ApiResponse<T>).data;
  }
  return responsePayload as T;
}
