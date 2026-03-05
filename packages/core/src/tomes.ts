import { join } from "node:path";
import { readdirSync } from "node:fs";
import { unlink } from "node:fs/promises";
import type { Tome, TomeFile } from "./types.ts";
import { slugify, tomePath, readTomeFile, writeTomeFile } from "./store.ts";

export async function createTome(lorePath: string, name: string): Promise<Tome> {
  const slug = slugify(name);
  if (!slug) throw new Error("Tome name cannot be empty");

  const file = Bun.file(tomePath(lorePath, slug));
  if (await file.exists()) {
    throw new Error(`Tome "${slug}" already exists`);
  }

  const data: TomeFile = { entries: [] };
  await writeTomeFile(lorePath, slug, data);

  return { name: slug, entries: [] };
}

export async function getTome(lorePath: string, name: string): Promise<Tome> {
  const slug = slugify(name);
  const data = await readTomeFile(lorePath, slug);
  return { name: slug, entries: data.entries };
}

export type TomeSummary = {
  name: string;
  entryCount: number;
};

export async function listTomes(lorePath: string): Promise<TomeSummary[]> {
  const tomesDir = join(lorePath, "tomes");

  let files: string[];
  try {
    files = readdirSync(tomesDir);
  } catch {
    return [];
  }

  const summaries: TomeSummary[] = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const slug = file.replace(/\.json$/, "");
    try {
      const data = await readTomeFile(lorePath, slug);
      summaries.push({ name: slug, entryCount: data.entries.length });
    } catch {
      // skip malformed files
    }
  }

  return summaries;
}

export async function deleteTome(lorePath: string, name: string): Promise<void> {
  const slug = slugify(name);
  const path = tomePath(lorePath, slug);

  const file = Bun.file(path);
  if (!(await file.exists())) {
    throw new Error(`Tome "${slug}" not found`);
  }

  await unlink(path);
}
