import { Colors, Radius, Spacing, Typography } from '@/shared/design';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Comment } from '../../types';

type Props = { comment: Comment };

export const CommentItem = React.memo(function CommentItem({ comment }: Props) {
  return (
    <View style={styles.item}>
      {comment.author.avatarUrl ? (
        <Image
          source={{ uri: comment.author.avatarUrl }}
          style={styles.avatar}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Text style={styles.avatarInitial}>
            {comment.author.displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.author}>{comment.author.displayName}</Text>
        <Text style={styles.text}>{comment.text}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
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
  avatarFallback: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    color: Colors.white,
  },
  content: { flex: 1, gap: 4 },
  author: {
    fontSize: Typography.size.sm + 1,
    fontWeight: Typography.weight.semibold,
    color: Colors.text,
  },
  text: {
    fontSize: Typography.size.sm,
    color: Colors.text,
    lineHeight: Typography.size.sm * 1.5,
  },
});
