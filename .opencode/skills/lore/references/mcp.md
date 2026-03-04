# Lore MCP Tools

All tools require a `directory` argument — the project root directory.

## lore_list

List all tasks. Optionally filter by status.

- `directory` (string, required): Project root directory
- `status` (string, optional): `"active"` or `"completed"`

Returns JSON array of tasks.

## lore_show

Show a task's details and its memory.

- `directory` (string, required): Project root directory
- `name` (string, required): Task name

Returns task metadata and memory content.

## lore_create

Create a new task.

- `directory` (string, required): Project root directory
- `name` (string, required): Task name

## lore_memory

Append a memory entry to a task.

- `directory` (string, required): Project root directory
- `name` (string, required): Task name
- `content` (string, required): Memory content to append

## lore_complete

Mark a task as completed.

- `directory` (string, required): Project root directory
- `name` (string, required): Task name

## lore_delete

Delete a task and its memory.

- `directory` (string, required): Project root directory
- `name` (string, required): Task name
