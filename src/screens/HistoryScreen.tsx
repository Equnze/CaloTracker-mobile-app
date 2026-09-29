import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenShell } from "../components/ScreenShell";
import { eatenOf, formatCount, formatLongDay } from "../dates";
import { useLog } from "../LogContext";
import { colors, fonts, stripeColors } from "../theme";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "History">;

export function HistoryScreen({ navigation }: Props) {
  const { state, todayKey } = useLog();
  const days = Object.keys(state.entries)
    .filter((date) => (state.entries[date]?.length ?? 0) > 0)
    .sort((a, b) => b.localeCompare(a));

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          accessibilityLabel="Back to today"
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <Text style={styles.backText}>← Today</Text>
        </Pressable>
        <Text style={styles.title}>Past days</Text>
        <Text style={styles.subtitle}>
          Each new day starts fresh. Older logs stay on this phone.
        </Text>

        {days.length === 0 ? (
          <Text style={styles.empty}>Nothing logged yet. Today’s foods will show up here.</Text>
        ) : (
          <View style={styles.list}>
            {days.map((date, index) => {
              const list = state.entries[date] ?? [];
              const eaten = eatenOf(list);
              const left = state.goal - eaten;
              const over = left < 0;
              const title = date === todayKey ? "Today" : formatLongDay(date);
              return (
                <Pressable
                  key={date}
                  accessibilityLabel={`Open ${title}`}
                  onPress={() => navigation.navigate("Day", { date })}
                  style={({ pressed }) => [styles.card, pressed && styles.pressed]}
                >
                  <View
                    style={[
                      styles.stripe,
                      { backgroundColor: stripeColors[index % stripeColors.length] },
                    ]}
                  />
                  <View style={styles.copy}>
                    <Text style={styles.day}>{title}</Text>
                    <Text style={styles.meta}>
                      {list.length} {list.length === 1 ? "food" : "foods"} · {formatCount(eaten)} eaten
                    </Text>
                  </View>
                  <Text style={[styles.left, over && styles.leftOver]}>
                    {over ? `${formatCount(Math.abs(left))} over` : `${formatCount(left)} left`}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  back: {
    alignSelf: "flex-start",
    marginTop: 8,
    marginBottom: 12,
  },
  backText: {
    color: colors.cyan,
    fontFamily: fonts.bodyBlack,
    fontSize: 16,
  },
  title: {
    color: colors.gold,
    fontFamily: fonts.display,
    fontSize: 36,
  },
  subtitle: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 15,
    marginTop: 6,
    marginBottom: 18,
    lineHeight: 21,
  },
  empty: {
    color: colors.ink,
    fontFamily: fonts.bodyStrong,
    fontSize: 16,
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 14,
    paddingRight: 14,
    overflow: "hidden",
  },
  stripe: {
    width: 7,
    alignSelf: "stretch",
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  day: {
    color: colors.ink,
    fontFamily: fonts.bodyBlack,
    fontSize: 16,
  },
  meta: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    marginTop: 3,
  },
  left: {
    color: colors.mint,
    fontFamily: fonts.bodyBlack,
    fontSize: 13,
    maxWidth: 96,
    textAlign: "right",
  },
  leftOver: {
    color: colors.over,
  },
  pressed: {
    opacity: 0.75,
  },
});
