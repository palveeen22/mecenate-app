import React from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Radius, Spacing, Typography } from '../tokens';

export interface FilterTab {
  key: string;
  label: string;
}

interface Props {
  tabs: FilterTab[];
  activeKey: string;
  onChange: (key: string) => void;
  style?: object;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const TRACK_WIDTH = SCREEN_WIDTH - Spacing.md * 2;
const TRACK_HEIGHT = 38;

export function FilterTabs({ tabs, activeKey, onChange, style }: Props) {
  const tabWidth = TRACK_WIDTH / tabs.length;
  const activeIndex = tabs.findIndex((t) => t.key === activeKey);

  const translateX = useSharedValue(activeIndex * tabWidth);

  React.useEffect(() => {
    translateX.value = withTiming(activeIndex * tabWidth, { duration: 200 });
  }, [activeIndex, tabWidth, translateX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.track, style]}>
      <Animated.View
        style={[styles.indicator, { width: tabWidth }, indicatorStyle]}
      />
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        const gesture = Gesture.Tap()
          .runOnJS(true)
          .onEnd(() => onChange(tab.key));

        return (
          <GestureDetector key={tab.key} gesture={gesture}>
            <Animated.View style={styles.tab}>
              <Text style={[styles.label, active && styles.activeLabel]}>
                {tab.label}
              </Text>
            </Animated.View>
          </GestureDetector>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    borderColor: Colors.surfaceBorder,
    borderWidth: 1,
    marginHorizontal: Spacing.md,
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  tab: {
    flex: 1,
    height: TRACK_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  label: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.textMuted,
  },
  activeLabel: {
    color: Colors.white,
    fontWeight: Typography.weight.semibold,
  },
});