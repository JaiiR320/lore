#!/usr/bin/env bun

import {
  createTome,
  getTome,
  listTomes,
  completeTome,
  deleteTome,
  readTome,
  writeTome,
  initLore,
  findLorePath,
} from "@lore/core";

const args = Bun.argv.slice(2);
const command = args[0];

function usage() {
  console.log(`Usage: lore <command>

Commands:
  init                     Initialize .lore/ in current directory
  create <name>            Create a new tome
  list                     List all tomes
  show <name>              Show tome details
  write <name> <content>   Append an entry to a tome
  complete <name>          Mark a tome as completed
  delete <name>            Delete a tome`);
}

try {
  switch (command) {
    case "init": {
      await initLore(process.cwd());
      console.log("Initialized .lore/");
      break;
    }

    case "create": {
      const name = args.slice(1).join(" ");
      if (!name) throw new Error("Usage: lore create <name>");
      const lorePath = findLorePath();
      const tome = await createTome(lorePath, name);
      console.log(`Created tome: ${tome.name} (${tome.id})`);
      break;
    }

    case "list": {
      const lorePath = findLorePath();
      const tomes = await listTomes(lorePath);
      if (tomes.length === 0) {
        console.log("No tomes");
        break;
      }
      for (const t of tomes) {
        console.log(`[${t.status}] ${t.name} (${t.id})`);
      }
      break;
    }

    case "show": {
      const name = args.slice(1).join(" ");
      if (!name) throw new Error("Usage: lore show <name>");
      const lorePath = findLorePath();
      const tome = await getTome(lorePath, name);
      console.log(`Name:    ${tome.name}`);
      console.log(`ID:      ${tome.id}`);
      console.log(`Status:  ${tome.status}`);
      console.log(`Created: ${tome.createdAt}`);
      console.log(`Updated: ${tome.updatedAt}`);
      const entries = await readTome(lorePath, tome.id);
      if (entries) {
        console.log(`\n--- Entries ---\n\n${entries}`);
      } else {
        console.log("\nNo entries yet.");
      }
      break;
    }

    case "write": {
      const name = args[1];
      const content = args.slice(2).join(" ");
      if (!name || !content) throw new Error("Usage: lore write <name> <content>");
      const lorePath = findLorePath();
      const tome = await getTome(lorePath, name);
      await writeTome(lorePath, tome.id, content);
      console.log(`Entry appended to: ${tome.name}`);
      break;
    }

    case "complete": {
      const name = args.slice(1).join(" ");
      if (!name) throw new Error("Usage: lore complete <name>");
      const lorePath = findLorePath();
      const tome = await getTome(lorePath, name);
      await completeTome(lorePath, tome.id);
      console.log(`Completed: ${tome.name}`);
      break;
    }

    case "delete": {
      const name = args.slice(1).join(" ");
      if (!name) throw new Error("Usage: lore delete <name>");
      const lorePath = findLorePath();
      const tome = await getTome(lorePath, name);
      await deleteTome(lorePath, tome.id);
      console.log(`Deleted: ${tome.name}`);
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
