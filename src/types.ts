export type Entry = {
  id: string;
  name: string;
  calories: number;
  at: string;
};

export type LogState = {
  goal: number;
  person: string;
  entries: Record<string, Entry[]>;
};

export type RootStackParamList = {
  Home: undefined;
  History: undefined;
  Day: { date: string };
};
