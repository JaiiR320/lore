import { appendMemory, createTask, getMemory, getTask } from "@lore/core";

const lorePath = ".lore";

const task = await getTask(lorePath, "Create CLI");
console.log("Created:", task);

const memory = await getMemory(lorePath, task.id);

console.log(memory);
