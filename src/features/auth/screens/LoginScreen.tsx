/**
 * Login Screen
 * PRD Checklist 2.2 & SEC-5, SEC-7:
 * - Email & password credentials input with structured validation
 * - SEC-5: Validates non-empty fields & email format prior to submission
 * - SEC-7: Strictly prevents logging of sensitive data (password/token)
 * - Visual loading feedback and disabled state during network calls
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { Input, Button } from '../../../shared/components';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SEC-5: Client-side validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email wajib diisi';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = 'Format email tidak valid (contoh: user@perusahaan.com)';
    }

    if (!password) {
      newErrors.password = 'Password wajib diisi';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // SEC-7: No logging of password or credentials
      await login({
        email: email.trim().toLowerCase(),
        password,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Login gagal. Periksa kembali email dan password Anda.';
      setErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets={true}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.appName}>CRM Mobile</Text>
              <Text style={styles.title}>Selamat Datang</Text>
              <Text style={styles.subtitle}>
                Masuk ke akun Anda untuk mengelola leads dan prospek
              </Text>
            </View>

            {errors.general ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{errors.general}</Text>
              </View>
            ) : null}

            <View style={styles.formContainer}>
              <Input
                label="Email"
                placeholder="nama@perusahaan.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                keyboardType="email-address"
                autoComplete="email"
                required
                error={errors.email}
                editable={!isSubmitting}
                testID="input-email"
              />

              <Input
                label="Password"
                placeholder="Masukkan password Anda"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                isPassword
                autoComplete="password"
                required
                error={errors.password}
                editable={!isSubmitting}
                testID="input-password"
              />

              <Button
                title="Masuk"
                onPress={handleLogin}
                isLoading={isSubmitting}
                disabled={isSubmitting}
                style={styles.submitButton}
                testID="button-submit-login"
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  appName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  submitButton: {
    marginTop: 8,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default LoginScreen;
