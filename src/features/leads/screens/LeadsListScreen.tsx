/**
 * Leads List Screen
 * PRD Checklist 3.4 & FR-5, FR-6, FR-7:
 * - Efficient virtualized FlatList for rendering leads
 * - Debounced search bar and status filter bar integration
 * - Pull to refresh & clear empty / error feedback states
 */
import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useLeads } from '../hooks/useLeads';
import { LeadCard } from '../components/LeadCard';
import { LeadFilterBar } from '../components/LeadFilterBar';
import { LoadingSpinner, Button } from '../../../shared/components';
import { useAuth } from '../../auth/hooks/useAuth';
import { Lead } from '../../../types/Lead';

export interface LeadsListScreenProps {
  onSelectLead?: (lead: Lead) => void;
  onAddNewLead?: () => void;
}

export const LeadsListScreen: React.FC<LeadsListScreenProps> = ({
  onSelectLead,
  onAddNewLead,
}) => {
  const { user, logout } = useAuth();
  const {
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
  } = useLeads();

  // FR-14: Automatically sync/refresh list when returning from detail/create/edit screen
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Compute status counts for filter chips
  const statusCounts = useMemo(() => {
    const counts = {
      Semua: rawLeads.length,
      Baru: 0,
      Diproses: 0,
      Closed: 0,
    };
    rawLeads.forEach((lead) => {
      if (lead.status in counts) {
        counts[lead.status]++;
      }
    });
    return counts;
  }, [rawLeads]);

  const renderHeader = () => (
    <View style={styles.topHeader}>
      <View style={styles.userSection}>
        <View>
          <Text style={styles.screenTitle}>Daftar Leads</Text>
          <Text style={styles.userSubtitle}>
            {user?.name ? `${user.name} (${user.email})` : user?.email || 'Sales CRM'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={logout}
          style={styles.logoutIconButton}
          accessibilityRole="button"
          accessibilityLabel="Logout"
        >
          <Text style={styles.logoutIconText}>Keluar</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchBarContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama, email, telepon..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          autoCapitalize="none"
          autoCorrect={false}
          testID="input-search-leads"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearSearchButton}
          >
            <Text style={styles.clearSearchText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Status Filter Chips */}
      <LeadFilterBar
        selectedStatus={filterStatus}
        onSelectStatus={setFilterStatus}
        statusCounts={statusCounts}
      />

      {/* Result Count Banner */}
      <View style={styles.resultBanner}>
        <Text style={styles.resultText}>
          Menampilkan <Text style={styles.resultCountBold}>{leads.length}</Text> leads
          {filterStatus !== 'Semua' ? ` (${filterStatus})` : ''}
          {debouncedSearchQuery ? ` untuk "${debouncedSearchQuery}"` : ''}
        </Text>
      </View>
    </View>
  );

  const renderEmptyComponent = () => {
    if (isLoading) return null;

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.emptyTitle}>Terjadi Kesalahan</Text>
          <Text style={styles.emptyMessage}>{error}</Text>
          <Button
            title="Coba Lagi"
            variant="outline"
            onPress={refetch}
            style={styles.retryButton}
          />
        </View>
      );
    }

    const hasActiveFilter = filterStatus !== 'Semua' || Boolean(debouncedSearchQuery);

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>{hasActiveFilter ? '🔎' : '📋'}</Text>
        <Text style={styles.emptyTitle}>
          {hasActiveFilter ? 'Tidak Ada Hasil' : 'Belum Ada Leads'}
        </Text>
        <Text style={styles.emptyMessage}>
          {hasActiveFilter
            ? 'Tidak ditemukan lead yang cocok dengan kriteria pencarian atau filter Anda.'
            : 'Mulai rekam prospek baru sekarang untuk mengelola data penjualan Anda.'}
        </Text>
        {hasActiveFilter ? (
          <Button
            title="Reset Filter & Pencarian"
            variant="secondary"
            onPress={() => {
              setSearchQuery('');
              setFilterStatus('Semua');
            }}
            style={styles.retryButton}
          />
        ) : onAddNewLead ? (
          <Button
            title="+ Tambah Lead Baru"
            onPress={onAddNewLead}
            style={styles.retryButton}
          />
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading && !isRefreshing && rawLeads.length === 0 ? (
        <LoadingSpinner message="Memuat data leads..." fullScreen />
      ) : (
        <FlatList
          data={leads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <LeadCard lead={item} onPress={onSelectLead} />
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refetch}
              colors={['#2563EB']}
              tintColor="#2563EB"
            />
          }
          // Performance optimization properties for large lists (FR-5 / Checklist 3.4)
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}

      {/* Floating Action Button (FAB) to Add Lead (FR-9 / Checklist 4.3) */}
      {onAddNewLead && !isLoading ? (
        <TouchableOpacity
          style={styles.fab}
          onPress={onAddNewLead}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Tambah Lead Baru"
          testID="button-fab-add-lead"
        >
          <Text style={styles.fabIcon}>+</Text>
          <Text style={styles.fabText}>Tambah Lead</Text>
        </TouchableOpacity>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  topHeader: {
    paddingTop: 8,
    marginBottom: 8,
  },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  userSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  logoutIconButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  logoutIconText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 8,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 8,
  },
  clearSearchButton: {
    padding: 4,
  },
  clearSearchText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '700',
  },
  resultBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  resultText: {
    fontSize: 12,
    color: '#6B7280',
  },
  resultCountBold: {
    fontWeight: '700',
    color: '#111827',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  retryButton: {
    minWidth: 160,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 28,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 6,
    lineHeight: 22,
  },
  fabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default LeadsListScreen;
