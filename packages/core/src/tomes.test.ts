import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { mkdirSync, rmdirSync, existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { initLore } from "./init.ts";
import { findLorePath } from "./find-lore.ts";
import { createTome, getTome, listTomes, deleteTome } from "./tomes.ts";
import { writeEntry } from "./tome.ts";

describe("initLore", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = join(tmpdir(), `lore-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    mkdirSync(tempDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  test("creates .lore/tomes/ directory and .gitignore with .lore entry", async () => {
    const lorePath = await initLore(tempDir);
    expect(lorePath).toBe(join(tempDir, ".lore"));
    expect(existsSync(join(lorePath, "tomes"))).toBe(true);
    
    const gitignore = await Bun.file(join(tempDir, ".gitignore")).text();
    expect(gitignore).toContain(".lore");
  });

  test("appends to existing .gitignore without duplicating .lore", async () => {
    const gitignorePath = join(tempDir, ".gitignore");
    await Bun.write(gitignorePath, "node_modules\n");
    
    await initLore(tempDir);
    
    const content = await Bun.file(gitignorePath).text();
    const matches = content.match(/\.lore/g);
    expect(matches?.length).toBe(1);
    expect(content).toContain("node_modules");
    expect(content).toContain(".lore");
  });
});

describe("findLorePath", () => {
  let tempDir: string;
  let nestedDir: string;

  beforeEach(async () => {
    tempDir = join(tmpdir(), `lore-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    nestedDir = join(tempDir, "packages", "core", "src");
    mkdirSync(nestedDir, { recursive: true });
    mkdirSync(join(tempDir, ".lore", "tomes"), { recursive: true });
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  test("finds .lore in the given directory", () => {
    const lorePath = findLorePath(tempDir);
    expect(lorePath).toBe(join(tempDir, ".lore"));
  });

  test("walks up to find .lore in ancestor directory", () => {
    const lorePath = findLorePath(nestedDir);
    expect(lorePath).toBe(join(tempDir, ".lore"));
  });

  test("throws when no .lore directory exists", () => {
    const dir = join(tmpdir(), `no-lore-${Date.now()}`);
    mkdirSync(dir, { recursive: true });
    
    try {
      expect(() => findLorePath(dir)).toThrow("No .lore/ directory found");
    } finally {
      rmdirSync(dir);
    }
  });
});

describe("tome lifecycle", () => {
  let lorePath: string;
  let tempDir: string;

  beforeEach(async () => {
    tempDir = join(tmpdir(), `lore-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    lorePath = await initLore(tempDir);
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  describe("createTome", () => {
    test("creates a JSON file with empty entries array", async () => {
      const tome = await createTome(lorePath, "Auth System");
      expect(tome.name).toBe("auth-system");
      expect(tome.entries).toEqual([]);
      
      const data = await Bun.file(join(lorePath, "tomes", "auth-system.json")).json();
      expect(data).toEqual({ entries: [] });
    });

    test("throws on duplicate tome name", async () => {
      await createTome(lorePath, "auth");
      expect(createTome(lorePath, "auth")).rejects.toThrow("already exists");
    });

    test("throws on empty tome name", async () => {
      expect(createTome(lorePath, "")).rejects.toThrow("cannot be empty");
      expect(createTome(lorePath, "   ")).rejects.toThrow("cannot be empty");
    });
  });

  describe("getTome", () => {
    test("returns tome with entries after writing", async () => {
      await createTome(lorePath, "auth");
      await writeEntry(lorePath, "auth", "test content", "progress");
      
      const tome = await getTome(lorePath, "auth");
      expect(tome.name).toBe("auth");
      expect(tome.entries.length).toBe(1);
      expect(tome.entries[0]!.content).toBe("test content");
    });

    test("throws when tome does not exist", async () => {
      expect(getTome(lorePath, "nonexistent")).rejects.toThrow("not found");
    });
  });

  describe("listTomes", () => {
    test("returns empty array when no tomes exist", async () => {
      const list = await listTomes(lorePath);
      expect(list).toEqual([]);
    });

    test("returns names and entry counts", async () => {
      await createTome(lorePath, "auth");
      await createTome(lorePath, "api");
      await writeEntry(lorePath, "auth", "entry 1", "progress");
      await writeEntry(lorePath, "auth", "entry 2", "decision");
      
      const list = await listTomes(lorePath);
      expect(list.length).toBe(2);
      
      const auth = list.find(t => t.name === "auth");
      const api = list.find(t => t.name === "api");
      expect(auth?.entryCount).toBe(2);
      expect(api?.entryCount).toBe(0);
    });

    test("skips non-JSON files in tomes directory", async () => {
      await createTome(lorePath, "auth");
      await Bun.write(join(lorePath, "tomes", "readme.md"), "# Tome");
      
      const list = await listTomes(lorePath);
      expect(list.length).toBe(1);
      expect(list[0]!.name).toBe("auth");
    });
  });

  describe("deleteTome", () => {
    test("removes the tome file", async () => {
      await createTome(lorePath, "auth");
      await deleteTome(lorePath, "auth");
      
      expect(listTomes(lorePath)).resolves.toEqual([]);
    });

    test("throws when tome does not exist", async () => {
      expect(deleteTome(lorePath, "nonexistent")).rejects.toThrow("not found");
    });
  });
});
