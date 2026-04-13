import { useInfiniteQuery } from '@tanstack/react-query';
import { feedApi } from '../api';

const PAGE_SIZE = 10;

export function useFeed(tier?: 'free' | 'paid') {
  return useInfiniteQuery({
    queryKey: ['feed', tier],
    queryFn: ({ pageParam }) =>
      feedApi.getPosts({
        limit: PAGE_SIZE,
        cursor: pageParam as string | undefined,
        tier,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined),
  });
}
