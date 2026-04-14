import { Colors, Spacing } from '@/src/shared/design';
import { EmptyState } from '@/src/shared/ui/EmptyState';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeedError } from '../components';
import { CommentsDrawer } from '../components/CommentsDrawer';
import { FeedFooterLoader } from '../components/FeedFooterLoader';
import { FeedListHeader } from '../components/FeedListHeader';
import { PostCard } from '../components/PostCard';
import { PostSkeleton } from '../components/PostSkeleton';
import { useFeed } from '../hooks';
import { FeedTier } from '../hooks/useFeed';
import { Post } from '../types';

type FeedTabKey = 'all' | FeedTier;

export function FeedScreen() {
  const [activeTab, setActiveTab] = useState<FeedTabKey>('all');
  const [commentsTarget, setCommentsTarget] = useState<{
    postId: string;
    count: number;
  } | null>(null);

  const tier: FeedTier | undefined = activeTab === 'all' ? undefined : activeTab;

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useFeed(tier);

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  const handleCommentPress = useCallback((postId: string, count: number) => {
    setCommentsTarget({ postId, count });
  }, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard post={item} onCommentPress={handleCommentPress} />
    ),
    [handleCommentPress],
  );

  const keyExtractor = useCallback((item: Post) => item.id, []);

  const handleTabChange = useCallback(
    (key: string) => setActiveTab(key as FeedTabKey),
    [],
  );

  const renderHeader = useCallback(
    () => <FeedListHeader activeTab={activeTab} onTabChange={handleTabChange} />,
    [activeTab, handleTabChange],
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View>
          {[1, 2, 3].map((key) => (
            <PostSkeleton key={key} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.safeAreaWhite]} edges={['top']}>
        <FeedError onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyWrapper}>
            <EmptyState
              title="По вашему запросу ничего не найдено"
              buttonLabel="На главную"
              onPress={() => setActiveTab('all')}
            />
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={isFetchingNextPage ? <FeedFooterLoader /> : null}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <CommentsDrawer
        postId={commentsTarget?.postId ?? ''}
        commentsCount={commentsTarget?.count ?? 0}
        visible={!!commentsTarget}
        onClose={() => setCommentsTarget(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
  },
  safeAreaWhite: {
    backgroundColor: Colors.background,
  },
  list: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.surfaceSubtle,
  },
  emptyWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  separator: {
    height: Spacing.md,
    backgroundColor: Colors.surfaceSubtle,
  },
});
