/**
 * Toast / Feedback Component
 * PRD Checklist 4.4 & FR-12: Feedback banner for success and error states
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  onDismiss?: () => void;
  autoHideDuration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'success',
  onDismiss,
  autoHideDuration = 3500,
}) => {
  const [opacity] = React.useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();

      if (autoHideDuration > 0 && onDismiss) {
        const timer = setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onDismiss());
        }, autoHideDuration);

        return () => clearTimeout(timer);
      }
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, autoHideDuration, onDismiss, opacity]);

  if (!visible) return null;

  const getStyleByType = () => {
    switch (type) {
      case 'error':
        return {
          container: styles.errorContainer,
          text: styles.errorText,
          icon: '⚠️',
        };
      case 'info':
        return {
          container: styles.infoContainer,
          text: styles.infoText,
          icon: 'ℹ️',
        };
      case 'success':
      default:
        return {
          container: styles.successContainer,
          text: styles.successText,
          icon: '✅',
        };
    }
  };

  const styleConfig = getStyleByType();

  return (
    <Animated.View
      style={[styles.wrapper, { opacity }]}
      testID={`toast-${type}`}
      accessibilityLiveRegion="polite"
    >
      <View style={[styles.container, styleConfig.container]}>
        <Text style={styles.icon}>{styleConfig.icon}</Text>
        <Text style={[styles.message, styleConfig.text]} numberOfLines={3}>
          {message}
        </Text>
        {onDismiss ? (
          <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
            <Text style={[styles.closeText, styleConfig.text]}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  successContainer: {
    backgroundColor: '#ECFDF5',
    borderColor: '#6EE7B7',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  infoContainer: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  successText: {
    color: '#065F46',
  },
  errorText: {
    color: '#991B1B',
  },
  infoText: {
    color: '#1E40AF',
  },
  closeButton: {
    paddingLeft: 10,
    paddingVertical: 4,
  },
  closeText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default Toast;
