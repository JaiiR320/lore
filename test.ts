import { writeTome, createTome, readTome, getTome } from "@lore/core";

const lorePath = ".lore";

const tome = await getTome(lorePath, "Create CLI");
console.log("Created:", tome);

const entries = await readTome(lorePath, tome.id);

console.log(entries);
