#!/usr/bin/env bun

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  findLorePath,
  listTasks,
  getTask,
  createTask,
  getMemory,
  appendMemory,
  completeTask,
  deleteTask,
} from "@lore/core";

const server = new McpServer({
  name: "lore",
  version: "0.1.0",
});

// --- Tools ---

server.registerTool(
  "lore_list",
  {
    description: "List all tasks. Optionally filter by status.",
    inputSchema: {
      directory: z.string().describe("Project root directory"),
      status: z
        .enum(["active", "completed"])
        .optional()
        .describe("Filter by task status"),
    },
  },
  async ({ directory, status }) => {
    const lorePath = findLorePath(directory);
    let tasks = await listTasks(lorePath);
    if (status) {
      tasks = tasks.filter((t) => t.status === status);
    }
    return {
      content: [{ type: "text", text: JSON.stringify(tasks, null, 2) }],
    };
  },
);

server.registerTool(
  "lore_show",
  {
    description: "Show a task's details and its memory.",
    inputSchema: {
      directory: z.string().describe("Project root directory"),
      name: z.string().describe("Task name"),
    },
  },
  async ({ directory, name }) => {
    const lorePath = findLorePath(directory);
    const task = await getTask(lorePath, name);
    const memory = await getMemory(lorePath, task.id);

    const output = [
      `Name:    ${task.name}`,
      `ID:      ${task.id}`,
      `Status:  ${task.status}`,
      `Created: ${task.createdAt}`,
      `Updated: ${task.updatedAt}`,
      "",
      memory ? `--- Memory ---\n\n${memory}` : "No memory yet.",
    ].join("\n");

    return { content: [{ type: "text", text: output }] };
  },
);

server.registerTool(
  "lore_create",
  {
    description: "Create a new task.",
    inputSchema: {
      directory: z.string().describe("Project root directory"),
      name: z.string().describe("Task name"),
    },
  },
  async ({ directory, name }) => {
    const lorePath = findLorePath(directory);
    const task = await createTask(lorePath, name);
    return {
      content: [
        { type: "text", text: `Created task: ${task.name} (${task.id})` },
      ],
    };
  },
);

server.registerTool(
  "lore_memory",
  {
    description: "Append a memory entry to a task.",
    inputSchema: {
      directory: z.string().describe("Project root directory"),
      name: z.string().describe("Task name"),
      content: z.string().describe("Memory content to append"),
    },
  },
  async ({ directory, name, content }) => {
    const lorePath = findLorePath(directory);
    const task = await getTask(lorePath, name);
    await appendMemory(lorePath, task.id, content);
    return {
      content: [{ type: "text", text: `Memory appended to: ${task.name}` }],
    };
  },
);

server.registerTool(
  "lore_complete",
  {
    description: "Mark a task as completed.",
    inputSchema: {
      directory: z.string().describe("Project root directory"),
      name: z.string().describe("Task name"),
    },
  },
  async ({ directory, name }) => {
    const lorePath = findLorePath(directory);
    const task = await getTask(lorePath, name);
    await completeTask(lorePath, task.id);
    return {
      content: [{ type: "text", text: `Completed: ${task.name}` }],
    };
  },
);

server.registerTool(
  "lore_delete",
  {
    description: "Delete a task and its memory.",
    inputSchema: {
      directory: z.string().describe("Project root directory"),
      name: z.string().describe("Task name"),
    },
  },
  async ({ directory, name }) => {
    const lorePath = findLorePath(directory);
    const task = await getTask(lorePath, name);
    await deleteTask(lorePath, task.id);
    return {
      content: [{ type: "text", text: `Deleted: ${task.name}` }],
    };
  },
);

// --- Start ---

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Lore MCP server running on stdio");
