import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { localDateKey, makeId } from "./dates";
import { freshState, loadState, saveState } from "./storage";
import type { LogState } from "./types";

type LogContextValue = {
  ready: boolean;
  state: LogState;
  todayKey: string;
  setPerson: (person: string) => void;
  trimPerson: () => void;
  setGoal: (goal: number) => void;
  addFood: (name: string, calories: number) => void;
  removeFood: (date: string, id: string) => void;
};

const LogContext = createContext<LogContextValue | null>(null);

export function LogProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<LogState>(freshState);
  const todayKey = localDateKey();

  useEffect(() => {
    let active = true;
    loadState().then((next) => {
      if (!active) return;
      setState(next);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const commit = useCallback((recipe: (prev: LogState) => LogState) => {
    setState((prev) => {
      const next = recipe(prev);
      void saveState(next);
      return next;
    });
  }, []);

  const value = useMemo<LogContextValue>(
    () => ({
      ready,
      state,
      todayKey,
      setPerson: (person) => commit((prev) => ({ ...prev, person })),
      trimPerson: () =>
        commit((prev) => ({ ...prev, person: prev.person.trim() })),
      setGoal: (goal) => commit((prev) => ({ ...prev, goal })),
      addFood: (name, calories) =>
        commit((prev) => {
          const list = prev.entries[todayKey] ?? [];
          return {
            ...prev,
            entries: {
              ...prev.entries,
              [todayKey]: [
                ...list,
                {
                  id: makeId(),
                  name,
                  calories,
                  at: new Date().toISOString(),
                },
              ],
            },
          };
        }),
      removeFood: (date, id) =>
        commit((prev) => {
          const list = (prev.entries[date] ?? []).filter((item) => item.id !== id);
          const entries = { ...prev.entries };
          if (list.length === 0) delete entries[date];
          else entries[date] = list;
          return { ...prev, entries };
        }),
    }),
    [commit, ready, state, todayKey],
  );

  return <LogContext.Provider value={value}>{children}</LogContext.Provider>;
}

export function useLog() {
  const value = useContext(LogContext);
  if (!value) throw new Error("useLog must be used inside LogProvider");
  return value;
}
