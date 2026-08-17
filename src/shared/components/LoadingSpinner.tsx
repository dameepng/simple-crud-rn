/**
 * Loading Spinner Component
 * PRD Checklist FASE 2: Full screen or container centered loading indicator
 */
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
  color?: string;
  size?: 'small' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  fullScreen = true,
  color = '#2563EB',
  size = 'large',
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={color} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default LoadingSpinner;
