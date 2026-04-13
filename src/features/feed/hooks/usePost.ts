import { useQuery } from '@tanstack/react-query';
import { feedApi } from '../api';

export function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => feedApi.getPost(id),
    enabled: !!id,
  });
}
