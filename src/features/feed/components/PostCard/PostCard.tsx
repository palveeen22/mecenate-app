import { Colors, Radius, Spacing, Typography } from '@/shared/design';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Post } from '../../types';
import { LockedOverlay } from '../LockedOverlay';
import { PostActions } from '../PostActions';
import { PostAuthorRow } from '../PostAuthorRow';

type Props = {
  post: Post;
  onCommentPress: (postId: string, commentsCount: number) => void;
};

const LINE_HEIGHT = Typography.size.sm * Typography.lineHeight.relaxed;

export const PostCard = observer(function PostCard({ post, onCommentPress }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <PostAuthorRow author={post.author} />

      {post.tier === 'paid' ? (
        <>
          <LockedOverlay blurImageUrl={post.coverUrl} onDonate={() => {}} />
          <View style={styles.body}>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonLine} />
          </View>
        </>
      ) : (
        <>
          {post.coverUrl ? (
            <TouchableOpacity activeOpacity={0.92} onPress={() => router.push(`/post/${post.id}`)}>
              <Image
                source={{ uri: post.coverUrl }}
                style={styles.cover}
                contentFit="cover"
                transition={300}
              />
            </TouchableOpacity>
          ) : null}

          <View style={styles.body}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.push(`/post/${post.id}`)}>
              <Text style={styles.title} numberOfLines={2}>
                {post.title}
              </Text>
            </TouchableOpacity>

            <View style={styles.previewWrap}>
              <Text
                style={styles.preview}
                numberOfLines={expanded ? undefined : 2}
                ellipsizeMode="clip"
                allowFontScaling={false}
              >
                {post.preview || post.body}
              </Text>
              {!expanded && (
                <View style={styles.showMoreWrap}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.fadeGradient}
                  />
                  <Text onPress={() => setExpanded(true)} style={styles.showMore}>
                    Показать еще
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.footer}>
              <PostActions
                post={post}
                onCommentPress={() => onCommentPress(post.id, post.commentsCount)}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
  },
  cover: {
    width: '100%',
    height: 393,
    backgroundColor: Colors.surfaceElevated,
  },
  body: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.xs,
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.text,
    lineHeight: Typography.size.lg * Typography.lineHeight.tight,
  },
  preview: {
    fontSize: Typography.size.md,
    color: Colors.text,
    lineHeight: LINE_HEIGHT,
  },
  previewWrap: { position: 'relative' },
  showMoreWrap: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    height: LINE_HEIGHT,
  },
  fadeGradient: { width: 60, height: LINE_HEIGHT },
  showMore: {
    fontSize: Typography.size.md,
    color: Colors.primary,
    backgroundColor: Colors.background,
    lineHeight: LINE_HEIGHT,
  },
  footer: {
    marginTop: Spacing.xs,
  },
  skeletonTitle: {
    height: 26,
    width: '45%',
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceElevated,
    marginBottom: Spacing.sm,
  },
  skeletonLine: {
    height: 40,
    width: '100%',
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceElevated,
  },
});
