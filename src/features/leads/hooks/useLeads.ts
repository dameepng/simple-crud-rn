/**
 * Custom Hook: useLeads
 * PRD Checklist 3.1 & 3.2:
 * - Wraps leadsService to fetch, search, and filter leads
 * - Debounces search input via useDebounce to prevent unnecessary computations & requests
 * - Uses useMemo for optimized client-side filtering by status and debounced search query
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { leadsService } from '../services/leadsService';
import { Lead, LeadStatus } from '../../../types/Lead';
import { useDebounce } from '../../../shared/hooks/useDebounce';

export type StatusFilterOption = LeadStatus | 'Semua';

export interface UseLeadsReturn {
  leads: Lead[];
  rawLeads: Lead[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: StatusFilterOption;
  setFilterStatus: (status: StatusFilterOption) => void;
  refetch: () => Promise<void>;
  debouncedSearchQuery: string;
}

export const useLeads = (): UseLeadsReturn => {
  const [rawLeads, setRawLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<StatusFilterOption>('Semua');

  // Debounce search query by 400ms (Checklist 3.2)
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  // Fetch leads from leadsService (Checklist 1.4 & 3.1)
  const fetchLeads = useCallback(async (isPullToRefresh = false) => {
    if (isPullToRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await leadsService.getLeads();
      setRawLeads(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Gagal memuat data leads. Silakan coba lagi.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Memoized search and status filtering (Checklist 3.1 Review)
  const leads = useMemo(() => {
    let result = rawLeads;

    // 1. Status Filter
    if (filterStatus !== 'Semua') {
      result = result.filter((lead) => lead.status === filterStatus);
    }

    // 2. Debounced Search Query Filter (Nama, Email, Telepon, Sumber, Catatan)
    const query = debouncedSearchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((lead) => {
        const matchName = lead.nama?.toLowerCase().includes(query);
        const matchEmail = lead.email?.toLowerCase().includes(query);
        const matchPhone = lead.telepon?.toLowerCase().includes(query);
        const matchSource = lead.sumber?.toLowerCase().includes(query);
        const matchNotes = lead.catatan?.toLowerCase().includes(query);

        return (
          Boolean(matchName) ||
          Boolean(matchEmail) ||
          Boolean(matchPhone) ||
          Boolean(matchSource) ||
          Boolean(matchNotes)
        );
      });
    }

    return result;
  }, [rawLeads, debouncedSearchQuery, filterStatus]);

  const refetch = useCallback(async () => {
    await fetchLeads(true);
  }, [fetchLeads]);

  return {
    leads,
    rawLeads,
    isLoading,
    isRefreshing,
    error,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    refetch,
    debouncedSearchQuery,
  };
};

export default useLeads;
