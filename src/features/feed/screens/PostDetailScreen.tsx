import { Colors, Radius, Spacing, Typography } from '@/src/shared/design';
import { formatDate } from '@/src/shared/lib/format';
import { EmptyState } from '@/src/shared/ui/EmptyState';
import { NavBar } from '@/src/shared/ui/NavBar';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommentInputBar } from '../components/CommentInputBar';
import { CommentItem } from '../components/CommentItem';
import { PostActions } from '../components/PostActions';
import { PostAuthorRow } from '../components/PostAuthorRow';
import { useAddComment, useComments, usePost } from '../hooks';
import { Comment } from '../types';

type Props = { postId: string };

export const PostDetailScreen = observer(function PostDetailScreen({ postId }: Props) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput | null>(null);

  const { data: post, isLoading, isError, refetch } = usePost(postId);
  const {
    data: commentsData,
    isLoading: commentsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(postId);
  const { mutate: addComment, isPending: sendPending } = useAddComment(postId);

  const comments = commentsData?.pages.flatMap((p) => p.comments) ?? [];

  const handleSend = useCallback(
    (text: string) => addComment(text),
    [addComment],
  );

  const renderComment: ListRenderItem<Comment> = useCallback(
    ({ item }) => <CommentItem comment={item} />,
    [],
  );
  const keyExtractor = useCallback((item: Comment) => item.id, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <NavBar />
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !post) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <NavBar />
        <EmptyState
          title="Не удалось загрузить публикацию"
          buttonLabel="Повторить"
          onPress={refetch}
        />
      </SafeAreaView>
    );
  }

  const PostHeader = (
    <View>
      <PostAuthorRow
        author={post.author}
        avatarSize={44}
        showVerified
        subtitle={`@${post.author.username} · ${post.author.subscribersCount.toLocaleString('ru-RU')} подписчиков`}
      />

      {post.coverUrl ? (
        <Image
          source={{ uri: post.coverUrl }}
          style={styles.cover}
          contentFit="cover"
          transition={300}
        />
      ) : null}

      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>

        {post.tier === 'paid' && !post.body ? (
          <View style={styles.lockedBox}>
            <Ionicons name="lock-closed" size={20} color={Colors.primary} />
            <Text style={styles.lockedText}>Эта публикация доступна только подписчикам</Text>
          </View>
        ) : (
          <Text style={styles.postBody}>{post.body || post.preview}</Text>
        )}

        <View style={styles.actionsRow}>
          <PostActions
            post={post}
            onCommentPress={() => inputRef.current?.focus()}
          />
        </View>
      </View>

      {/* Comments section header */}
      <View style={styles.commentsHeader}>
        <Text style={styles.commentsTitle}>Комментарии</Text>
        <Text style={styles.commentsCount}>{post.commentsCount}</Text>
      </View>

      {commentsLoading && (
        <View style={styles.commentsLoader}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      )}

      {!commentsLoading && comments.length === 0 && (
        <View style={styles.commentsEmpty}>
          <Ionicons name="chatbubble-outline" size={32} color={Colors.textMuted} />
          <Text style={styles.commentsEmptyText}>Будьте первым, кто оставит комментарий</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <NavBar />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={keyExtractor}
          ListHeaderComponent={PostHeader}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + Spacing.md },
          ]}
          onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isFetchingNextPage
              ? <ActivityIndicator color={Colors.primary} style={styles.pageLoader} />
              : null
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        />

        {/* Sticky comment input */}
        <View style={[styles.inputBar, { paddingBottom: insets.bottom || Spacing.sm }]}>
          <View style={styles.inputBarSeparator} />
          <CommentInputBar
            onSend={handleSend}
            isPending={sendPending}
            inputRef={inputRef}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { gap: 0 },
  pageLoader: { padding: Spacing.md },

  cover: { width: '100%', height: 280, backgroundColor: Colors.surfaceElevated },
  postContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  postTitle: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
    lineHeight: Typography.size.xxl * 1.25,
  },
  postDate: { fontSize: Typography.size.xs, color: Colors.textMuted },
  postBody: {
    fontSize: Typography.size.md,
    color: Colors.text,
    lineHeight: Typography.size.md * 1.7,
    marginTop: Spacing.xs,
  },
  lockedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.xs,
  },
  lockedText: { flex: 1, fontSize: Typography.size.sm, color: Colors.textSecondary },
  actionsRow: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.surfaceBorder,
  },

  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.surfaceBorder,
  },
  commentsTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.text,
  },
  commentsCount: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.textMuted,
  },
  commentsLoader: { paddingVertical: Spacing.xl, alignItems: 'center' },
  commentsEmpty: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  commentsEmptyText: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  // Sticky input bar
  inputBar: { backgroundColor: Colors.background },
  inputBarSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.surfaceBorder,
  },
});
