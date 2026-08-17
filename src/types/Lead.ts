/**
 * Lead Types Definition
 * PRD Checklist 1.1: Interface Lead & Related DTOs
 */

export type LeadStatus = 'Baru' | 'Diproses' | 'Closed';

export type LeadSource =
  | 'Website'
  | 'Referral'
  | 'Social Media'
  | 'Iklan'
  | 'Event'
  | 'Walk-In'
  | 'Lainnya'
  | (string & {});

export interface Lead {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  status: LeadStatus;
  sumber: LeadSource;
  catatan?: string;
  createdAt: string;
  updatedAt?: string;
}

export type CreateLeadDTO = Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateLeadDTO = Partial<CreateLeadDTO>;

export interface LeadFilterParams {
  search?: string;
  status?: LeadStatus | 'Semua';
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
  };
}
