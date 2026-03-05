export const ENTRY_TYPES = ["decision", "progress", "pattern", "mistake", "reference", "question"] as const;
export type EntryType = (typeof ENTRY_TYPES)[number];

export type Entry = {
  id: string;
  timestamp: string;
  type: EntryType;
  content: string;
  tags: string[];
};

export type TomeFile = {
  entries: Entry[];
};

export type Tome = {
  name: string;
  entries: Entry[];
};
