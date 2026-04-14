import { Colors, Spacing } from "@/shared/design";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function NavBar() {
  return (
    <View style={styles.navBar}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
        <Ionicons name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.surfaceBorder,
  },
  backBtn: { padding: Spacing.xs },
})