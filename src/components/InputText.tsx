import React from 'react';
import { TextInput, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, radii, typography } from '../tokens';

interface InputTextProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export const InputText: React.FC<InputTextProps> = ({
  value,
  onChangeText,
  placeholder = 'Введите текст...',
  style,
}) => {
  return (
    <TextInput
      style={[styles.input, style]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSizeSm,
    color: colors.textPrimary,
    minHeight: 40,
  },
});
