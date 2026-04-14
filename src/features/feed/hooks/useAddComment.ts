import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedApi } from '../api/feedApi';
import { feedStore } from '../store';
import { CommentsPage } from '../types';

type AddCommentVars = { text: string; currentCommentsCount: number };

export function useAddComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ text }: AddCommentVars) => feedApi.addComment(postId, text),
    onSuccess: (newComment, { currentCommentsCount }) => {
      feedStore.incrementCommentsCount(postId, currentCommentsCount);
      queryClient.setQueryData<InfiniteData<CommentsPage>>(
        ['comments', postId],
        (old) => {
          if (!old) return old;
          const [firstPage, ...rest] = old.pages;
          return {
            ...old,
            pages: [
              {
                ...firstPage,
                comments: [
                  newComment,
                  ...firstPage.comments.filter((c) => c.id !== newComment.id),
                ],
              },
              ...rest.map((p) => ({
                ...p,
                comments: p.comments.filter((c) => c.id !== newComment.id),
              })),
            ],
          };
        },
      );
    },
  });
}