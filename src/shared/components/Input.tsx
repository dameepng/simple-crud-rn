import { Eye, EyeOff } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

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
  value = '',
  onChangeText,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const isMasked = isPassword && !showPassword;

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
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              isMasked && Boolean(value) && styles.transparentText,
              style,
            ]}
            placeholderTextColor="#9CA3AF"
            autoCorrect={false}
            spellCheck={false}
            autoCapitalize="none"
            textContentType={isPassword ? 'password' : rest.textContentType || 'none'}
            autoComplete={isPassword ? 'password' : rest.autoComplete || 'off'}
            value={value}
            onChangeText={onChangeText}
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
          {/* Zero-Flash Custom Dot Overlay */}
          {isMasked && Boolean(value) && (
            <View pointerEvents="none" style={styles.overlayContainer}>
              <Text style={styles.dotText} numberOfLines={1}>
                {'•'.repeat(value.length)}
              </Text>
            </View>
          )}
        </View>

        {isPassword && (
          <TouchableOpacity
            onPress={handleTogglePassword}
            style={styles.eyeButton}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            activeOpacity={0.7}
          >
            {showPassword ? <EyeOff size={18} color="#6B7280" /> : <Eye size={18} color="#6B7280" />}
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
  inputWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    fontSize: 15,
    color: '#111827',
    paddingVertical: 10,
  },
  transparentText: {
    color: 'transparent',
  },
  overlayContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  dotText: {
    fontSize: 15,
    color: '#111827',
    letterSpacing: 2,
    includeFontPadding: false,
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
