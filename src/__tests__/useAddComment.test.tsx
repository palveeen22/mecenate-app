import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { feedApi } from '../features/feed/api/feedApi';
import { useAddComment } from '../features/feed/hooks/useAddComment';

jest.mock('../features/feed/api/feedApi');

const mockComment = {
  id: 'comment_1',
  postId: 'post_1',
  author: {
    id: 'author_1',
    username: 'test',
    displayName: 'Test',
    avatarUrl: '',
    bio: '',
    subscribersCount: 0,
    isVerified: false,
  },
  text: 'Hello!',
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
      mutations: { retry: false },
    },
  });
});

afterEach(() => {
  queryClient.clear();
  jest.clearAllMocks();
});

describe('useAddComment', () => {
  it('calls feedApi.addComment with postId and text', async () => {
    (feedApi.addComment as jest.Mock).mockResolvedValue(mockComment);
    const { result } = renderHook(() => useAddComment('post_1'), { wrapper });
    act(() => { result.current.mutate('Hello!'); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(feedApi.addComment).toHaveBeenCalledWith('post_1', 'Hello!');
  });

  it('sets isError when API fails', async () => {
    (feedApi.addComment as jest.Mock).mockRejectedValue(new Error('Validation failed'));
    const { result } = renderHook(() => useAddComment('post_1'), { wrapper });
    act(() => { result.current.mutate(''); });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
