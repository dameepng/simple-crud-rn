/**
 * Reusable Lead Form Component
 * PRD Checklist 4.1, 4.2 & SEC-5, FR-9, FR-10, FR-11:
 * - SINGLE reusable component for BOTH create and edit modes (DRY principle)
 * - Differentiated via `mode: 'create' | 'edit'` and `initialData` props
 * - Client-side validation for nama, email, and telepon
 * - Visual loading feedback and disabled states during form submission
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Input, Button } from '../../../shared/components';
import { Lead, LeadStatus, LeadSource, CreateLeadDTO } from '../../../types/Lead';

export interface LeadFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<Lead>;
  onSubmit: (formData: CreateLeadDTO) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

interface FormErrors {
  nama?: string;
  email?: string;
  telepon?: string;
  general?: string;
}

const STATUS_OPTIONS: LeadStatus[] = ['Baru', 'Diproses', 'Closed'];
const SOURCE_OPTIONS: LeadSource[] = [
  'Website',
  'Referral',
  'Social Media',
  'Iklan',
  'Event',
  'Walk-In',
  'Lainnya',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{8,20}$/;

export const LeadForm: React.FC<LeadFormProps> = ({
  mode,
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [nama, setNama] = useState(initialData?.nama || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [telepon, setTelepon] = useState(initialData?.telepon || '');
  const [status, setStatus] = useState<LeadStatus>(initialData?.status || 'Baru');
  const [sumber, setSumber] = useState<LeadSource>(initialData?.sumber || 'Website');
  const [catatan, setCatatan] = useState(initialData?.catatan || '');
  const [errors, setErrors] = useState<FormErrors>({});

  // Sync state if initialData changes (e.g. after fetch)
  useEffect(() => {
    if (initialData) {
      if (initialData.nama !== undefined) setNama(initialData.nama);
      if (initialData.email !== undefined) setEmail(initialData.email);
      if (initialData.telepon !== undefined) setTelepon(initialData.telepon);
      if (initialData.status !== undefined) setStatus(initialData.status);
      if (initialData.sumber !== undefined) setSumber(initialData.sumber);
      if (initialData.catatan !== undefined) setCatatan(initialData.catatan);
    }
  }, [initialData]);

  // SEC-5: Client-side validation logic
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const trimmedNama = nama.trim();
    if (!trimmedNama) {
      newErrors.nama = 'Nama lead wajib diisi';
    } else if (trimmedNama.length < 2) {
      newErrors.nama = 'Nama lead minimal 2 karakter';
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email wajib diisi';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = 'Format email tidak valid (contoh: prospek@perusahaan.com)';
    }

    const trimmedPhone = telepon.trim();
    if (!trimmedPhone) {
      newErrors.telepon = 'Nomor telepon wajib diisi';
    } else if (!PHONE_REGEX.test(trimmedPhone)) {
      newErrors.telepon = 'Nomor telepon hanya boleh angka dan minimal 8 digit';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isLoading) {
      return;
    }

    const payload: CreateLeadDTO = {
      nama: nama.trim(),
      email: email.trim().toLowerCase(),
      telepon: telepon.trim(),
      status,
      sumber,
      catatan: catatan.trim() || undefined,
    };

    await onSubmit(payload);
  };

  const submitButtonTitle =
    mode === 'create' ? 'Tambah Lead Baru' : 'Simpan Perubahan';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      style={styles.container}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Mode Indicator Banner */}
          <View style={styles.modeHeader}>
            <Text style={styles.modeTitle}>
              {mode === 'create' ? 'Data Prospek Baru' : 'Edit Data Prospek'}
            </Text>
            <Text style={styles.modeSubtitle}>
              {mode === 'create'
                ? 'Isi formulir berikut untuk menambahkan lead ke CRM'
                : `Memperbarui informasi prospek: ${initialData?.nama || ''}`}
            </Text>
          </View>

          {/* Nama Field (Required) */}
          <Input
            label="Nama Lengkap"
            placeholder="Contoh: Budi Santoso"
            value={nama}
            onChangeText={(text) => {
              setNama(text);
              if (errors.nama) setErrors((prev) => ({ ...prev, nama: undefined }));
            }}
            required
            error={errors.nama}
            editable={!isLoading}
            autoCapitalize="words"
            testID="input-lead-nama"
          />

          {/* Email Field (Required, SEC-5) */}
          <Input
            label="Email"
            placeholder="budi@perusahaan.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            required
            error={errors.email}
            editable={!isLoading}
            testID="input-lead-email"
          />

          {/* Telepon Field (Required, SEC-5) */}
          <Input
            label="Nomor Telepon"
            placeholder="081234567890"
            value={telepon}
            onChangeText={(text) => {
              setTelepon(text);
              if (errors.telepon) setErrors((prev) => ({ ...prev, telepon: undefined }));
            }}
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 150, animated: true });
              }, 150);
            }}
            keyboardType="phone-pad"
            required
            error={errors.telepon}
            editable={!isLoading}
            testID="input-lead-telepon"
          />

          {/* Status Selection */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>
              Status Lead <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View style={styles.statusRow}>
              {STATUS_OPTIONS.map((opt) => {
                const isSelected = status === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.statusChip,
                      isSelected && styles.statusChipSelected,
                      opt === 'Baru' && isSelected && styles.chipBaruSelected,
                      opt === 'Diproses' && isSelected && styles.chipDiprosesSelected,
                      opt === 'Closed' && isSelected && styles.chipClosedSelected,
                    ]}
                    onPress={() => setStatus(opt)}
                    disabled={isLoading}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    testID={`status-option-${opt}`}
                  >
                    <Text
                      style={[
                        styles.statusChipText,
                        isSelected && styles.statusChipTextSelected,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Sumber Selection */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>Sumber Prospek</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sourcesScroll}
            >
              {SOURCE_OPTIONS.map((opt) => {
                const isSelected = sumber === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.sourceChip,
                      isSelected && styles.sourceChipSelected,
                    ]}
                    onPress={() => setSumber(opt)}
                    disabled={isLoading}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    testID={`source-option-${opt}`}
                  >
                    <Text
                      style={[
                        styles.sourceChipText,
                        isSelected && styles.sourceChipTextSelected,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Catatan Field (Optional) with auto-scroll to end on focus */}
          <Input
            label="Catatan / Keterangan"
            placeholder="Tambahkan informasi penting mengenai prospek..."
            value={catatan}
            onChangeText={setCatatan}
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }, 150);
            }}
            multiline
            numberOfLines={4}
            style={styles.notesInput}
            editable={!isLoading}
            testID="input-lead-catatan"
          />

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <Button
              title={submitButtonTitle}
              onPress={handleSubmit}
              isLoading={isLoading}
              disabled={isLoading}
              testID="button-submit-lead-form"
            />
            {onCancel ? (
              <Button
                title="Batal"
                variant="outline"
                onPress={onCancel}
                disabled={isLoading}
                style={styles.cancelButton}
                testID="button-cancel-lead-form"
              />
            ) : null}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  modeHeader: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  modeSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  requiredStar: {
    color: '#EF4444',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusChipSelected: {
    borderColor: 'transparent',
  },
  chipBaruSelected: {
    backgroundColor: '#2563EB',
  },
  chipDiprosesSelected: {
    backgroundColor: '#D97706',
  },
  chipClosedSelected: {
    backgroundColor: '#059669',
  },
  statusChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  statusChipTextSelected: {
    color: '#FFFFFF',
  },
  sourcesScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  sourceChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sourceChipSelected: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  sourceChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  sourceChipTextSelected: {
    color: '#FFFFFF',
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonSection: {
    marginTop: 12,
    gap: 10,
  },
  cancelButton: {
    marginTop: 2,
  },
});

export default LeadForm;
