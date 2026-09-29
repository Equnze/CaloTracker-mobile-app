import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Entry, LogState } from "./types";

const KEY = "calotrak";

export function freshState(): LogState {
  return { goal: 2000, person: "", entries: {} };
}

function isEntry(item: unknown): item is Entry {
  if (!item || typeof item !== "object") return false;
  const entry = item as Partial<Entry>;
  return (
    typeof entry.id === "string" &&
    typeof entry.name === "string" &&
    typeof entry.calories === "number" &&
    Number.isFinite(entry.calories) &&
    typeof entry.at === "string"
  );
}

export function normalizeState(data: unknown): LogState {
  if (!data || typeof data !== "object") return freshState();
  const raw = data as Record<string, unknown>;
  const goal = Math.round(Number(raw.goal));
  const entries: Record<string, Entry[]> = {};

  if (raw.entries && typeof raw.entries === "object") {
    for (const [date, value] of Object.entries(raw.entries as Record<string, unknown>)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Array.isArray(value)) continue;
      const list = value.filter(isEntry);
      if (list.length > 0) entries[date] = list;
    }
  }

  return {
    goal: Number.isFinite(goal) && goal > 0 ? goal : 2000,
    person: typeof raw.person === "string" ? raw.person : "",
    entries,
  };
}

export async function loadState() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return freshState();
    return normalizeState(JSON.parse(raw));
  } catch {
    return freshState();
  }
}

export async function saveState(state: LogState) {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
