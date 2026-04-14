import { Colors, Radius, Spacing } from '@/src/shared/design';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const ITEMS = [
  { nameWidth: '45%', lineWidths: ['90%'] },
  { nameWidth: '35%', lineWidths: ['75%', '55%'] },
  { nameWidth: '50%', lineWidths: ['85%'] },
  { nameWidth: '40%', lineWidths: ['70%', '40%'] },
  { nameWidth: '55%', lineWidths: ['95%'] },
] as const;

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

function CommentSkeletonItem({
  nameWidth,
  lineWidths,
}: {
  nameWidth: string;
  lineWidths: readonly string[];
}) {
  return (
    <View style={styles.item}>
      <SkeletonBox style={styles.avatar} />
      <View style={styles.content}>
        <SkeletonBox style={[styles.nameLine, { width: nameWidth }]} />
        {lineWidths.map((w, i) => (
          <SkeletonBox key={i} style={[styles.textLine, { width: w }]} />
        ))}
      </View>
    </View>
  );
}

export function CommentSkeleton() {
  return (
    <View style={styles.container}>
      {ITEMS.map((item, i) => (
        <CommentSkeletonItem key={i} nameWidth={item.nameWidth} lineWidths={item.lineWidths} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  item: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: 6,
    paddingTop: 2,
  },
  nameLine: {
    height: 13,
    borderRadius: Radius.full,
  },
  textLine: {
    height: 12,
    borderRadius: Radius.full,
  },
  skeleton: {
    backgroundColor: Colors.skeleton,
  },
});
