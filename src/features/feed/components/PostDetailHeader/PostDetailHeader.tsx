import { Colors, Radius, Spacing, Typography } from '@/src/shared/design';
import { formatDate } from '@/src/shared/lib/format';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Post } from '../../types';
import { CommentSkeleton } from '../CommentSkeleton';
import { PostActions } from '../PostActions';
import { PostAuthorRow } from '../PostAuthorRow';

type Props = {
  post: Post;
  commentsLoading: boolean;
  commentsEmpty: boolean;
  onCommentPress: () => void;
};

export const PostDetailHeader = React.memo(function PostDetailHeader({
  post,
  commentsLoading,
  commentsEmpty,
  onCommentPress,
}: Props) {
  return (
    <View>
      <PostAuthorRow
        author={post.author} />

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
          <PostActions post={post} onCommentPress={onCommentPress} />
        </View>
      </View>

      <View style={styles.commentsHeader}>
        <Text style={styles.commentsTitle}>Комментарии</Text>
        <Text style={styles.commentsCount}>{post.commentsCount}</Text>
      </View>

      {commentsLoading && <CommentSkeleton />}

      {commentsEmpty && (
        <View style={styles.commentsEmpty}>
          <Ionicons name="chatbubble-outline" size={32} color={Colors.textMuted} />
          <Text style={styles.commentsEmptyText}>Будьте первым, кто оставит комментарий</Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
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
});
