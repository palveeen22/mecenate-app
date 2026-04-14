import { CommentIcon, HeartIcon } from '@/assets/icons';
import { Colors, Radius, Spacing, Typography } from '@/shared/design';
import { formatCount } from '@/shared/lib/format';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
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
  const commentsCount = feedStore.getCommentsCount(post.id, post.commentsCount);

  const scale = useSharedValue(1);
  const flyY = useSharedValue(0);
  const flyScale = useSharedValue(0);
  const flyOpacity = useSharedValue(0);

  const pillAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const flyAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: flyY.value },
      { scale: flyScale.value },
    ],
    opacity: flyOpacity.value,
  }));

  const callLikePost = (postId: string, currentIsLiked: boolean, currentCount: number) => {
    likePost({ postId, currentIsLiked, currentCount });
  };

  const likeGesture = Gesture.Tap().onEnd((_, success) => {
    'worklet';
    if (!success) return;

    cancelAnimation(scale);
    scale.value = withSequence(
      withSpring(0.88, { damping: 15, stiffness: 500 }),
      withSpring(1, { damping: 15, stiffness: 500 }),
    );

    if (!isLiked) {
      flyY.value = 0;
      flyScale.value = 0;
      flyOpacity.value = 0;

      flyScale.value = withSequence(
        withSpring(1.6, { damping: 8, stiffness: 300 }),
        withTiming(1.2, { duration: 200 }),
        withTiming(0.8, { duration: 300 }),
      );
      flyY.value = withTiming(-56, { duration: 650 });
      flyOpacity.value = withSequence(
        withTiming(1, { duration: 80 }),
        withTiming(1, { duration: 370 }),
        withTiming(0, { duration: 200 }),
      );
    }

    runOnJS(callLikePost)(post.id, isLiked, likesCount);
  });

  return (
    <View style={styles.row}>
      <GestureDetector gesture={likeGesture}>
        <Animated.View style={[styles.btn, isLiked && styles.btnLiked, pillAnimStyle]}>
          <HeartIcon size={16} color={isLiked ? Colors.white : Colors.icon} filled={isLiked} />
          <Text style={[styles.count, isLiked && styles.countLiked]}>
            {formatCount(likesCount)}
          </Text>
          <Animated.View style={[styles.flyIcon, flyAnimStyle]}>
            <HeartIcon size={22} color={Colors.like} filled />
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      <Pressable
        style={({ pressed }: { pressed: boolean }) => [
          styles.btn,
          pressed && styles.btnPressed,
        ]}
        onPress={onCommentPress}
      >
        <CommentIcon size={15} color={Colors.icon} />
        <Text style={styles.count}>{formatCount(commentsCount)}</Text>
      </Pressable>
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
    paddingBottom: 6,
    paddingHorizontal: 12,
    gap: Spacing.xs,
    backgroundColor: Colors.actionDefault,
    overflow: 'visible',
  },
  btnLiked: { backgroundColor: Colors.like },
  btnPressed: { backgroundColor: Colors.actionPressed },
    btnLike: {
    minWidth: 63,
  },
  count: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.icon,
  },
  countLiked: { color: Colors.white },
  flyIcon: {
    position: 'absolute',
    left: 10,
    bottom: 0,
    pointerEvents: 'none',
  },
});