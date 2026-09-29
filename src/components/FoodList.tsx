import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatCount, formatTime } from "../dates";
import { colors, fonts, stripeColors } from "../theme";
import type { Entry } from "../types";

type Props = {
  items: Entry[];
  onRemove?: (id: string) => void;
};

export function FoodList({ items, onRemove }: Props) {
  const newestFirst = [...items].reverse();

  return (
    <View style={styles.list}>
      {newestFirst.map((item, index) => (
        <View key={item.id} style={styles.row}>
          <View
            style={[
              styles.stripe,
              { backgroundColor: stripeColors[index % stripeColors.length] },
            ]}
          />
          <View style={styles.food}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.time}>{formatTime(item.at)}</Text>
          </View>
          <Text style={styles.kcal}>{formatCount(item.calories)}</Text>
          {onRemove ? (
            <Pressable
              accessibilityLabel={`Remove ${item.name}`}
              onPress={() => onRemove(item.id)}
              style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
            >
              <Text style={styles.removeMark}>×</Text>
            </Pressable>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 8,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 12,
    paddingRight: 12,
    overflow: "hidden",
  },
  stripe: {
    width: 6,
    alignSelf: "stretch",
  },
  food: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: colors.ink,
    fontFamily: fonts.bodyStrong,
    fontSize: 16,
  },
  time: {
    color: colors.muted,
    fontFamily: fonts.body,
    fontSize: 13,
    marginTop: 2,
  },
  kcal: {
    color: colors.gold,
    fontFamily: fonts.bodyBlack,
    fontSize: 16,
    fontVariant: ["tabular-nums"],
  },
  remove: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 77, 109, 0.16)",
  },
  pressed: {
    opacity: 0.7,
  },
  removeMark: {
    color: colors.over,
    fontSize: 22,
    lineHeight: 24,
    fontFamily: fonts.bodyStrong,
  },
});
