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
  readTome,
  writeTome,
  completeTome,
  deleteTome,
} from "@lore/core";

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
    description: "List all tomes. Optionally filter by status.",
    inputSchema: {
      directory: z.string().describe("Project root directory"),
      status: z
        .enum(["active", "completed"])
        .optional()
        .describe("Filter by tome status"),
    },
  },
  async ({ directory, status }) => {
    const lorePath = findLorePath(directory);
    let tomes = await listTomes(lorePath);
    if (status) {
      tomes = tomes.filter((t) => t.status === status);
    }
    return {
      content: [{ type: "text", text: JSON.stringify(tomes, null, 2) }],
    };
  },
);

server.registerTool(
  "show",
  {
    description: "Show a tome's details and its contents.",
    inputSchema: {
      directory: z.string().describe("Project root directory"),
      name: z.string().describe("Tome name"),
    },
  },
  async ({ directory, name }) => {
    const lorePath = findLorePath(directory);
    const tome = await getTome(lorePath, name);
    const entries = await readTome(lorePath, tome.id);

    const output = [
      `Name:    ${tome.name}`,
      `ID:      ${tome.id}`,
      `Status:  ${tome.status}`,
      `Created: ${tome.createdAt}`,
      `Updated: ${tome.updatedAt}`,
      "",
      entries ? `--- Entries ---\n\n${entries}` : "No entries yet.",
    ].join("\n");

    return { content: [{ type: "text", text: output }] };
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
      content: [
        { type: "text", text: `Created tome: ${tome.name} (${tome.id})` },
      ],
    };
  },
);

server.registerTool(
  "write",
  {
    description: "Append an entry to a tome.",
    inputSchema: {
      directory: z.string().describe("Project root directory"),
      name: z.string().describe("Tome name"),
      content: z.string().describe("Content to append"),
    },
  },
  async ({ directory, name, content }) => {
    const lorePath = findLorePath(directory);
    const tome = await getTome(lorePath, name);
    await writeTome(lorePath, tome.id, content);
    return {
      content: [{ type: "text", text: `Entry appended to: ${tome.name}` }],
    };
  },
);

server.registerTool(
  "complete",
  {
    description: "Mark a tome as completed.",
    inputSchema: {
      directory: z.string().describe("Project root directory"),
      name: z.string().describe("Tome name"),
    },
  },
  async ({ directory, name }) => {
    const lorePath = findLorePath(directory);
    const tome = await getTome(lorePath, name);
    await completeTome(lorePath, tome.id);
    return {
      content: [{ type: "text", text: `Completed: ${tome.name}` }],
    };
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
    const tome = await getTome(lorePath, name);
    await deleteTome(lorePath, tome.id);
    return {
      content: [{ type: "text", text: `Deleted: ${tome.name}` }],
    };
  },
);

// --- Start ---

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Lore MCP server running on stdio");
