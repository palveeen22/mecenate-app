import { Button, Colors, Radius, Spacing, Typography } from '@/shared/design';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  buttonLabel: string;
  onPress: () => void;
};

export function EmptyState({ title, buttonLabel, onPress }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/empty-axolotl.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{title}</Text>
      <Button label={buttonLabel} radius={Radius.md + 2} onPress={onPress} size="md" fullWidth />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.text,
    textAlign: 'center',
  },
});
