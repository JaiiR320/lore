import { join } from "node:path";
import type { TomeFile } from "./types.ts";

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function tomePath(lorePath: string, slug: string): string {
  return join(lorePath, "tomes", `${slug}.json`);
}

export async function readTomeFile(lorePath: string, slug: string): Promise<TomeFile> {
  const file = Bun.file(tomePath(lorePath, slug));
  if (!(await file.exists())) {
    throw new Error(`Tome "${slug}" not found`);
  }
  return file.json();
}

export async function writeTomeFile(lorePath: string, slug: string, data: TomeFile): Promise<void> {
  await Bun.write(tomePath(lorePath, slug), JSON.stringify(data, null, 2));
}
