import { existsSync } from "node:fs";
import { join, dirname } from "node:path";

export function findLorePath(startDir?: string): string {
  let dir = startDir ?? process.cwd();

  while (true) {
    const candidate = join(dir, ".lore");
    if (existsSync(candidate)) return candidate;

    const parent = dirname(dir);
    if (parent === dir) {
      throw new Error("No .lore/ directory found. Run `lore init` first.");
    }
    dir = parent;
  }
}
