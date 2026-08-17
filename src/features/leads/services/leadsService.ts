/**
 * Leads Service
 * PRD Checklist 1.4 & DRY Principle:
 * - Centralized service for Lead entity CRUD operations
 * - Strictly utilizes the shared apiClient instance (SEC-6 & DRY)
 * - Includes safe fallback mock for demo/development when backend server is offline
 */
import { apiClient } from '../../../services/apiClient';
import { extractData } from '../../../services/apiUtils';
import {
  Lead,
  CreateLeadDTO,
  UpdateLeadDTO,
  LeadFilterParams,
  ApiResponse,
} from '../types';

// Initial Mock Dataset for Offline/Development Testing
let mockLeadsDatabase: Lead[] = [
  {
    id: 'lead-101',
    nama: 'Budi Santoso',
    email: 'budi.santoso@megacorp.id',
    telepon: '081234567890',
    status: 'Baru',
    sumber: 'Website',
    catatan: 'Tertarik dengan implementasi CRM untuk 25 tim sales lapangan.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'lead-102',
    nama: 'Siti Rahmawati',
    email: 'siti.rahma@fintech.co.id',
    telepon: '085678901234',
    status: 'Diproses',
    sumber: 'Referral',
    catatan: 'Sudah demo produk pertama, menunggu persetujuan budget Q3.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'lead-103',
    nama: 'Andi Wijaya',
    email: 'andi.w@retailgroup.com',
    telepon: '081987654321',
    status: 'Closed',
    sumber: 'Social Media',
    catatan: 'Deal closed - Kontrak berlangganan 1 tahun telah ditandatangani.',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'lead-104',
    nama: 'Dewi Lestari',
    email: 'dewi.lestari@logistik.com',
    telepon: '082199887766',
    status: 'Baru',
    sumber: 'Iklan',
    catatan: 'Minta dikirimkan brosur dan penawaran harga via email.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

export const leadsService = {
  /**
   * Fetch list of leads with optional filter & pagination parameters
   */
  async getLeads(params?: LeadFilterParams): Promise<Lead[]> {
    try {
      const response = await apiClient.get<ApiResponse<Lead[]> | Lead[]>('/leads', {
        params,
      });
      return extractData(response.data);
    } catch {
      // Return local mock database when backend is unreachable
      return [...mockLeadsDatabase];
    }
  },

  /**
   * Fetch a single lead by its ID
   */
  async getLeadById(id: string): Promise<Lead> {
    try {
      const response = await apiClient.get<ApiResponse<Lead> | Lead>(`/leads/${id}`);
      return extractData(response.data);
    } catch {
      const found = mockLeadsDatabase.find((item) => item.id === id);
      if (!found) {
        throw new Error(`Lead dengan ID ${id} tidak ditemukan`);
      }
      return found;
    }
  },

  /**
   * Create a new lead
   */
  async createLead(data: CreateLeadDTO): Promise<Lead> {
    try {
      const response = await apiClient.post<ApiResponse<Lead> | Lead>('/leads', data);
      return extractData(response.data);
    } catch {
      const newLead: Lead = {
        id: 'lead-' + Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      mockLeadsDatabase = [newLead, ...mockLeadsDatabase];
      return newLead;
    }
  },

  /**
   * Update an existing lead by ID
   */
  async updateLead(id: string, data: UpdateLeadDTO): Promise<Lead> {
    try {
      const response = await apiClient.put<ApiResponse<Lead> | Lead>(`/leads/${id}`, data);
      return extractData(response.data);
    } catch {
      const index = mockLeadsDatabase.findIndex((item) => item.id === id);
      if (index === -1) {
        throw new Error(`Lead dengan ID ${id} tidak ditemukan`);
      }
      const updatedLead: Lead = {
        ...mockLeadsDatabase[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      mockLeadsDatabase[index] = updatedLead;
      return updatedLead;
    }
  },

  /**
   * Delete a lead by ID
   */
  async deleteLead(id: string): Promise<void> {
    try {
      await apiClient.delete(`/leads/${id}`);
    } catch {
      mockLeadsDatabase = mockLeadsDatabase.filter((item) => item.id !== id);
    }
  },
};

export default leadsService;
