import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../tokens';

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
  radius?: number | 'full' | 'sm' | 'md' | 'lg'; 
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
  radius
}: Props) {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  const resolvedRadius =
    radius === undefined ? Radius.full :
    radius === 'full'    ? Radius.full :
    radius === 'sm'      ? Radius.sm :
    radius === 'md'      ? Radius.md :
    radius === 'lg'      ? Radius.lg :
    radius;

  return (
    <Pressable
      style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => [
        styles.base,
        styles[size],
        isPrimary ? styles.primary : styles.outline,
        hovered && !isDisabled && (isPrimary ? styles.primaryHover : styles.outlineHover),
        pressed && !isDisabled && (isPrimary ? styles.primaryPressed : styles.outlinePressed),
        isDisabled && (isPrimary ? styles.primaryDisabled : styles.outlineDisabled),
        fullWidth && styles.fullWidth,
        style,
        { borderRadius: resolvedRadius }, 
      ]}
      onPress={onPress}
      disabled={isDisabled}
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
    </Pressable>
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
  // primary variant states
  primary: {
    backgroundColor: Colors.primary,
  },
  primaryHover: {
    backgroundColor: Colors.primaryElevated,
  },
  primaryPressed: {
    backgroundColor: Colors.primaryDark,
  },
  primaryDisabled: {
    backgroundColor: Colors.primaryDim,
  },
  // outline variant states
  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  outlineHover: {
    backgroundColor: Colors.primaryDim,
  },
  outlinePressed: {
    backgroundColor: Colors.primaryDim,
    borderColor: Colors.primaryElevated,
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
