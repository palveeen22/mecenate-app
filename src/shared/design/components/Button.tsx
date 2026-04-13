import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Colors, Spacing, Radius, Typography } from '../tokens';

export type ButtonVariant = 'primary' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface Props {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onPress,
  style,
}: Props) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[size],
        isPrimary ? styles.primary : styles.outline,
        isDisabled && (isPrimary ? styles.primaryDisabled : styles.outlineDisabled),
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? Colors.white : Colors.primary}
        />
      ) : (
        <Text
          style={[
            styles.label,
            styles[`label_${size}` as keyof typeof styles],
            isPrimary ? styles.labelPrimary : styles.labelOutline,
            isDisabled && styles.labelDisabled,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  // sizes
  sm: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    minHeight: 32,
  },
  md: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 2,
    minHeight: 44,
  },
  lg: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    minHeight: 52,
  },
  // variants
  primary: {
    backgroundColor: Colors.primary,
  },
  primaryDisabled: {
    backgroundColor: Colors.primaryDim,
  },
  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  outlineDisabled: {
    borderColor: Colors.textMuted,
  },
  // labels
  label: {
    fontWeight: Typography.weight.semibold,
  },
  label_sm: {
    fontSize: Typography.size.xs,
  },
  label_md: {
    fontSize: Typography.size.md,
  },
  label_lg: {
    fontSize: Typography.size.lg,
  },
  labelPrimary: {
    color: Colors.white,
  },
  labelOutline: {
    color: Colors.primary,
  },
  labelDisabled: {
    color: Colors.textMuted,
  },
});
