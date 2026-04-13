import { Colors, Radius, Spacing, Typography } from '@/src/shared/design';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  onSend: (text: string) => void;
  isPending: boolean;
  TextInputComponent?: typeof TextInput;
  inputRef?: React.RefObject<TextInput | null>; 
};

export const CommentInputBar = React.memo(function CommentInputBar({
  onSend,
  isPending,
  TextInputComponent = TextInput,
  inputRef,
}: Props) {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || isPending) return;
    onSend(trimmed);
    setText('');
  }, [text, isPending, onSend]);

  return (
    <View style={styles.row}>
      <View style={[styles.pill, focused && styles.pillFocused]}>
        <TextInputComponent
          ref={inputRef}
          style={styles.input}
          placeholder="Добавьте комментарий..."
          placeholderTextColor={Colors.textMuted}
          value={text}
          onChangeText={setText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline
          maxLength={500}
          returnKeyType="default"
          blurOnSubmit={false}
        />
        {text.trim().length > 0 && (
          <TouchableOpacity
            onPress={handleSend}
            disabled={isPending}
            activeOpacity={0.7}
            style={styles.sendBtn}
          >
            {isPending ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Ionicons name="arrow-up-circle" size={28} color={Colors.primary} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceElevated,
    gap: Spacing.xs,
    minHeight: 42,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: Colors.transparent,
  },
  pillFocused: {
    backgroundColor: Colors.background,
    borderColor: Colors.primary,
  },
  input: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: Colors.text,
    paddingVertical: 0,
    minHeight: 20,
    maxHeight: 80,
  },
  sendBtn: {
    flexShrink: 0,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
