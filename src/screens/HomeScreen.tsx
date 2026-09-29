import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FoodList } from "../components/FoodList";
import { ScreenShell } from "../components/ScreenShell";
import { eatenOf, formatCount, formatDayLabel } from "../dates";
import { useLog } from "../LogContext";
import { colors, fonts } from "../theme";
import type { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const { state, todayKey, setPerson, trimPerson, setGoal, addFood, removeFood } =
    useLog();
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");
  const [goalText, setGoalText] = useState(String(state.goal));

  const list = state.entries[todayKey] ?? [];
  const eaten = eatenOf(list);
  const left = state.goal - eaten;
  const over = left < 0;
  const person = state.person.trim();
  const label = person
    ? over
      ? `over today for ${person}`
      : `left today for ${person}`
    : over
      ? "over today"
      : "left today";
  const pct = state.goal > 0 ? Math.min(100, (eaten / state.goal) * 100) : 0;

  function commitGoal() {
    const next = Math.round(Number(goalText));
    if (!Number.isFinite(next) || next < 1) {
      setGoalText(String(state.goal));
      return;
    }
    setGoal(next);
    setGoalText(String(next));
  }

  function onAdd() {
    const name = food.trim();
    const kcal = Math.round(Number(calories));
    if (!name || !Number.isFinite(kcal) || kcal < 1) return;
    addFood(name, kcal);
    setFood("");
    setCalories("");
  }

  return (
    <ScreenShell>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Calotrak</Text>
            <Text style={styles.date}>{formatDayLabel(todayKey)}</Text>
          </View>
          <Pressable
            accessibilityLabel="Open past days"
            onPress={() => navigation.navigate("History")}
            style={({ pressed }) => [styles.historyButton, pressed && styles.pressed]}
          >
            <Text style={styles.historyText}>Past days</Text>
          </Pressable>
        </View>

        <View style={styles.personCard}>
          <Text style={styles.personLabel}>Person</Text>
          <TextInput
            value={state.person}
            onChangeText={setPerson}
            onBlur={trimPerson}
            placeholder="Enter a name"
            placeholderTextColor="#7ED7EA"
            maxLength={60}
            autoComplete="name"
            style={styles.personInput}
          />
        </View>

        <View style={styles.hero}>
          <Text style={[styles.remaining, over && styles.remainingOver]}>
            {formatCount(Math.abs(left))}
          </Text>
          <Text style={styles.remainingLabel}>{label}</Text>
        </View>

        <View style={styles.meter}>
          <LinearGradient
            colors={over ? [colors.over, colors.coral] : [colors.mint, colors.gold, colors.coral]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.meterFill, { width: `${pct}%` }]}
          />
        </View>

        <View style={styles.goalRow}>
          <Text style={styles.eaten}>{formatCount(eaten)} eaten</Text>
          <View style={styles.goalChip}>
            <Text style={styles.goalLabel}>Daily goal</Text>
            <TextInput
              value={goalText}
              onChangeText={setGoalText}
              onBlur={commitGoal}
              onSubmitEditing={commitGoal}
              keyboardType="number-pad"
              inputMode="numeric"
              accessibilityLabel="Daily calorie goal"
              style={styles.goalInput}
            />
          </View>
        </View>

        <View style={styles.form}>
          <TextInput
            value={food}
            onChangeText={setFood}
            placeholder="What did you eat?"
            placeholderTextColor="#CDB8EA"
            maxLength={80}
            style={styles.input}
          />
          <TextInput
            value={calories}
            onChangeText={setCalories}
            placeholder="kcal"
            placeholderTextColor="#CDB8EA"
            keyboardType="number-pad"
            inputMode="numeric"
            accessibilityLabel="Calories"
            style={styles.input}
          />
          <Pressable
            accessibilityLabel="Add food"
            onPress={onAdd}
            style={({ pressed }) => [pressed && styles.pressed]}
          >
            <LinearGradient
              colors={[colors.magenta, colors.coral]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.add}
            >
              <Text style={styles.addText}>Add</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {list.length === 0 ? (
          <Text style={styles.empty}>Nothing logged yet.</Text>
        ) : (
          <FoodList items={list} onRemove={(id) => removeFood(todayKey, id)} />
        )}

        <Text style={styles.note}>Saved on this phone. Nothing leaves this device.</Text>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
    marginBottom: 18,
  },
  brand: {
    color: colors.gold,
    fontFamily: fonts.display,
    fontSize: 34,
    letterSpacing: -0.6,
  },
  date: {
    color: colors.cyan,
    fontFamily: fonts.bodyStrong,
    fontSize: 15,
    marginTop: 2,
  },
  historyButton: {
    backgroundColor: "rgba(255, 79, 163, 0.2)",
    borderColor: colors.magenta,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 8,
  },
  historyText: {
    color: "#FFD0EA",
    fontFamily: fonts.bodyStrong,
    fontSize: 14,
  },
  personCard: {
    backgroundColor: colors.person,
    borderColor: colors.personLine,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
  },
  personLabel: {
    color: colors.cyan,
    fontFamily: fonts.bodyBlack,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  personInput: {
    color: "#E9FBFF",
    fontFamily: fonts.bodyStrong,
    fontSize: 18,
    backgroundColor: "rgba(8, 28, 36, 0.45)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2E8EA3",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  hero: {
    alignItems: "center",
    marginTop: 4,
  },
  remaining: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 84,
    lineHeight: 88,
    letterSpacing: -2,
    fontVariant: ["tabular-nums"],
  },
  remainingOver: {
    color: colors.over,
  },
  remainingLabel: {
    color: colors.muted,
    fontFamily: fonts.bodyStrong,
    fontSize: 16,
    textAlign: "center",
    marginTop: 4,
  },
  meter: {
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,248,238,0.12)",
    overflow: "hidden",
    marginTop: 18,
    marginBottom: 16,
  },
  meterFill: {
    height: "100%",
    borderRadius: 999,
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  eaten: {
    color: colors.mint,
    fontFamily: fonts.bodyBlack,
    fontSize: 16,
    flexShrink: 0,
  },
  goalChip: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    gap: 8,
    backgroundColor: colors.goal,
    borderColor: colors.goalLine,
    borderWidth: 1,
    borderRadius: 14,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
  },
  goalLabel: {
    color: "#FFC2B3",
    fontFamily: fonts.bodyStrong,
    fontSize: 13,
  },
  goalInput: {
    width: 72,
    color: colors.gold,
    fontFamily: fonts.bodyBlack,
    fontSize: 16,
    textAlign: "right",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  form: {
    gap: 10,
    marginBottom: 8,
  },
  input: {
    color: colors.ink,
    fontFamily: fonts.bodyStrong,
    fontSize: 16,
    backgroundColor: "rgba(255,248,238,0.08)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  add: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },
  addText: {
    color: "#FFF8EE",
    fontFamily: fonts.bodyBlack,
    fontSize: 18,
  },
  empty: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 16,
    textAlign: "center",
    marginTop: 22,
    marginBottom: 8,
  },
  note: {
    color: "#B9A4D6",
    fontFamily: fonts.body,
    fontSize: 13,
    textAlign: "center",
    marginTop: 22,
  },
  pressed: {
    opacity: 0.75,
  },
});
