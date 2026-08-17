/**
 * Reusable Button Component
 * PRD Checklist FASE 2: Button with loading indicator and disabled state
 */
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
  testID,
}) => {
  const isInteractionDisabled = disabled || isLoading;

  const getContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'danger':
        return styles.dangerContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'danger':
        return styles.dangerText;
      case 'outline':
        return styles.outlineText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  const getSpinnerColor = () => {
    if (variant === 'outline') return '#2563EB';
    if (variant === 'secondary') return '#374151';
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={isInteractionDisabled}
      style={[
        styles.baseContainer,
        getContainerStyle(),
        isInteractionDisabled && styles.disabledContainer,
        style,
      ]}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled: isInteractionDisabled, busy: isLoading }}
    >
      {isLoading ? (
        <ActivityIndicator color={getSpinnerColor()} size="small" />
      ) : (
        <Text style={[styles.baseText, getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  primaryContainer: {
    backgroundColor: '#2563EB',
  },
  secondaryContainer: {
    backgroundColor: '#E5E7EB',
  },
  dangerContainer: {
    backgroundColor: '#EF4444',
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#2563EB',
  },
  disabledContainer: {
    opacity: 0.6,
  },
  baseText: {
    fontSize: 15,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#1F2937',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#2563EB',
  },
});

export default Button;
