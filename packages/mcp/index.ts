#!/usr/bin/env bun

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  findLorePath,
  initLore,
  listTomes,
  getTome,
  createTome,
  readEntries,
  writeEntry,
  deleteTome,
  ENTRY_TYPES,
} from "@lore/core";

const entryTypeEnum = z.enum(ENTRY_TYPES);

const server = new McpServer({
  name: "lore",
  version: "0.1.0",
});

// --- Tools ---

server.registerTool(
  "init",
  {
    description: "Initialize .lore/ in a project directory. Adds .lore to .gitignore.",
    inputSchema: {
      directory: z.string().describe("Project root directory"),
    },
  },
  async ({ directory }) => {
    await initLore(directory);
    return {
      content: [{ type: "text", text: `Initialized .lore/ in ${directory}` }],
    };
  },
);

server.registerTool(
  "list",
  {
    description: "List all tomes. Returns name and entry count for each tome.",
    inputSchema: {
      directory: z.string().describe("Project root directory"),
    },
  },
  async ({ directory }) => {
    const lorePath = findLorePath(directory);
    const tomes = await listTomes(lorePath);
    return {
      content: [{ type: "text", text: JSON.stringify(tomes, null, 2) }],
    };
  },
);

server.registerTool(
  "show",
  {
    description:
      "Show a tome's entries. Supports filtering by entry types, tags, recency, or count.",
    inputSchema: {
      directory: z.string().describe("Project root directory"),
      name: z.string().describe("Tome name"),
      types: z
        .array(entryTypeEnum)
        .optional()
        .describe("Filter by entry types (decision, progress, pattern, mistake, reference, question)"),
      tags: z
        .array(z.string())
        .optional()
        .describe("Filter by tags — returns entries matching any of the given tags"),
      since: z
        .string()
        .optional()
        .describe("Filter entries after this ISO timestamp"),
      last: z
        .number()
        .optional()
        .describe("Return only the last N entries (applied after other filters)"),
    },
  },
  async ({ directory, name, types, tags, since, last }) => {
    const lorePath = findLorePath(directory);
    const entries = await readEntries(lorePath, name, { types, tags, since, last });

    if (entries.length === 0) {
      return { content: [{ type: "text", text: "No entries found." }] };
    }

    const lines = entries.map((e) => {
      const tagStr = e.tags.length ? ` ${e.tags.map((t) => `#${t}`).join(" ")}` : "";
      return `[${e.type}] ${e.timestamp} — ${e.content}${tagStr}`;
    });

    return { content: [{ type: "text", text: lines.join("\n\n") }] };
  },
);

server.registerTool(
  "create",
  {
    description: "Create a new tome.",
    inputSchema: {
      directory: z.string().describe("Project root directory"),
      name: z.string().describe("Tome name"),
    },
  },
  async ({ directory, name }) => {
    const lorePath = findLorePath(directory);
    const tome = await createTome(lorePath, name);
    return {
      content: [{ type: "text", text: `Created tome: ${tome.name}` }],
    };
  },
);

server.registerTool(
  "write",
  {
    description: "Append a typed, tagged entry to a tome.",
    inputSchema: {
      directory: z.string().describe("Project root directory"),
      name: z.string().describe("Tome name"),
      content: z.string().describe("Content to append"),
      type: entryTypeEnum
        .optional()
        .describe("Entry type: decision, progress, pattern, mistake, reference, question. Defaults to progress."),
      tags: z
        .array(z.string())
        .optional()
        .describe("Tags for this entry — used for filtered retrieval later"),
    },
  },
  async ({ directory, name, content, type, tags }) => {
    const lorePath = findLorePath(directory);
    const entry = await writeEntry(lorePath, name, content, type, tags);
    return {
      content: [
        { type: "text", text: `Entry appended to ${name} [${entry.type}]` },
      ],
    };
  },
);

server.registerTool(
  "tags",
  {
    description: "List all tags used in a tome. Useful for discovering what tags are available before querying.",
    inputSchema: {
      directory: z.string().describe("Project root directory"),
      name: z.string().describe("Tome name"),
    },
  },
  async ({ directory, name }) => {
    const lorePath = findLorePath(directory);
    const entries = await readEntries(lorePath, name);
    const tags = [...new Set(entries.flatMap((e) => e.tags))].sort();

    if (tags.length === 0) {
      return { content: [{ type: "text", text: "No tags in this tome." }] };
    }

    return { content: [{ type: "text", text: tags.join(", ") }] };
  },
);

server.registerTool(
  "delete",
  {
    description: "Delete a tome.",
    inputSchema: {
      directory: z.string().describe("Project root directory"),
      name: z.string().describe("Tome name"),
    },
  },
  async ({ directory, name }) => {
    const lorePath = findLorePath(directory);
    await deleteTome(lorePath, name);
    return {
      content: [{ type: "text", text: `Deleted: ${name}` }],
    };
  },
);

// --- Start ---

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Lore MCP server running on stdio");
