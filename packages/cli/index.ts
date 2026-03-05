#!/usr/bin/env bun

import {
  createTome,
  getTome,
  listTomes,
  deleteTome,
  readEntries,
  writeEntry,
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
  show <name>              Show tome details and entries
  write <name> <content>   Append an entry to a tome
  tags <name>              List all tags in a tome
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
      console.log(`Created tome: ${tome.name}`);
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
        console.log(`${t.name} (${t.entryCount} entries)`);
      }
      break;
    }

    case "show": {
      const name = args.slice(1).join(" ");
      if (!name) throw new Error("Usage: lore show <name>");
      const lorePath = findLorePath();
      const entries = await readEntries(lorePath, name);
      if (entries.length === 0) {
        console.log("No entries yet.");
        break;
      }
      for (const entry of entries) {
        const tags = entry.tags.length ? ` ${entry.tags.map((t) => `#${t}`).join(" ")}` : "";
        console.log(`[${entry.type}] ${entry.timestamp} — ${entry.content}${tags}`);
      }
      break;
    }

    case "write": {
      const name = args[1];
      const content = args.slice(2).join(" ");
      if (!name || !content) throw new Error("Usage: lore write <name> <content>");
      const lorePath = findLorePath();
      const entry = await writeEntry(lorePath, name, content);
      console.log(`Entry appended to: ${name} [${entry.type}]`);
      break;
    }

    case "tags": {
      const name = args.slice(1).join(" ");
      if (!name) throw new Error("Usage: lore tags <name>");
      const lorePath = findLorePath();
      const entries = await readEntries(lorePath, name);
      const tags = [...new Set(entries.flatMap((e) => e.tags))].sort();
      if (tags.length === 0) {
        console.log("No tags");
        break;
      }
      console.log(tags.join(", "));
      break;
    }

    case "delete": {
      const name = args.slice(1).join(" ");
      if (!name) throw new Error("Usage: lore delete <name>");
      const lorePath = findLorePath();
      await deleteTome(lorePath, name);
      console.log(`Deleted: ${name}`);
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
