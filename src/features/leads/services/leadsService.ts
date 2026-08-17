/**
 * Leads Service
 * PRD Checklist 1.4 & DRY Principle:
 * - Centralized service for Lead entity CRUD operations
 * - Strictly utilizes the shared apiClient instance (SEC-6 & DRY)
 * - Implements getLeads, getLeadById, createLead, updateLead, deleteLead
 */
import { apiClient } from '../../../services/apiClient';
import {
  Lead,
  CreateLeadDTO,
  UpdateLeadDTO,
  LeadFilterParams,
  ApiResponse,
} from '../types';

/**
 * Helper to unwrap standard API response envelope or raw payload
 */
function extractData<T>(responsePayload: ApiResponse<T> | T): T {
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

export const leadsService = {
  /**
   * Fetch list of leads with optional filter & pagination parameters
   */
  async getLeads(params?: LeadFilterParams): Promise<Lead[]> {
    const response = await apiClient.get<ApiResponse<Lead[]> | Lead[]>('/leads', {
      params,
    });
    return extractData(response.data);
  },

  /**
   * Fetch a single lead by its ID
   */
  async getLeadById(id: string): Promise<Lead> {
    const response = await apiClient.get<ApiResponse<Lead> | Lead>(`/leads/${id}`);
    return extractData(response.data);
  },

  /**
   * Create a new lead
   */
  async createLead(data: CreateLeadDTO): Promise<Lead> {
    const response = await apiClient.post<ApiResponse<Lead> | Lead>('/leads', data);
    return extractData(response.data);
  },

  /**
   * Update an existing lead by ID
   */
  async updateLead(id: string, data: UpdateLeadDTO): Promise<Lead> {
    const response = await apiClient.put<ApiResponse<Lead> | Lead>(`/leads/${id}`, data);
    return extractData(response.data);
  },

  /**
   * Delete a lead by ID
   */
  async deleteLead(id: string): Promise<void> {
    await apiClient.delete(`/leads/${id}`);
  },
};

export default leadsService;
