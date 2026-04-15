import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors, spacing, radii, typography } from '../tokens';

type Variant = 'primary' | 'outline' | 'disabled';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  style,
}) => {
  const disabled = variant === 'disabled' || loading;

  return (
    <TouchableOpacity
      style={[styles.base, variantStyles[variant], style]}
      onPress={onPress}
      activeOpacity={0.75}
      disabled={disabled}
    >
      {loading
        ? <ActivityIndicator color={colors.white} size="small" />
        : <Text style={[styles.label, variant === 'outline' && styles.labelOutline, variant === 'disabled' && styles.labelDisabled]}>
            {label}
          </Text>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 38,
  },
  label: {
    color: colors.white,
    fontSize: 13,
    fontWeight: typography.fontWeightBold,
    letterSpacing: 0.2,
  },
  labelOutline: {
    color: colors.primary,
  },
  labelDisabled: {
    color: colors.white,
  },
});

const variantStyles = StyleSheet.create<Record<Variant, object>>({
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  disabled: {
    backgroundColor: '#C9A8E8',
  },
});
