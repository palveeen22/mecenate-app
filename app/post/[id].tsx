import { PostDetailScreen } from '@/features/feed/screens';
import { useLocalSearchParams } from 'expo-router';

export default function PostDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PostDetailScreen postId={id} />;
}
