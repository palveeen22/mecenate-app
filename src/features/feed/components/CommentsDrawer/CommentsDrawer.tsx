import { Colors, Radius, Spacing, Typography } from '@/shared/design';
import { InputBar } from '@/shared/ui/InputBar';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAddComment } from '../../hooks/useAddComment';
import { useComments } from '../../hooks/useComments';
import { Comment } from '../../types';
import { CommentItem } from '../CommentItem';
import { CommentSkeleton } from '../CommentSkeleton';

type Props = {
  postId: string;
  commentsCount: number;
  visible: boolean;
  onClose: () => void;
};

export function CommentsDrawer({ postId, commentsCount, visible, onClose }: Props) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const footerHeight = 56 + (insets.bottom > 0 ? insets.bottom : Spacing.sm) + 1;

  const snapPoints = useMemo(() => ['60%', '92%'], []);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useComments(postId);
  const { mutate: addComment, isPending } = useAddComment(postId);

  const comments = useMemo(() => {
    const seen = new Set<string>();
    return (data?.pages ?? [])
      .flatMap((p) => p.comments)
      .filter((c) => {
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      });
  }, [data?.pages]);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleSheetChanges = useCallback(
    (index: number) => { if (index === -1) onClose(); },
    [onClose],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    [],
  );

  const handleSend = useCallback((text: string) => addComment(text), [addComment]);

  const renderItem = useCallback(
    ({ item }: { item: Comment }) => <CommentItem comment={item} />,
    [],
  );

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props}>
        <View style={[
          styles.inputBar,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : Spacing.sm }
        ]}>
          <View style={styles.separator} />
          <InputBar
            onSend={handleSend}
            isPending={isPending}
            placeholder="Добавьте комментарий..."
            TextInputComponent={BottomSheetTextInput}
          />
        </View>
      </BottomSheetFooter>
    ),
    [handleSend, isPending, insets.bottom],
  );

  if (!visible) return null;

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onClose={onClose}
        enablePanDownToClose
        topInset={insets.top}
        backdropComponent={renderBackdrop}
        footerComponent={renderFooter}
        handleIndicatorStyle={styles.handle}
        backgroundStyle={styles.background}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Комментарии</Text>
          <Text style={styles.count}>{commentsCount}</Text>
        </View>

        {isLoading ? (
          <CommentSkeleton />
        ) : comments.length === 0 ? (
          <View style={styles.centered}>
            <Ionicons name="chatbubble-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Будьте первым, кто оставит комментарий</Text>
          </View>
        ) : (
          <BottomSheetFlatList
            data={comments}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: footerHeight + Spacing.md }
            ]}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              isFetchingNextPage
                ? <ActivityIndicator color={Colors.primary} style={{ padding: Spacing.md }} />
                : null
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </BottomSheet>
    </Portal>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.surfaceElevated,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.surfaceBorder,
  },
  title: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.text,
  },
  count: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.textMuted,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  inputBar: {
    backgroundColor: Colors.background,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.surfaceBorder,
  },
});