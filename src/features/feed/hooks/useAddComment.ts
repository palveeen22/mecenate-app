import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feedApi } from '../api/feedApi';

export function useAddComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => feedApi.addComment(postId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
}