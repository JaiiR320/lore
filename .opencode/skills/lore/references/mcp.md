# Lore MCP Tools

All tools require a `directory` argument — the project root directory.

## lore_init

Initialize .lore/ in a project directory. Adds .lore to .gitignore.

- `directory` (string, required): Project root directory

## lore_list

List all tomes. Returns name and entry count for each.

- `directory` (string, required): Project root directory

Returns JSON array of `{ name, entryCount }`.

## lore_show

Show a tome's entries with optional filtering.

- `directory` (string, required): Project root directory
- `name` (string, required): Tome name
- `types` (string[], optional): Filter by entry types — `decision`, `progress`, `pattern`, `mistake`, `reference`, `question`
- `tags` (string[], optional): Filter by tags — returns entries matching any of the given tags
- `since` (string, optional): ISO timestamp — only entries after this time
- `last` (number, optional): Return only the last N entries (applied after other filters)

## lore_create

Create a new tome.

- `directory` (string, required): Project root directory
- `name` (string, required): Tome name

## lore_write

Append a typed, tagged entry to a tome.

- `directory` (string, required): Project root directory
- `name` (string, required): Tome name
- `content` (string, required): Entry content
- `type` (string, optional): Entry type — `decision`, `progress`, `pattern`, `mistake`, `reference`, `question`. Defaults to `progress`.
- `tags` (string[], optional): Tags for this entry

## lore_tags

List all tags used in a tome.

- `directory` (string, required): Project root directory
- `name` (string, required): Tome name

Returns a comma-separated list of tags.

## lore_delete

Delete a tome.

- `directory` (string, required): Project root directory
- `name` (string, required): Tome name
