import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

export interface VStackProps extends ViewProps {
  space?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  reversed?: boolean;
  className?: string;
}

const spaceMap: Record<string, number> = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
};

export const VStack: React.FC<VStackProps> = ({
  children,
  space = 'md',
  reversed = false,
  style,
  ...rest
}) => {
  const gap = spaceMap[space] || 12;
  return (
    <View
      style={[
        styles.vstack,
        { gap, flexDirection: reversed ? 'column-reverse' : 'column' },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  vstack: {
    flexDirection: 'column',
    width: '100%',
  },
});

export default VStack;
