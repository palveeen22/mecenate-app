import { feedStore } from '../features/feed/store/feedStore';

beforeEach(() => {
  // Reset store state between tests
  feedStore.likedPosts.clear();
  feedStore.likeCounts.clear();
});

describe('feedStore.getIsLiked', () => {
  it('returns fallback when post not in store', () => {
    expect(feedStore.getIsLiked('post_1', true)).toBe(true);
    expect(feedStore.getIsLiked('post_1', false)).toBe(false);
  });

  it('returns stored value when present', () => {
    feedStore.likedPosts.set('post_1', true);
    expect(feedStore.getIsLiked('post_1', false)).toBe(true);
  });
});

describe('feedStore.getLikesCount', () => {
  it('returns fallback when post not in store', () => {
    expect(feedStore.getLikesCount('post_1', 42)).toBe(42);
  });

  it('returns stored value when present', () => {
    feedStore.likeCounts.set('post_1', 99);
    expect(feedStore.getLikesCount('post_1', 0)).toBe(99);
  });
});

describe('feedStore.optimisticLike', () => {
  it('toggles liked from false to true, increments count', () => {
    feedStore.optimisticLike('post_1', false, 10);
    expect(feedStore.getIsLiked('post_1', false)).toBe(true);
    expect(feedStore.getLikesCount('post_1', 0)).toBe(11);
  });

  it('toggles liked from true to false, decrements count', () => {
    feedStore.optimisticLike('post_1', true, 10);
    expect(feedStore.getIsLiked('post_1', true)).toBe(false);
    expect(feedStore.getLikesCount('post_1', 0)).toBe(9);
  });
});

describe('feedStore.setLikeState', () => {
  it('sets exact values from server response', () => {
    feedStore.setLikeState('post_1', true, 15);
    expect(feedStore.getIsLiked('post_1', false)).toBe(true);
    expect(feedStore.getLikesCount('post_1', 0)).toBe(15);
  });

  it('overwrites previous optimistic state', () => {
    feedStore.optimisticLike('post_1', false, 10);
    // Server sends back corrected state
    feedStore.setLikeState('post_1', false, 10);
    expect(feedStore.getIsLiked('post_1', true)).toBe(false);
    expect(feedStore.getLikesCount('post_1', 0)).toBe(10);
  });
});
