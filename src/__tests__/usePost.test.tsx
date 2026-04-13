import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { feedApi } from '../features/feed/api/feedApi';
import { usePost } from '../features/feed/hooks/usePost';

jest.mock('../features/feed/api/feedApi');

const mockPost = {
  id: 'post_1',
  author: {
    id: 'author_1',
    username: 'test',
    displayName: 'Test',
    avatarUrl: '',
    bio: '',
    subscribersCount: 0,
    isVerified: false,
  },
  title: 'Test',
  body: 'Body',
  preview: 'Preview',
  coverUrl: '',
  likesCount: 0,
  commentsCount: 0,
  isLiked: false,
  tier: 'free' as const,
  createdAt: '2024-01-01T00:00:00Z',
};

let queryClient: QueryClient;

function wrapper({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
});

afterEach(() => {
  queryClient.clear();
  jest.clearAllMocks();
});

describe('usePost', () => {
  it('fetches post by id', async () => {
    (feedApi.getPost as jest.Mock).mockResolvedValue(mockPost);
    const { result } = renderHook(() => usePost('post_1'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe('post_1');
    expect(feedApi.getPost).toHaveBeenCalledWith('post_1');
  });

  it('does not fetch when id is empty', () => {
    const { result } = renderHook(() => usePost(''), { wrapper });
    expect(result.current.fetchStatus).toBe('idle');
    expect(feedApi.getPost).not.toHaveBeenCalled();
  });

  it('sets isError on failure', async () => {
    (feedApi.getPost as jest.Mock).mockRejectedValue(new Error('Not found'));
    const { result } = renderHook(() => usePost('post_999'), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
