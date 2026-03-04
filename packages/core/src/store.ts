import { join } from "node:path";
import type { Tome } from "./types.ts";

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function readTomes(lorePath: string): Promise<Tome[]> {
  const file = Bun.file(join(lorePath, "tomes.json"));
  if (!(await file.exists())) return [];
  return file.json();
}

export async function writeTomes(lorePath: string, tomes: Tome[]): Promise<void> {
  await Bun.write(join(lorePath, "tomes.json"), JSON.stringify(tomes, null, 2));
}

export function findTome(tomes: Tome[], tomeId: string): Tome {
  const tome = tomes.find((t) => t.id === tomeId);
  if (!tome) throw new Error(`Tome with id "${tomeId}" not found`);
  return tome;
}
