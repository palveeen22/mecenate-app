import { useInfiniteQuery } from '@tanstack/react-query';
import { feedApi } from '../api/feedApi';

export function useComments(postId: string) {
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      feedApi.getComments(postId, pageParam),
    getNextPageParam: (last) => last.hasMore ? last.nextCursor ?? undefined : undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!postId,
  });
}