import { Colors, Spacing } from '@/src/shared/design';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export function FeedFooterLoader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
});
