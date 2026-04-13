import { CommentIcon, HeartIcon } from '@/assets/icons';
import { Colors, Radius, Spacing, Typography } from '@/src/shared/design';
import { formatCount } from '@/src/shared/lib/format';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useLikePost } from '../../hooks';
import { feedStore } from '../../store';
import { Post } from '../../types';

type Props = {
  post: Post;
  onCommentPress: () => void;
};

export const PostActions = observer(function PostActions({ post, onCommentPress }: Props) {
  const { mutate: likePost } = useLikePost();
  const isLiked = feedStore.getIsLiked(post.id, post.isLiked);
  const likesCount = feedStore.getLikesCount(post.id, post.likesCount);

  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handleLike = () => {
    cancelAnimation(scale);
    scale.value = 1;
    scale.value = withSequence(
      withSpring(0.88, { damping: 15, stiffness: 500 }),
      withSpring(1, { damping: 15, stiffness: 500 }),
    );
    likePost({ postId: post.id, currentIsLiked: isLiked, currentCount: likesCount });
  };

  const likeGesture = Gesture.Tap().runOnJS(true).onEnd(() => handleLike());

  return (
    <View style={styles.row}>
      <GestureDetector gesture={likeGesture}>
        <Animated.View style={[styles.btn, isLiked && styles.btnLiked, animStyle]}>
          <HeartIcon size={17} color={isLiked ? Colors.white : Colors.icon} filled={isLiked} />
          <Text style={[styles.count, isLiked && styles.countLiked]}>
            {formatCount(likesCount)}
          </Text>
        </Animated.View>
      </GestureDetector>

      <TouchableOpacity style={styles.btn} activeOpacity={0.8} onPress={onCommentPress}>
        <CommentIcon size={15} color={Colors.icon} />
        <Text style={styles.count}>{formatCount(post.commentsCount)}</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    borderRadius: Radius.full,
    paddingTop: 6,
    paddingRight: 12,
    paddingBottom: 6,
    paddingLeft: 10,
    gap: Spacing.xs,
    backgroundColor: Colors.actionDefault,
  },
  btnLiked: { backgroundColor: Colors.like },
  count: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
    color: Colors.icon,
  },
  countLiked: { color: Colors.white },
});
