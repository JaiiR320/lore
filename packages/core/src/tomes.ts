import { join } from "node:path";
import type { Tome } from "./types.ts";
import { slugify, readTomes, writeTomes } from "./store.ts";

export async function getTome(lorePath: string, name: string): Promise<Tome> {
  const tomes = await readTomes(lorePath);
  const slug = slugify(name);
  const tome = tomes.find((t) => slugify(t.name) === slug);
  if (!tome) throw new Error(`Tome with name "${name}" not found`);
  return tome;
}

export async function createTome(lorePath: string, name: string): Promise<Tome> {
  const tomes = await readTomes(lorePath);
  const slug = slugify(name);

  if (tomes.some((t) => slugify(t.name) === slug)) {
    throw new Error(`Tome with name "${name}" already exists`);
  }

  const now = new Date().toISOString();
  const tome: Tome = {
    id: crypto.randomUUID(),
    name: slug,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  tomes.push(tome);
  await writeTomes(lorePath, tomes);

  // Create empty tome file
  const tomesDir = join(lorePath, "tomes");
  await Bun.write(join(tomesDir, `${slug}.md`), "");

  return tome;
}

export async function listTomes(lorePath: string): Promise<Tome[]> {
  return readTomes(lorePath);
}

export async function completeTome(lorePath: string, tomeId: string): Promise<void> {
  const tomes = await readTomes(lorePath);
  const tome = tomes.find((t) => t.id === tomeId);
  if (!tome) throw new Error(`Tome with id "${tomeId}" not found`);

  tome.status = "completed";
  tome.updatedAt = new Date().toISOString();
  await writeTomes(lorePath, tomes);
}

export async function deleteTome(lorePath: string, tomeId: string): Promise<void> {
  const tomes = await readTomes(lorePath);
  const index = tomes.findIndex((t) => t.id === tomeId);

  if (index === -1) {
    throw new Error(`Tome with id "${tomeId}" not found`);
  }

  const tome = tomes[index]!;
  tomes.splice(index, 1);
  await writeTomes(lorePath, tomes);

  // Delete tome file if it exists
  const tomeFile = join(lorePath, "tomes", `${slugify(tome.name)}.md`);
  const file = Bun.file(tomeFile);
  if (await file.exists()) {
    const { unlink } = await import("node:fs/promises");
    await unlink(tomeFile);
  }
}
