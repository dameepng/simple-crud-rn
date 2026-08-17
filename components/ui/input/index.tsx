import React, { createContext, useContext } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ViewProps,
} from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface InputContextValue {
  isFocused?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
}

const InputContext = createContext<InputContextValue>({});

export interface InputComponentProps extends ViewProps {
  className?: string;
  isFocused?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  textAlign?: string;
}

export const Input: React.FC<InputComponentProps> = ({
  children,
  style,
  isDisabled,
  isInvalid,
  ...rest
}) => {
  return (
    <InputContext.Provider value={{ isDisabled, isInvalid }}>
      <View
        style={[
          styles.inputContainer,
          isInvalid && styles.inputContainerInvalid,
          isDisabled && styles.inputContainerDisabled,
          style,
        ]}
        {...rest}
      >
        {children}
      </View>
    </InputContext.Provider>
  );
};

export interface InputFieldProps extends TextInputProps {
  type?: 'text' | 'password';
  className?: string;
}

export const InputField = React.forwardRef<TextInput, InputFieldProps>(
  ({ type = 'text', style, secureTextEntry, ...rest }, ref) => {
    const isPassword = type === 'password';
    return (
      <TextInput
        ref={ref}
        style={[styles.inputField, style]}
        secureTextEntry={isPassword || secureTextEntry}
        placeholderTextColor="#9CA3AF"
        autoCapitalize={isPassword ? 'none' : rest.autoCapitalize}
        autoCorrect={isPassword ? false : rest.autoCorrect}
        {...rest}
      />
    );
  }
);

InputField.displayName = 'InputField';

export interface InputSlotProps extends TouchableOpacityProps {
  className?: string;
}

export const InputSlot: React.FC<InputSlotProps> = ({
  children,
  style,
  activeOpacity = 0.7,
  ...rest
}) => {
  return (
    <TouchableOpacity
      style={[styles.inputSlot, style]}
      activeOpacity={activeOpacity}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
};

export interface InputIconProps {
  as?: LucideIcon | React.ComponentType<any>;
  size?: number | string;
  color?: string;
  className?: string;
  style?: any;
}

export const InputIcon: React.FC<InputIconProps> = ({
  as: Component,
  size = 18,
  color = '#6B7280',
  style,
}) => {
  if (!Component) return null;
  return <Component size={typeof size === 'number' ? size : 18} color={color} style={style} />;
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    minHeight: 46,
    width: '100%',
  },
  inputContainerInvalid: {
    borderColor: '#EF4444',
  },
  inputContainerDisabled: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  inputField: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 10,
  },
  inputSlot: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
