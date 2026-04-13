import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Radius, Typography } from '@/src/shared/design';

type Props = {
  onRetry: () => void;
};

export function FeedError({ onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.message}>Не удалось загрузить публикации</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Повторить</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  icon: {
    fontSize: 40,
  },
  message: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.medium,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.size.md * Typography.lineHeight.normal,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
    marginTop: Spacing.xs,
  },
  buttonText: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.white,
  },
});
