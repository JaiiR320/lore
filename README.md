# Lore

Persistent context for agentic coding sessions.

Lore organizes context into **tomes** — scoped collections of typed, tagged entries that persist across sessions. Each entry is classified (decision, pattern, mistake, progress, reference, question) and tagged with keywords, enabling agents to retrieve exactly the context they need instead of loading everything.

## Setup

```sh
bun install
bun run link
```

This installs dependencies and globally links the `lore` CLI and `lore-mcp` server.

## Storage

Each tome is a single JSON file in `.lore/tomes/`:

```
.lore/
  tomes/
    auth.json
    api-design.json
```

Each file contains an array of typed, tagged entries:

```json
{
  "entries": [
    {
      "id": "uuid",
      "timestamp": "2026-03-04T10:00:00.000Z",
      "type": "decision",
      "content": "Using JWT over session cookies for stateless auth.",
      "tags": ["jwt", "auth"]
    }
  ]
}
```

### Entry Types

| Type | Purpose |
|------|---------|
| `decision` | A choice between alternatives, with reasoning |
| `progress` | Work completed, status update |
| `pattern` | A convention, rule, or recurring approach |
| `mistake` | Something that failed or should be avoided |
| `reference` | Where something lives, how to find it |
| `question` | Unresolved, needs human input |

## CLI

```
lore init                     Initialize .lore/ in current directory
lore create <name>            Create a new tome
lore list                     List all tomes
lore show <name>              Show tome entries
lore write <name> <content>   Append an entry
lore tags <name>              List all tags in a tome
lore delete <name>            Delete a tome
```

## MCP Server

Add to your agent's MCP config:

```json
{
  "lore": {
    "command": "lore-mcp"
  }
}
```

Tools: `init`, `list`, `show`, `create`, `write`, `tags`, `delete`

The `show` tool supports filtering by `types`, `tags`, `since`, and `last` — so agents can load just the entries they need. The `write` tool accepts an entry `type` and `tags` for classification.

Each tool takes a `directory` param (project root) and operates on the `.lore/tomes/` directory within it.

## Agent Skill

An agent skill is included at `.opencode/skills/lore/` that teaches agents when and how to read/write tomes automatically — including how to classify entries and use filtered retrieval. Copy it into your agent's skill directory to enable automatic tome loading and writing behavior.
