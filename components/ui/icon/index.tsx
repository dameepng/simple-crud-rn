import React from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react-native';

export const EyeIcon = Eye;
export const EyeOffIcon = EyeOff;

export interface IconProps {
  as?: LucideIcon | React.ComponentType<any>;
  size?: number | string;
  color?: string;
  className?: string;
  style?: any;
}

export const Icon: React.FC<IconProps> = ({ as: Component, size = 18, color = '#6B7280', style }) => {
  if (!Component) return null;
  return <Component size={typeof size === 'number' ? size : 18} color={color} style={style} />;
};

export default Icon;
