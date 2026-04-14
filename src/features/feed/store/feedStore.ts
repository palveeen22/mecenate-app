import { makeAutoObservable } from 'mobx';

class FeedStore {
  likedPosts: Map<string, boolean> = new Map();
  likeCounts: Map<string, number> = new Map();
  commentCounts: Map<string, number> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  setLikeState(postId: string, isLiked: boolean, likesCount: number) {
    this.likedPosts.set(postId, isLiked);
    this.likeCounts.set(postId, likesCount);
  }

  optimisticLike(postId: string, currentIsLiked: boolean, currentCount: number) {
    const newLiked = !currentIsLiked;
    const newCount = newLiked ? currentCount + 1 : currentCount - 1;
    this.likedPosts.set(postId, newLiked);
    this.likeCounts.set(postId, newCount);
  }

  getIsLiked(postId: string, fallback: boolean): boolean {
    return this.likedPosts.has(postId) ? (this.likedPosts.get(postId) as boolean) : fallback;
  }

  getLikesCount(postId: string, fallback: number): number {
    return this.likeCounts.has(postId) ? (this.likeCounts.get(postId) as number) : fallback;
  }

  getCommentsCount(postId: string, fallback: number): number {
    return this.commentCounts.has(postId) ? (this.commentCounts.get(postId) as number) : fallback;
  }

  incrementCommentsCount(postId: string, currentCount: number) {
    const current = this.commentCounts.has(postId)
      ? (this.commentCounts.get(postId) as number)
      : currentCount;
    this.commentCounts.set(postId, current + 1);
  }
}

export const feedStore = new FeedStore();
