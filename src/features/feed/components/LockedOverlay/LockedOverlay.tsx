import { PaidIcon } from "@/assets/icons";
import { Button, Colors, Radius, Spacing, Typography } from "@/src/shared/design";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  blurImageUrl?: string;
  onDonate?: () => void;
};

export function LockedOverlay({ blurImageUrl, onDonate }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={[StyleSheet.absoluteFill, styles.fallback]} />

      {blurImageUrl && (
        <Image
          source={{ uri: blurImageUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
      )}

      <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <PaidIcon size={20} color={Colors.white} />
        </View>

        <Text style={styles.title}>
          Контент скрыт пользователем.{"\n"}Доступ откроется после доната
        </Text>

        <Button
          label="Отправить донат"
          onPress={onDonate}
          size="md"
          style={styles.donateBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 420,
    overflow: "hidden",
  },
  fallback: {
    backgroundColor: "#2A1A4A",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: Radius.sm + 2,
    backgroundColor: Colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.medium,
    color: Colors.white,
    textAlign: "center",
    lineHeight: Typography.size.md * Typography.lineHeight.normal,
  },
  donateBtn: {
    marginTop: Spacing.sm,
    width: "80%",
    alignSelf: "center",
  },
});
