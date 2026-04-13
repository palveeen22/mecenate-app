import { useMutation } from '@tanstack/react-query';
import { feedStore } from '../store';
import { feedApi } from '../api';

export function useLikePost() {
  return useMutation({
    mutationFn: ({ postId }: { postId: string; currentIsLiked: boolean; currentCount: number }) =>
      feedApi.likePost(postId),
    onMutate: ({ postId, currentIsLiked, currentCount }) => {
      feedStore.optimisticLike(postId, currentIsLiked, currentCount);
    },
    onSuccess: (data, { postId }) => {
      // Reconcile with server truth — no query invalidation needed.
      // feedStore drives the UI; a full feed refetch would trigger RefreshControl.
      feedStore.setLikeState(postId, data.isLiked, data.likesCount);
    },
    onError: (_err, { postId, currentIsLiked, currentCount }) => {
      feedStore.setLikeState(postId, currentIsLiked, currentCount);
    },
  });
}
