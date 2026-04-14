import { EmptyState } from '@/shared/ui/EmptyState';
import React from 'react';

type Props = {
  onRetry: () => void;
};

export function FeedError({ onRetry }: Props) {
  return (
    <EmptyState
      title="Не удалось загрузить публикацию"
      buttonLabel="Повторить"
      onPress={onRetry}
    />
  );
}