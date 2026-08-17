/**
 * Reusable Input Component
 * PRD Checklist FASE 2 & SEC-5: Reusable form text input with error validation presentation
 * 
 * Password Best Practice (React Native Standard):
 * - Uses uncontrolled pattern with textRef for password input
 * - Eliminates JS-to-Native bridge latency that causes premature 10ms masking cutoff
 * - Allows native OS 500ms character preview timer to run smoothly for all characters
 * - Synchronizes native buffer seamlessly via setNativeProps on seen/unseen toggle
 */
import React, { useState, useEffect, useRef } from 'react';
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
  const inputRef = useRef<TextInput>(null);
  const textRef = useRef<string>(value || '');

  // Keep internal textRef updated if value is changed externally (e.g., form reset)
  useEffect(() => {
    if (value !== undefined) {
      textRef.current = value;
      if (isPassword && inputRef.current && value === '') {
        inputRef.current.setNativeProps({ text: '' });
      }
    }
  }, [value, isPassword]);

  const handleChangeText = (text: string) => {
    textRef.current = text;
    onChangeText?.(text);
  };

  const handleTogglePassword = () => {
    const nextShowPassword = !showPassword;
    setShowPassword(nextShowPassword);

    // Sync native text buffer and maintain focus so keyboard stays open & text never vanishes
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.setNativeProps({ text: textRef.current });
        inputRef.current.focus();
      }
    });
  };

  // For password on Android/iOS, use uncontrolled defaultValue to let native OS 500ms echo timer run untouched
  const isSecureMode = isPassword && !showPassword;

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
          ref={inputRef}
          style={[styles.input, style]}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isSecureMode}
          autoCorrect={false}
          spellCheck={false}
          autoCapitalize="none"
          textContentType={isPassword ? 'password' : rest.textContentType || 'none'}
          autoComplete={isPassword ? 'password' : rest.autoComplete || 'off'}
          value={isPassword ? undefined : value}
          defaultValue={isPassword ? textRef.current : undefined}
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
            onPress={handleTogglePassword}
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
