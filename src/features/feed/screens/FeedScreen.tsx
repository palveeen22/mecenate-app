import { Colors, Spacing, Typography } from "@/src/shared/design";
import { FilterTab, FilterTabs } from "@/src/shared/design/components";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommentsDrawer } from "../components/CommentsDrawer";
import { PostCard } from "../components/PostCard";
import { PostSkeleton } from "../components/PostSkeleton";
import { useFeed } from "../hooks";
import { Post } from "../types";

const FEED_TABS: FilterTab[] = [
  { key: "all", label: "Все" },
  { key: "free", label: "Бесплатные" },
  { key: "paid", label: "Платно" },
];

function ListHeader({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (key: string) => void;
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Лента</Text>
      <FilterTabs
        tabs={FEED_TABS}
        activeKey={activeTab}
        onChange={onTabChange}
      />
    </View>
  );
}

function FooterLoader() {
  return (
    <View style={styles.footerLoader}>
      <ActivityIndicator color={Colors.primary} />
    </View>
  );
}

export function FeedScreen() {
  const [activeTab, setActiveTab] = useState("all");
  const [commentsTarget, setCommentsTarget] = useState<{
    postId: string;
    count: number;
  } | null>(null);

  const tier = activeTab === 'all' ? undefined : (activeTab as 'free' | 'paid');

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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <ListHeader activeTab={activeTab} onTabChange={setActiveTab} />
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
      <SafeAreaView style={[styles.safeArea, styles.safeAreaWhite]} edges={["top"]}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <ListHeader activeTab={activeTab} onTabChange={setActiveTab} />
        <EmptyState
          title="Не удалось загрузить публикацию"
          buttonLabel="Повторить"
          onPress={refetch}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <ListHeader activeTab={activeTab} onTabChange={setActiveTab} />
        }
        ListEmptyComponent={
          <View style={styles.emptyWrapper}>
            <EmptyState
              title="По вашему запросу ничего не найдено"
              buttonLabel="На главную"
              onPress={() => setActiveTab("all")}
            />
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={isFetchingNextPage ? <FooterLoader /> : null}
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
  list: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.surfaceSubtle,
  },
  emptyWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
    paddingHorizontal: Spacing.md,
  },
  footerLoader: {
    paddingVertical: Spacing.lg,
    alignItems: "center",
  },
  separator: {
    height: Spacing.md,
    backgroundColor: Colors.surfaceSubtle,
  },
  safeAreaWhite: {
    backgroundColor: Colors.background,
  },
});