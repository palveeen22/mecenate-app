import { Colors, Radius, Spacing } from '@/shared/design';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

function SkeletonBox({ style }: { style?: object }) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return <Animated.View style={[styles.skeleton, style, { opacity }]} />;
}

export function PostSkeleton() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <SkeletonBox style={styles.avatar} />
        <SkeletonBox style={styles.authorName} />
      </View>

      {/* Cover */}
      <SkeletonBox style={styles.cover} />

      {/* Body */}
      <View style={styles.body}>
        <SkeletonBox style={styles.titleLine} />
        <SkeletonBox style={styles.textLine} />

        {/* Footer actions */}
        <View style={styles.footer}>
          <SkeletonBox style={styles.footerItem} />
          <SkeletonBox style={styles.footerItem} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
  },
  authorName: {
    width: 140,
    height: 14,
    borderRadius: Radius.full,
  },
  cover: {
    width: '100%',
    height: 260,
    borderRadius: 0,
  },
  body: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  titleLine: {
    width: '55%',
    height: 16,
    borderRadius: Radius.full,
  },
  textLine: {
    width: '100%',
    height: 16,
    borderRadius: Radius.full,
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  footerItem: {
    width: 63,
    height: 36,
    borderRadius: Radius.full,
  },
  skeleton: {
    backgroundColor: Colors.skeleton,
  },
});