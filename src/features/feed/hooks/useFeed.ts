import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { feedApi } from '../api';

export type FeedTier = 'free' | 'paid';

const PAGE_SIZE = 10;

export function useFeed(tier?: FeedTier) {
  return useInfiniteQuery({
    queryKey: ['feed', tier] as const,
    queryFn: ({ pageParam }) =>
      feedApi.getPosts({ limit: PAGE_SIZE, cursor: pageParam, tier }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
  });
}