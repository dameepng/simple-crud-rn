import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';

export interface HeadingProps extends TextProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  className?: string;
}

const sizeMap: Record<string, { fontSize: number; lineHeight: number }> = {
  xs: { fontSize: 14, lineHeight: 18 },
  sm: { fontSize: 16, lineHeight: 20 },
  md: { fontSize: 18, lineHeight: 24 },
  lg: { fontSize: 20, lineHeight: 26 },
  xl: { fontSize: 24, lineHeight: 30 },
  '2xl': { fontSize: 28, lineHeight: 34 },
  '3xl': { fontSize: 32, lineHeight: 38 },
  '4xl': { fontSize: 36, lineHeight: 42 },
};

export const Heading: React.FC<HeadingProps> = ({
  children,
  size = 'xl',
  style,
  ...rest
}) => {
  const fontStyle = sizeMap[size] || sizeMap.xl;
  return (
    <RNText style={[styles.heading, fontStyle, style]} {...rest}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontWeight: '700',
    color: '#111827',
  },
});

export default Heading;
