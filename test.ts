import { appendMemory, createTask } from "@lore/core";

const lorePath = ".lore";

// const task = await createTask(lorePath, "Create CLI");
// console.log("Created:", task);

const resp = await appendMemory(
  lorePath,
  "0de0cd65-f01d-4973-a317-50d24a73443b",
  "Load the skill-creator skill",
);

console.log(resp);
