import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';

export interface ThemedTextProps extends TextProps {
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  className?: string;
}

const sizeMap: Record<string, { fontSize: number; lineHeight: number }> = {
  '2xs': { fontSize: 10, lineHeight: 14 },
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 14, lineHeight: 20 },
  md: { fontSize: 15, lineHeight: 22 },
  lg: { fontSize: 16, lineHeight: 24 },
  xl: { fontSize: 18, lineHeight: 26 },
};

export const Text: React.FC<ThemedTextProps> = ({
  children,
  size = 'md',
  style,
  ...rest
}) => {
  const fontStyle = sizeMap[size] || sizeMap.md;
  return (
    <RNText style={[styles.text, fontStyle, style]} {...rest}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#374151',
  },
});

export default Text;
