import { apiClient } from '@/src/shared/api';
import { ApiResponse } from '@/src/shared/types';
import { Comment, CommentsPage, Post, PostsPage } from '../types';

type GetPostsParams = {
  limit?: number;
  cursor?: string;
  tier?: 'free' | 'paid';
};

export const feedApi = {
  getPosts: async (params: GetPostsParams = {}): Promise<PostsPage> => {
    const query = new URLSearchParams();
    if (params.limit) query.set('limit', String(params.limit));
    if (params.cursor) query.set('cursor', params.cursor);
    if (params.tier) query.set('tier', params.tier);

    const qs = query.toString();
    const path = `/posts${qs ? `?${qs}` : ''}`;

    const res = await apiClient.get<ApiResponse<PostsPage>>(path);
    if (!res.ok) throw new Error(res.error.message);
    return res.data;
  },

  likePost: async (id: string): Promise<{ isLiked: boolean; likesCount: number }> => {
    const res = await apiClient.post<ApiResponse<{ isLiked: boolean; likesCount: number }>>(
      `/posts/${id}/like`,
    );
    if (!res.ok) throw new Error(res.error.message);
    return res.data;
  },

  getPost: async (id: string): Promise<Post> => {
    const res = await apiClient.get<ApiResponse<{ post: Post }>>(`/posts/${id}`);
    if (!res.ok) throw new Error(res.error.message);
    return res.data.post;
  },

  getComments: async (postId: string, cursor?: string): Promise<CommentsPage> => {
    const query = new URLSearchParams();
    query.set('limit', '20');
    if (cursor) query.set('cursor', cursor);
    const res = await apiClient.get<ApiResponse<CommentsPage>>(
      `/posts/${postId}/comments?${query.toString()}`,
    );
    if (!res.ok) throw new Error(res.error.message);
    return res.data;
  },

  addComment: async (postId: string, text: string): Promise<Comment> => {
    const res = await apiClient.post<ApiResponse<{ comment: Comment }>>(
      `/posts/${postId}/comments`,
      { text },
    );
    if (!res.ok) throw new Error(res.error.message);
    return res.data.comment;
  },
};
