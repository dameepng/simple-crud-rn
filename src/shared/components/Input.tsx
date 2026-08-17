/**
 * Reusable Input Component
 * PRD Checklist FASE 2 & SEC-5: Reusable form text input with error validation presentation
 * 
 * Option 2: Instant Custom Bullet Masking Component
 * - Pure instant bullet masking (••••••) with zero character flash
 * - Immediate dot representation on every keystroke
 * - Seamless plain text viewing via eye toggle (Seen/Unseen)
 * - Keyboard & cursor remain stably focused
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
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
  value = '',
  onChangeText,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);
  const inputRef = useRef<TextInput>(null);

  // Real internal password value
  const realPasswordRef = useRef<string>(value);

  // Synchronize external value resets
  useEffect(() => {
    realPasswordRef.current = value;
  }, [value]);

  const handlePasswordTextChange = (inputText: string) => {
    const prevReal = realPasswordRef.current;
    let newReal = '';

    const currentLen = prevReal.length;

    if (inputText.length < currentLen) {
      // User pressed backspace
      const diff = currentLen - inputText.length;
      newReal = prevReal.slice(0, Math.max(0, prevReal.length - diff));
    } else {
      // User typed character(s)
      const added = inputText.slice(currentLen);
      newReal = prevReal + added;
    }

    realPasswordRef.current = newReal;
    onChangeText?.(newReal);
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
    // Keep focus and keyboard open on toggle
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  // Instant bullet masking when hidden, plain text when visible
  const activePassword = value || realPasswordRef.current;
  const displayValue = isPassword
    ? showPassword
      ? activePassword
      : '•'.repeat(activePassword.length)
    : value;

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
          autoCorrect={false}
          spellCheck={false}
          autoCapitalize="none"
          textContentType={isPassword ? 'password' : rest.textContentType || 'none'}
          autoComplete={isPassword ? 'password' : rest.autoComplete || 'off'}
          value={displayValue}
          onChangeText={isPassword ? handlePasswordTextChange : onChangeText}
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
