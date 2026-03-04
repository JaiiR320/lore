#!/usr/bin/env bun

import { existsSync, mkdirSync, readFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";
import {
  createTask,
  getTask,
  listTasks,
  completeTask,
  deleteTask,
  getMemory,
  appendMemory,
  findLorePath,
} from "@lore/core";

const args = Bun.argv.slice(2);
const command = args[0];

function usage() {
  console.log(`Usage: lore <command>

Commands:
  init                     Initialize .lore/ in current directory
  create <name>            Create a new task
  list                     List all tasks
  show <name>              Show task details and memory
  memory <name> <content>  Append memory to a task
  complete <name>          Mark a task as completed
  delete <name>            Delete a task and its memory`);
}

try {
  switch (command) {
    case "init": {
      const lorePath = join(process.cwd(), ".lore");
      mkdirSync(join(lorePath, "memory"), { recursive: true });
      if (!existsSync(join(lorePath, "tasks.json"))) {
        await Bun.write(join(lorePath, "tasks.json"), "[]");
      }

      // Add .lore to .gitignore if not already there
      const gitignorePath = join(process.cwd(), ".gitignore");
      if (existsSync(gitignorePath)) {
        const content = readFileSync(gitignorePath, "utf-8");
        if (!content.split("\n").some((line) => line.trim() === ".lore")) {
          appendFileSync(gitignorePath, "\n.lore\n");
        }
      } else {
        await Bun.write(gitignorePath, ".lore\n");
      }

      console.log("Initialized .lore/");
      break;
    }

    case "create": {
      const name = args.slice(1).join(" ");
      if (!name) throw new Error("Usage: lore create <name>");
      const lorePath = findLorePath();
      const task = await createTask(lorePath, name);
      console.log(`Created task: ${task.name} (${task.id})`);
      break;
    }

    case "list": {
      const lorePath = findLorePath();
      const tasks = await listTasks(lorePath);
      if (tasks.length === 0) {
        console.log("No tasks");
        break;
      }
      for (const t of tasks) {
        console.log(`[${t.status}] ${t.name} (${t.id})`);
      }
      break;
    }

    case "show": {
      const name = args.slice(1).join(" ");
      if (!name) throw new Error("Usage: lore show <name>");
      const lorePath = findLorePath();
      const task = await getTask(lorePath, name);
      console.log(`Name:    ${task.name}`);
      console.log(`ID:      ${task.id}`);
      console.log(`Status:  ${task.status}`);
      console.log(`Created: ${task.createdAt}`);
      console.log(`Updated: ${task.updatedAt}`);
      const memory = await getMemory(lorePath, task.id);
      if (memory) {
        console.log(`\n--- Memory ---\n\n${memory}`);
      } else {
        console.log("\nNo memory yet.");
      }
      break;
    }

    case "memory": {
      const name = args[1];
      const content = args.slice(2).join(" ");
      if (!name || !content) throw new Error("Usage: lore memory <name> <content>");
      const lorePath = findLorePath();
      const task = await getTask(lorePath, name);
      await appendMemory(lorePath, task.id, content);
      console.log(`Memory appended to: ${task.name}`);
      break;
    }

    case "complete": {
      const name = args.slice(1).join(" ");
      if (!name) throw new Error("Usage: lore complete <name>");
      const lorePath = findLorePath();
      const task = await getTask(lorePath, name);
      await completeTask(lorePath, task.id);
      console.log(`Completed: ${task.name}`);
      break;
    }

    case "delete": {
      const name = args.slice(1).join(" ");
      if (!name) throw new Error("Usage: lore delete <name>");
      const lorePath = findLorePath();
      const task = await getTask(lorePath, name);
      await deleteTask(lorePath, task.id);
      console.log(`Deleted: ${task.name}`);
      break;
    }

    default:
      usage();
      break;
  }
} catch (err) {
  console.error(`Error: ${err instanceof Error ? err.message : err}`);
  process.exit(1);
}
