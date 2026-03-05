import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { initLore } from "./init.ts";
import { createTome } from "./tomes.ts";
import { writeEntry, readEntries } from "./tome.ts";

describe("entry operations", () => {
  let lorePath: string;
  let tempDir: string;

  beforeEach(async () => {
    tempDir = join(tmpdir(), `lore-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    lorePath = await initLore(tempDir);
    await createTome(lorePath, "auth");
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  describe("writeEntry", () => {
    test("defaults to type progress and empty tags", async () => {
      const entry = await writeEntry(lorePath, "auth", "test content");
      expect(entry.type).toBe("progress");
      expect(entry.tags).toEqual([]);
      expect(entry.content).toBe("test content");
      expect(entry.id).toBeDefined();
      expect(entry.timestamp).toBeDefined();
    });

    test("persists with explicit type and tags", async () => {
      await writeEntry(lorePath, "auth", "JWT decision", "decision", ["jwt", "auth"]);
      const entries = await readEntries(lorePath, "auth");

      expect(entries.length).toBe(1);
      expect(entries[0]!.type).toBe("decision");
      expect(entries[0]!.tags).toEqual(["jwt", "auth"]);
      expect(entries[0]!.content).toBe("JWT decision");
    });

    test("appends entries without clobbering existing ones", async () => {
      await writeEntry(lorePath, "auth", "first", "progress");
      await writeEntry(lorePath, "auth", "second", "decision");
      await writeEntry(lorePath, "auth", "third", "pattern");

      const entries = await readEntries(lorePath, "auth");
      expect(entries.length).toBe(3);
      expect(entries[0]!.content).toBe("first");
      expect(entries[1]!.content).toBe("second");
      expect(entries[2]!.content).toBe("third");
    });

    test("throws when tome does not exist", async () => {
      await expect(writeEntry(lorePath, "nonexistent", "content")).rejects.toThrow("not found");
    });
  });

  describe("readEntries", () => {
    beforeEach(async () => {
      // Seed with diverse entries for filtering tests
      await writeEntry(lorePath, "auth", "Using JWT over cookies", "decision", ["jwt", "auth"]);
      await writeEntry(lorePath, "auth", "Login endpoint done", "progress", ["auth"]);
      await writeEntry(lorePath, "auth", "Rate limiter before middleware", "pattern", ["middleware", "security"]);
      await writeEntry(lorePath, "auth", "Don't use dayjs", "mistake", ["date", "library"]);
      await writeEntry(lorePath, "auth", "Should we split monolith?", "question", ["architecture"]);
    });

    test("returns all entries when no filters", async () => {
      const entries = await readEntries(lorePath, "auth");
      expect(entries.length).toBe(5);
    });

    test("filters by types", async () => {
      const decisions = await readEntries(lorePath, "auth", { types: ["decision"] });
      expect(decisions.length).toBe(1);
      expect(decisions[0]!.content).toBe("Using JWT over cookies");

      const progressAndPattern = await readEntries(lorePath, "auth", { types: ["progress", "pattern"] });
      expect(progressAndPattern.length).toBe(2);
    });

    test("filters by tags with OR logic", async () => {
      const jwtOrMiddleware = await readEntries(lorePath, "auth", { tags: ["jwt", "middleware"] });
      expect(jwtOrMiddleware.length).toBe(2);
      expect(jwtOrMiddleware.some(e => e.content === "Using JWT over cookies")).toBe(true);
      expect(jwtOrMiddleware.some(e => e.content === "Rate limiter before middleware")).toBe(true);
    });

    test("filters by tags excludes untagged entries", async () => {
      // Create an untagged entry
      await writeEntry(lorePath, "auth", "untagged entry", "reference");

      const tagged = await readEntries(lorePath, "auth", { tags: ["jwt"] });
      expect(tagged.every(e => e.tags.length > 0)).toBe(true);
      expect(tagged.every(e => e.tags.includes("jwt"))).toBe(true);
    });

    test("filters by since timestamp", async () => {
      // Add a slight delay to ensure timestamps differ, or use explicit timestamps
      const older = "2024-01-01T00:00:00.000Z";
      const middle = "2024-06-01T00:00:00.000Z";
      const newer = "2024-12-01T00:00:00.000Z";

      // Create a tome and manually seed it with explicit timestamps
      const tomePath = join(lorePath, "tomes", "auth.json");
      const data = {
        entries: [
          { id: "a", timestamp: older, type: "progress", content: "old entry", tags: [] },
          { id: "b", timestamp: middle, type: "decision", content: "middle entry", tags: [] },
          { id: "c", timestamp: newer, type: "pattern", content: "new entry", tags: [] },
        ],
      };
      await Bun.write(tomePath, JSON.stringify(data));

      const recent = await readEntries(lorePath, "auth", { since: middle });
      expect(recent.length).toBe(2);
      expect(recent[0]!.content).toBe("middle entry");
      expect(recent[1]!.content).toBe("new entry");
    });

    test("filters by last N", async () => {
      const last2 = await readEntries(lorePath, "auth", { last: 2 });
      expect(last2.length).toBe(2);
      expect(last2[0]!.content).toBe("Don't use dayjs");
      expect(last2[1]!.content).toBe("Should we split monolith?");
    });

    test("combines multiple filters", async () => {
      // Types: decision, progress, pattern, mistake, question
      // Filter by types [decision, progress, pattern] and last: 2
      const filtered = await readEntries(lorePath, "auth", {
        types: ["decision", "progress", "pattern"],
        last: 2
      });

      // Should get progress and pattern (decision is first, so filtered out by last: 2)
      expect(filtered.length).toBe(2);
      expect(filtered[0]!.content).toBe("Login endpoint done");
      expect(filtered[1]!.content).toBe("Rate limiter before middleware");
    });

    test("returns empty array when nothing matches filters", async () => {
      const empty = await readEntries(lorePath, "auth", { types: ["reference"] });
      expect(empty).toEqual([]);
    });
  });
});
