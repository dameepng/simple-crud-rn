/**
 * Reusable Input Component
 * PRD Checklist FASE 2 & SEC-5: Reusable form text input with error validation presentation
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isPassword = false,
  required = false,
  style,
  editable = true,
  value,
  onChangeText,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);
  const [internalValue, setInternalValue] = useState(value || '');

  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChangeText = (text: string) => {
    setInternalValue(text);
    onChangeText?.(text);
  };

  // On Android, passing a controlled `value` on every keystroke forces native `setText()`,
  // which prematurely aborts Android's native 500ms password echo timer.
  // Using defaultValue for password on Android lets Android's native 500ms timer run smoothly!
  const isAndroidSecure = Platform.OS === 'android' && isPassword && !showPassword;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.requiredStar}> *</Text>}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          Boolean(error) && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}
      >
        <TextInput
          key={isPassword ? `pwd-${showPassword}` : 'regular'}
          style={[styles.input, style]}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !showPassword}
          autoCorrect={!isPassword}
          spellCheck={!isPassword}
          autoCapitalize="none"
          textContentType={isPassword ? 'password' : rest.textContentType || 'none'}
          autoComplete={isPassword ? 'password' : rest.autoComplete || 'off'}
          value={isAndroidSecure ? undefined : internalValue}
          defaultValue={isAndroidSecure ? internalValue : undefined}
          onChangeText={handleChangeText}
          onFocus={(e) => {
            setIsFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            rest.onBlur?.(e);
          }}
          editable={editable}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eyeButton}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            activeOpacity={0.7}
          >
            {showPassword ? (
              <EyeOff size={18} color="#6B7280" />
            ) : (
              <Eye size={18} color="#6B7280" />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  requiredStar: {
    color: '#EF4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    minHeight: 48,
  },
  inputContainerFocused: {
    borderColor: '#2563EB',
    borderWidth: 1.5,
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  inputContainerDisabled: {
    backgroundColor: '#F3F4F6',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 10,
  },
  eyeButton: {
    padding: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 2,
  },
});

export default Input;
