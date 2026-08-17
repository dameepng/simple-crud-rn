import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  TextProps,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'solid' | 'outline' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  style,
  disabled,
  isLoading,
  activeOpacity = 0.85,
  ...rest
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        (disabled || isLoading) && styles.buttonDisabled,
        style,
      ]}
      disabled={disabled || isLoading}
      activeOpacity={activeOpacity}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export interface ButtonTextProps extends TextProps {
  className?: string;
}

export const ButtonText: React.FC<ButtonTextProps> = ({
  children,
  style,
  ...rest
}) => {
  return (
    <Text style={[styles.buttonText, style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default Button;
