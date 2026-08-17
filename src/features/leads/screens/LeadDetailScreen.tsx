/**
 * Lead Detail Screen
 * PRD Checklist 5.2, 5.3 & FR-8, FR-13, FR-14:
 * - Comprehensive detail view for a single Lead entity
 * - Protected delete workflow requiring explicit user confirmation via ConfirmDialog
 * - Edit trigger and automated list synchronization upon deletion
 * - Clean, icon-only app bar back navigation
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Mail,
  Phone,
  Tag,
  Calendar,
  Clock,
  FileText,
} from 'lucide-react-native';
import { Button, ConfirmDialog, Toast, ToastType } from '../../../shared/components';
import { formatDate, getStatusBadgeStyle } from '../../../shared/utils';
import { leadsService } from '../services/leadsService';
import { Lead } from '../../../types/Lead';

export interface LeadDetailScreenProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDeleteSuccess: () => void;
  onBack: () => void;
}

export const LeadDetailScreen: React.FC<LeadDetailScreenProps> = ({
  lead,
  onEdit,
  onDeleteSuccess,
  onBack,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: ToastType;
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({
      visible: true,
      message,
      type,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  // FR-13 & FR-14: Delete with confirmation and refresh
  const handleExecuteDelete = async () => {
    setIsDeleting(true);
    try {
      await leadsService.deleteLead(lead.id);
      setShowConfirmDelete(false);
      showToast('Data lead berhasil dihapus!', 'success');

      // Trigger automatic list refresh & return to list screen (FR-14)
      setTimeout(() => {
        onDeleteSuccess();
      }, 800);
    } catch (err: unknown) {
      setShowConfirmDelete(false);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Gagal menghapus data lead. Silakan coba lagi.';
      showToast(errorMessage, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const statusStyle = getStatusBadgeStyle(lead.status);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke daftar leads"
          testID="button-detail-back"
        >
          <ArrowLeft size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Prospek</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.mainCard}>
          <View style={styles.nameSection}>
            <Text style={styles.leadName}>{lead.nama}</Text>
            <View style={[styles.badge, statusStyle.badge]}>
              <Text style={[styles.badgeText, statusStyle.text]}>
                {lead.status}
              </Text>
            </View>
          </View>
          <Text style={styles.idText}>ID: {lead.id}</Text>
        </View>

        {/* Contact Info Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Informasi Kontak</Text>

          <View style={styles.detailRow}>
            <View style={styles.labelContainer}>
              <Mail size={16} color="#6B7280" style={styles.rowIcon} />
              <Text style={styles.detailLabel}>Email</Text>
            </View>
            <Text style={styles.detailValue} selectable>
              {lead.email}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.labelContainer}>
              <Phone size={16} color="#6B7280" style={styles.rowIcon} />
              <Text style={styles.detailLabel}>Nomor Telepon</Text>
            </View>
            <Text style={styles.detailValue} selectable>
              {lead.telepon}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.labelContainer}>
              <Tag size={16} color="#6B7280" style={styles.rowIcon} />
              <Text style={styles.detailLabel}>Sumber Lead</Text>
            </View>
            <View style={styles.sourceTag}>
              <Text style={styles.sourceTagText}>{lead.sumber || '-'}</Text>
            </View>
          </View>
        </View>

        {/* Timestamps Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Riwayat</Text>

          <View style={styles.detailRow}>
            <View style={styles.labelContainer}>
              <Calendar size={16} color="#6B7280" style={styles.rowIcon} />
              <Text style={styles.detailLabel}>Tanggal Dibuat</Text>
            </View>
            <Text style={styles.detailValue}>{formatDate(lead.createdAt, true)}</Text>
          </View>

          {lead.updatedAt ? (
            <View style={styles.detailRow}>
              <View style={styles.labelContainer}>
                <Clock size={16} color="#6B7280" style={styles.rowIcon} />
                <Text style={styles.detailLabel}>Terakhir Diubah</Text>
              </View>
              <Text style={styles.detailValue}>{formatDate(lead.updatedAt, true)}</Text>
            </View>
          ) : null}
        </View>

        {/* Notes Section */}
        <View style={styles.sectionCard}>
          <View style={styles.notesHeaderRow}>
            <FileText size={16} color="#374151" style={styles.rowIcon} />
            <Text style={styles.sectionHeader}>Catatan / Keterangan</Text>
          </View>
          <Text style={styles.notesBody}>
            {lead.catatan ? lead.catatan : 'Tidak ada catatan tambahan.'}
          </Text>
        </View>

        {/* Action Buttons (Edit & Delete) */}
        <View style={styles.actionsSection}>
          <Button
            title="Edit Data Lead"
            variant="outline"
            onPress={() => onEdit(lead)}
            testID="button-detail-edit"
          />

          <Button
            title="Hapus Lead"
            variant="danger"
            onPress={() => setShowConfirmDelete(true)}
            testID="button-detail-delete"
          />
        </View>
      </ScrollView>

      {/* FR-13: Reusable Confirmation Dialog before deleting */}
      <ConfirmDialog
        visible={showConfirmDelete}
        title="Hapus Lead?"
        message={`Apakah Anda yakin ingin menghapus data prospek "${lead.nama}"? Data yang dihapus tidak dapat dipulihkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleExecuteDelete}
        onCancel={() => !isDeleting && setShowConfirmDelete(false)}
        testID="dialog-confirm-delete-lead"
      />

      {/* Feedback Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={hideToast}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nameSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  leadName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
    marginRight: 10,
  },
  idText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  notesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 140,
  },
  rowIcon: {
    marginRight: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  sourceTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sourceTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  notesBody: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    fontStyle: 'normal',
  },
  actionsSection: {
    marginTop: 8,
    gap: 12,
  },
});

export default LeadDetailScreen;
