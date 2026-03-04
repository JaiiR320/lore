# Lore MCP Tools

All tools require a `directory` argument — the project root directory.

## lore_list

List all tomes. Optionally filter by status.

- `directory` (string, required): Project root directory
- `status` (string, optional): `"active"` or `"completed"`

Returns JSON array of tomes.

## lore_show

Show a tome's details and its contents.

- `directory` (string, required): Project root directory
- `name` (string, required): Tome name

Returns tome metadata and entries.

## lore_create

Create a new tome.

- `directory` (string, required): Project root directory
- `name` (string, required): Tome name

## lore_write

Append an entry to a tome.

- `directory` (string, required): Project root directory
- `name` (string, required): Tome name
- `content` (string, required): Content to append

## lore_complete

Mark a tome as completed.

- `directory` (string, required): Project root directory
- `name` (string, required): Tome name

## lore_delete

Delete a tome.

- `directory` (string, required): Project root directory
- `name` (string, required): Tome name
