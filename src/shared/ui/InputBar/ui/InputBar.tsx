import { SendIcon } from "@/assets/icons";
import { Colors, Radius, Spacing, Typography } from "@/shared/design";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  onSend: (text: string) => void;
  isPending: boolean;
  placeholder?: string;
  TextInputComponent?: React.ComponentType<any>;
  inputRef?: React.RefObject<TextInput | null>;
};

export const InputBar = React.memo(function InputBar({
  onSend,
  isPending,
  placeholder = "Написать...",
  TextInputComponent = TextInput,
  inputRef,
}: Props) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || isPending) return;
    onSend(trimmed);
    setText("");
  }, [text, isPending, onSend]);

  return (
    <View style={styles.row}>
      <View style={[styles.pill, focused && styles.pillFocused]}>
        <TextInputComponent
          ref={inputRef}
          style={[styles.input, { color: text.length > 0 ? Colors.black : Colors.iconLight }]}
          placeholder={placeholder}
          placeholderTextColor={focused ? Colors.iconLight : Colors.icon}
          value={text}
          onChangeText={setText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline
          maxLength={500}
          returnKeyType="default"
          blurOnSubmit={false}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={isPending || text.trim().length === 0}
          activeOpacity={0.7}
          style={[styles.sendBtn, { opacity: text.trim().length > 0 ? 1 : 0 }]}
        >
          {isPending ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <SendIcon size={18} color={Colors.primary} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 20,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.md,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surfaceElevated,
    gap: 6,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.transparent,
  },
  pillFocused: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderWidth: 2,
  },
  input: {
    flex: 1,
    fontSize: Typography.size.sm,
    paddingVertical: 0,
  },
  sendBtn: {
    flexShrink: 0,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
