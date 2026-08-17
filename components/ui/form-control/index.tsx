import React, { createContext, useContext } from 'react';
import { View, Text, ViewProps, TextProps, StyleSheet } from 'react-native';

interface FormControlContextValue {
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

const FormControlContext = createContext<FormControlContextValue>({});

export const useFormControl = () => useContext(FormControlContext);

export interface FormControlProps extends ViewProps {
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FormControl: React.FC<FormControlProps> = ({
  children,
  isInvalid,
  isRequired,
  isDisabled,
  isReadOnly,
  style,
  ...rest
}) => {
  return (
    <FormControlContext.Provider
      value={{ isInvalid, isRequired, isDisabled, isReadOnly }}
    >
      <View style={[styles.formControl, style]} {...rest}>
        {children}
      </View>
    </FormControlContext.Provider>
  );
};

export interface FormControlLabelProps extends ViewProps {
  className?: string;
}

export const FormControlLabel: React.FC<FormControlLabelProps> = ({
  children,
  style,
  ...rest
}) => {
  return (
    <View style={[styles.labelContainer, style]} {...rest}>
      {children}
    </View>
  );
};

export interface FormControlLabelTextProps extends TextProps {
  className?: string;
}

export const FormControlLabelText: React.FC<FormControlLabelTextProps> = ({
  children,
  style,
  ...rest
}) => {
  const { isRequired } = useFormControl();
  return (
    <Text style={[styles.labelText, style]} {...rest}>
      {children}
      {isRequired && <Text style={styles.requiredAsterisk}> *</Text>}
    </Text>
  );
};

export interface FormControlHelperProps extends ViewProps {
  className?: string;
}

export const FormControlHelper: React.FC<FormControlHelperProps> = ({
  children,
  style,
  ...rest
}) => {
  return (
    <View style={[styles.helperContainer, style]} {...rest}>
      {children}
    </View>
  );
};

export interface FormControlHelperTextProps extends TextProps {
  className?: string;
}

export const FormControlHelperText: React.FC<FormControlHelperTextProps> = ({
  children,
  style,
  ...rest
}) => {
  return (
    <Text style={[styles.helperText, style]} {...rest}>
      {children}
    </Text>
  );
};

export interface FormControlErrorProps extends ViewProps {
  className?: string;
}

export const FormControlError: React.FC<FormControlErrorProps> = ({
  children,
  style,
  ...rest
}) => {
  const { isInvalid } = useFormControl();
  if (!isInvalid) return null;
  return (
    <View style={[styles.errorContainer, style]} {...rest}>
      {children}
    </View>
  );
};

export interface FormControlErrorTextProps extends TextProps {
  className?: string;
}

export const FormControlErrorText: React.FC<FormControlErrorTextProps> = ({
  children,
  style,
  ...rest
}) => {
  return (
    <Text style={[styles.errorText, style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  requiredAsterisk: {
    color: '#EF4444',
  },
  helperContainer: {
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
  },
});
