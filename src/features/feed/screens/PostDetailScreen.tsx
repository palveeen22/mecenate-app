import { Colors, Spacing } from '@/shared/design';
import { EmptyState } from '@/shared/ui/EmptyState';
import { InputBar } from '@/shared/ui/InputBar';
import { NavBar } from '@/shared/ui/NavBar';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommentItem } from '../components/CommentItem';
import { PostDetailHeader } from '../components/PostDetailHeader';
import { useAddComment, useComments, usePost } from '../hooks';
import { feedStore } from '../store';
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

  const comments = useMemo(() => {
    const seen = new Set<string>();
    return (commentsData?.pages ?? [])
      .flatMap((p) => p.comments)
      .filter((c) => {
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      });
  }, [commentsData?.pages]);

  const handleSend = useCallback(
    (text: string) =>
      addComment({ text, currentCommentsCount: feedStore.getCommentsCount(postId, post?.commentsCount ?? 0) }),
    [addComment, postId, post?.commentsCount],
  );
  const handleCommentPress = useCallback(() => inputRef.current?.focus(), []);

  const commentsEmpty = !commentsLoading && comments.length === 0;

  const renderHeader = useCallback(
    () => (
      <PostDetailHeader
        post={post!}
        commentsLoading={commentsLoading}
        commentsEmpty={commentsEmpty}
        onCommentPress={handleCommentPress}
      />
    ),
    [post, commentsLoading, commentsEmpty, handleCommentPress],
  );

  const renderComment: ListRenderItem<Comment> = useCallback(
    ({ item }) => (
      <View style={styles.commentItem}>
        <CommentItem comment={item} />
      </View>
    ),
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
          ListHeaderComponent={renderHeader}
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

        <View style={[styles.inputBar, { paddingBottom: insets.bottom || Spacing.sm }]}>
          <InputBar
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
  commentItem: { padding: Spacing.sm },
  inputBar: { backgroundColor: Colors.background },
});
