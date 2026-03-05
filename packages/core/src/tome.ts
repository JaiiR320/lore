import type { Entry, EntryType } from "./types.ts";
import { slugify, readTomeFile, writeTomeFile } from "./store.ts";

export type EntryFilters = {
  types?: EntryType[];
  tags?: string[];
  since?: string;
  last?: number;
};

export async function readEntries(lorePath: string, name: string, filters?: EntryFilters): Promise<Entry[]> {
  const slug = slugify(name);
  const data = await readTomeFile(lorePath, slug);

  let entries = data.entries;

  if (filters?.types?.length) {
    entries = entries.filter((e) => filters.types!.includes(e.type));
  }

  if (filters?.tags?.length) {
    entries = entries.filter((e) => e.tags.some((t) => filters.tags!.includes(t)));
  }

  if (filters?.since) {
    const since = filters.since;
    entries = entries.filter((e) => e.timestamp >= since);
  }

  if (filters?.last) {
    entries = entries.slice(-filters.last);
  }

  return entries;
}

export async function writeEntry(
  lorePath: string,
  name: string,
  content: string,
  type: EntryType = "progress",
  tags: string[] = [],
): Promise<Entry> {
  const slug = slugify(name);
  const data = await readTomeFile(lorePath, slug);

  const entry: Entry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    type,
    content,
    tags,
  };

  data.entries.push(entry);
  await writeTomeFile(lorePath, slug, data);

  return entry;
}
