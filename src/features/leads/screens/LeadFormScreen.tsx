/**
 * Lead Form Screen
 * PRD Checklist 4.3, 4.4 & FR-11, FR-12:
 * - Screen wrapper invoking reusable LeadForm component
 * - Dispatches createLead / updateLead to leadsService based on mode
 * - Provides Toast feedback for success & failure states
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LeadForm } from '../components/LeadForm';
import { leadsService } from '../services/leadsService';
import { Toast, ToastType } from '../../../shared/components/Toast';
import { Lead, CreateLeadDTO } from '../../../types/Lead';

export interface LeadFormScreenProps {
  mode: 'create' | 'edit';
  lead?: Lead;
  onSuccess?: () => void;
  onBack: () => void;
}

export const LeadFormScreen: React.FC<LeadFormScreenProps> = ({
  mode,
  lead,
  onSuccess,
  onBack,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (formData: CreateLeadDTO) => {
    setIsSubmitting(true);
    hideToast();

    try {
      if (mode === 'create') {
        await leadsService.createLead(formData);
        showToast('Lead baru berhasil ditambahkan!', 'success');
      } else if (mode === 'edit' && lead?.id) {
        await leadsService.updateLead(lead.id, formData);
        showToast('Data lead berhasil diperbarui!', 'success');
      }

      // Allow toast to be visible briefly before navigating back
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          onBack();
        }
      }, 1000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan data lead. Pastikan koneksi internet aktif.';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          disabled={isSubmitting}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          testID="button-header-back"
        >
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === 'create' ? 'Tambah Lead' : 'Edit Lead'}
        </Text>
        <View style={styles.placeholderRight} />
      </View>

      {/* Reusable Form */}
      <LeadForm
        mode={mode}
        initialData={lead}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        onCancel={onBack}
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
    paddingVertical: 6,
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563EB',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  placeholderRight: {
    width: 60,
  },
});

export default LeadFormScreen;
