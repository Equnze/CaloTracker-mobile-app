import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme";

export function ScreenShell({ children }: { children: ReactNode }) {
  return (
    <View style={styles.root}>
      <View style={[styles.blob, styles.pink]} />
      <View style={[styles.blob, styles.cyan]} />
      <View style={[styles.blob, styles.gold]} />
      <View style={[styles.blob, styles.mint]} />
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  safe: {
    flex: 1,
  },
  blob: {
    position: "absolute",
    borderRadius: 999,
  },
  pink: {
    width: 280,
    height: 280,
    backgroundColor: "#FF4FA3",
    opacity: 0.28,
    top: -80,
    right: -70,
  },
  cyan: {
    width: 220,
    height: 220,
    backgroundColor: "#49E1FF",
    opacity: 0.22,
    top: 180,
    left: -90,
  },
  gold: {
    width: 180,
    height: 180,
    backgroundColor: "#FFE56A",
    opacity: 0.16,
    bottom: 80,
    right: -40,
  },
  mint: {
    width: 160,
    height: 160,
    backgroundColor: "#3DFFB0",
    opacity: 0.14,
    bottom: -30,
    left: 30,
  },
});
