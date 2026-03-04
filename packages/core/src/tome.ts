import { join } from "node:path";
import { slugify, readTomes, writeTomes, findTome } from "./store.ts";

export async function readTome(lorePath: string, tomeId: string): Promise<string> {
  const tomes = await readTomes(lorePath);
  const tome = findTome(tomes, tomeId);

  const tomeFile = Bun.file(join(lorePath, "tomes", `${slugify(tome.name)}.md`));
  if (!(await tomeFile.exists())) return "";
  return tomeFile.text();
}

export async function writeTome(lorePath: string, tomeId: string, content: string): Promise<void> {
  const tomes = await readTomes(lorePath);
  const tome = findTome(tomes, tomeId);

  const tomePath = join(lorePath, "tomes", `${slugify(tome.name)}.md`);
  const tomeFile = Bun.file(tomePath);

  const existing = (await tomeFile.exists()) ? await tomeFile.text() : "";
  const timestamp = new Date().toISOString();
  const entry = `${existing ? existing + "\n" : ""}## ${timestamp}\n\n${content}\n`;

  await Bun.write(tomePath, entry);

  // Update tome's updatedAt
  tome.updatedAt = new Date().toISOString();
  await writeTomes(lorePath, tomes);
}
