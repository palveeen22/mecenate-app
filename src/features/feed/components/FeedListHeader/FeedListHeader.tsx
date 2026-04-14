import { Colors, Spacing, Typography } from '@/src/shared/design';
import { FilterTab, FilterTabs } from '@/src/shared/design/components';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const FEED_TABS: FilterTab[] = [
  { key: 'all', label: 'Все' },
  { key: 'free', label: 'Бесплатные' },
  { key: 'paid', label: 'Платно' },
];

type Props = {
  activeTab: string;
  onTabChange: (key: string) => void;
};

export function FeedListHeader({ activeTab, onTabChange }: Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Лента</Text>
      <FilterTabs tabs={FEED_TABS} activeKey={activeTab} onChange={onTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.background,
    marginBottom: Spacing.sm
  },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
    paddingHorizontal: Spacing.md,
  },
});
