import { existsSync, mkdirSync, readFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";

export async function initLore(directory: string): Promise<string> {
  const lorePath = join(directory, ".lore");
  mkdirSync(join(lorePath, "tomes"), { recursive: true });

  if (!existsSync(join(lorePath, "tomes.json"))) {
    await Bun.write(join(lorePath, "tomes.json"), "[]");
  }

  // Add .lore to .gitignore if not already there
  const gitignorePath = join(directory, ".gitignore");
  if (existsSync(gitignorePath)) {
    const content = readFileSync(gitignorePath, "utf-8");
    if (!content.split("\n").some((line) => line.trim() === ".lore")) {
      appendFileSync(gitignorePath, "\n.lore\n");
    }
  } else {
    await Bun.write(gitignorePath, ".lore\n");
  }

  return lorePath;
}
