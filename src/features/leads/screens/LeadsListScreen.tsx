/**
 * Leads List Screen
 * PRD Checklist 3.4 & FR-5, FR-6, FR-7:
 * - Efficient virtualized FlatList for rendering leads
 * - Debounced search bar and status filter bar integration
 * - Pull to refresh & clear empty / error feedback states
 * - Modern Lucide icons
 */
import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  Search,
  X,
  LogOut,
  Plus,
  AlertTriangle,
  SearchX,
  Users,
} from 'lucide-react-native';
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

  // FR-14 / Checklist 5.3: Automatically refresh list when screen regains focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Status counts for badge chips
  const statusCounts = useMemo(() => {
    const counts = {
      Semua: rawLeads.length,
      Baru: 0,
      Diproses: 0,
      Closed: 0,
    };
    rawLeads.forEach((item) => {
      if (item.status === 'Baru') counts.Baru += 1;
      else if (item.status === 'Diproses') counts.Diproses += 1;
      else if (item.status === 'Closed') counts.Closed += 1;
    });
    return counts;
  }, [rawLeads]);

  const renderHeader = () => (
    <View style={styles.headerWrapper}>
      {/* Top App Bar with User Profile & Logout */}
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <Text style={styles.greetingTitle}>Daftar Prospek (Leads)</Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user?.name ? `${user.name} (${user.email})` : user?.email || 'Sales CRM'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={logout}
          style={styles.logoutIconButton}
          accessibilityRole="button"
          accessibilityLabel="Logout"
        >
          <LogOut size={16} color="#DC2626" style={styles.logoutIcon} />
          <Text style={styles.logoutIconText}>Keluar</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchBarContainer}>
        <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama, email, telepon..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="never"
          autoCapitalize="none"
          autoCorrect={false}
          testID="input-search-leads"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearSearchButton}
          >
            <X size={16} color="#6B7280" />
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
          <View style={styles.emptyIconCircle}>
            <AlertTriangle size={36} color="#DC2626" />
          </View>
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
        <View style={styles.emptyIconCircle}>
          {hasActiveFilter ? (
            <SearchX size={36} color="#6B7280" />
          ) : (
            <Users size={36} color="#2563EB" />
          )}
        </View>
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
          <Plus size={20} color="#FFFFFF" style={styles.fabIcon} />
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
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  headerWrapper: {
    paddingTop: 8,
    marginBottom: 8,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  userEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  logoutIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutIcon: {
    marginRight: 4,
  },
  logoutIconText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 8,
  },
  clearSearchButton: {
    padding: 6,
  },
  resultBanner: {
    marginTop: 8,
    marginBottom: 4,
  },
  resultText: {
    fontSize: 13,
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
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
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
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: {
    marginRight: 6,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default LeadsListScreen;
