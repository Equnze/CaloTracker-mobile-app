import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FoodList } from "../components/FoodList";
import { ScreenShell } from "../components/ScreenShell";
import { eatenOf, formatCount, formatLongDay, parseDateKey } from "../dates";
import { useLog } from "../LogContext";
import { colors, fonts } from "../theme";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Day">;

export function DayScreen({ navigation, route }: Props) {
  const { date } = route.params;
  const { state, todayKey, removeFood } = useLog();
  const valid = parseDateKey(date) !== null;
  const list = valid ? (state.entries[date] ?? []) : [];
  const eaten = eatenOf(list);
  const left = state.goal - eaten;
  const over = left < 0;
  const isToday = date === todayKey;
  const title = isToday ? "Today" : formatLongDay(date);

  return (
    <ScreenShell>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          accessibilityLabel="Back to past days"
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <Text style={styles.backText}>← Past days</Text>
        </Pressable>
        <Text style={styles.title}>{valid ? title : "Unknown day"}</Text>
        {valid && list.length > 0 ? (
          <>
            <Text style={[styles.summary, over && styles.summaryOver]}>
              {formatCount(eaten)} eaten ·{" "}
              {over
                ? `${formatCount(Math.abs(left))} over`
                : `${formatCount(left)} left`}
            </Text>
            <FoodList items={list} onRemove={(id) => removeFood(date, id)} />
            {isToday ? (
              <Text style={styles.note}>Add more food from the Today screen.</Text>
            ) : null}
          </>
        ) : (
          <Text style={styles.empty}>No foods saved for this day.</Text>
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
    fontSize: 32,
    marginBottom: 8,
  },
  summary: {
    color: colors.mint,
    fontFamily: fonts.bodyBlack,
    fontSize: 16,
    marginBottom: 14,
  },
  summaryOver: {
    color: colors.over,
  },
  empty: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 16,
    marginTop: 12,
  },
  note: {
    color: "#B9A4D6",
    fontFamily: fonts.body,
    fontSize: 13,
    textAlign: "center",
    marginTop: 18,
  },
  pressed: {
    opacity: 0.75,
  },
});
