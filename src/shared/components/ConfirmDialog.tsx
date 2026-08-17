/**
 * Reusable Confirmation Dialog Component
 * PRD Checklist 5.1 & FR-13:
 * - Generic confirmation dialog modal (reusable for delete, discard, or other confirmations)
 * - Zero hardcoded text: all titles, messages, and action button labels passed via props
 */
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { Button, ButtonVariant } from './Button';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: ButtonVariant;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  testID?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
  isLoading = false,
  testID = 'confirm-dialog',
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={!isLoading ? onCancel : undefined}
      testID={testID}
    >
      <TouchableWithoutFeedback onPress={!isLoading ? onCancel : undefined}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialogContainer}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>

              <View style={styles.buttonRow}>
                <Button
                  title={cancelText}
                  variant="secondary"
                  onPress={onCancel}
                  disabled={isLoading}
                  style={styles.cancelButton}
                  textStyle={styles.cancelButtonText}
                  testID={`${testID}-cancel-button`}
                />
                <Button
                  title={confirmText}
                  variant={confirmVariant}
                  onPress={onConfirm}
                  isLoading={isLoading}
                  disabled={isLoading}
                  style={styles.confirmButton}
                  testID={`${testID}-confirm-button`}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialogContainer: {
    width: Math.min(width - 48, 380),
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 44,
  },
  cancelButtonText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    height: 44,
  },
});

export default ConfirmDialog;
