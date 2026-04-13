import { feedApi } from '../features/feed/api/feedApi';

const BASE_URL = 'https://k8s.mectest.ru/test-app';
const AUTH_TOKEN = '550e8400-e29b-41d4-a716-446655440000';

const mockPost = {
  id: 'post_1',
  author: {
    id: 'author_1',
    username: 'test_user',
    displayName: 'Test User',
    avatarUrl: 'https://i.pravatar.cc/150?u=author_1',
    bio: 'Bio',
    subscribersCount: 100,
    isVerified: false,
  },
  title: 'Test Post',
  body: 'Test body content',
  preview: 'Test preview',
  coverUrl: 'https://picsum.photos/seed/post_1/800/450',
  likesCount: 10,
  commentsCount: 5,
  isLiked: false,
  tier: 'free' as const,
  createdAt: '2024-01-01T00:00:00Z',
};

const mockComment = {
  id: 'comment_1',
  postId: 'post_1',
  author: mockPost.author,
  text: 'Great post!',
  createdAt: '2024-01-01T01:00:00Z',
};

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

function mockFetch(body: unknown, status = 200) {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    json: () => Promise.resolve(body),
    status,
    ok: status >= 200 && status < 300,
  });
}

describe('feedApi.getPosts', () => {
  it('calls correct URL without params', async () => {
    mockFetch({ ok: true, data: { posts: [mockPost], nextCursor: null, hasMore: false } });
    await feedApi.getPosts();
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/posts`,
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: `Bearer ${AUTH_TOKEN}` }),
      }),
    );
  });

  it('appends cursor and limit query params', async () => {
    mockFetch({ ok: true, data: { posts: [], nextCursor: null, hasMore: false } });
    await feedApi.getPosts({ limit: 5, cursor: 'post_5' });
    const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toContain('limit=5');
    expect(url).toContain('cursor=post_5');
  });

  it('appends tier query param', async () => {
    mockFetch({ ok: true, data: { posts: [], nextCursor: null, hasMore: false } });
    await feedApi.getPosts({ tier: 'free' });
    const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toContain('tier=free');
  });

  it('returns posts page on success', async () => {
    const page = { posts: [mockPost], nextCursor: 'post_10', hasMore: true };
    mockFetch({ ok: true, data: page });
    const result = await feedApi.getPosts();
    expect(result.posts).toHaveLength(1);
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).toBe('post_10');
  });

  it('throws on API error response', async () => {
    mockFetch({ ok: false, error: { code: 'INTERNAL_ERROR', message: 'Server error' } });
    await expect(feedApi.getPosts()).rejects.toThrow('Server error');
  });
});

describe('feedApi.getPost', () => {
  it('calls correct URL', async () => {
    mockFetch({ ok: true, data: { post: mockPost } });
    await feedApi.getPost('post_1');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/posts/post_1`,
      expect.anything(),
    );
  });

  it('returns post from nested data.post', async () => {
    mockFetch({ ok: true, data: { post: mockPost } });
    const result = await feedApi.getPost('post_1');
    expect(result.id).toBe('post_1');
    expect(result.title).toBe('Test Post');
  });

  it('throws on not found', async () => {
    mockFetch({ ok: false, error: { code: 'NOT_FOUND', message: 'Post not found' } });
    await expect(feedApi.getPost('post_999')).rejects.toThrow('Post not found');
  });
});

describe('feedApi.likePost', () => {
  it('sends POST to correct URL', async () => {
    mockFetch({ ok: true, data: { isLiked: true, likesCount: 11 } });
    await feedApi.likePost('post_1');
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`${BASE_URL}/posts/post_1/like`);
    expect(options.method).toBe('POST');
  });

  it('returns toggled like state', async () => {
    mockFetch({ ok: true, data: { isLiked: true, likesCount: 11 } });
    const result = await feedApi.likePost('post_1');
    expect(result.isLiked).toBe(true);
    expect(result.likesCount).toBe(11);
  });
});

describe('feedApi.getComments', () => {
  it('calls correct URL with default limit', async () => {
    mockFetch({ ok: true, data: { comments: [], nextCursor: null, hasMore: false } });
    await feedApi.getComments('post_1');
    const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toContain('/posts/post_1/comments');
    expect(url).toContain('limit=20');
  });

  it('appends cursor when provided', async () => {
    mockFetch({ ok: true, data: { comments: [], nextCursor: null, hasMore: false } });
    await feedApi.getComments('post_1', 'comment_20');
    const url = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(url).toContain('cursor=comment_20');
  });

  it('returns comments page', async () => {
    mockFetch({ ok: true, data: { comments: [mockComment], nextCursor: null, hasMore: false } });
    const result = await feedApi.getComments('post_1');
    expect(result.comments).toHaveLength(1);
    expect(result.comments[0].id).toBe('comment_1');
  });
});

describe('feedApi.addComment', () => {
  it('sends POST with text body', async () => {
    mockFetch({ ok: true, data: { comment: mockComment } });
    await feedApi.addComment('post_1', 'Hello!');
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(`${BASE_URL}/posts/post_1/comments`);
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({ text: 'Hello!' });
  });

  it('returns created comment', async () => {
    mockFetch({ ok: true, data: { comment: mockComment } });
    const result = await feedApi.addComment('post_1', 'Hello!');
    expect((result as any).id).toBe('comment_1');
  });

  it('throws on validation error', async () => {
    mockFetch({ ok: false, error: { code: 'VALIDATION_ERROR', message: 'Text required' } });
    await expect(feedApi.addComment('post_1', '')).rejects.toThrow('Text required');
  });
});
