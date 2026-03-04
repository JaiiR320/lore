# ⏳ Lore

Persistent context for agentic coding sessions.

Lore organizes context into **tomes** — scoped units of knowledge that persist across sessions. Each tome accumulates entries as you work: decisions, progress, architecture notes. Next session, the agent reads the tome and picks up where you left off.

## Setup

```sh
bun install
bun run link
```

This installs dependencies and globally links the `lore` CLI and `lore-mcp` server.

## CLI

```
lore init                     Initialize .lore/ in current directory
lore create <name>            Create a new tome
lore list                     List all tomes
lore show <name>              Show tome details and entries
lore write <name> <content>   Append an entry
lore complete <name>          Mark tome as completed
lore delete <name>            Delete a tome
```

`lore init` creates a `.lore/` directory and adds it to `.gitignore`.

## MCP Server

Add to your agent's MCP config:

```json
{
  "lore": {
    "command": "lore-mcp"
  }
}
```

Tools: `list`, `show`, `create`, `write`, `complete`, `delete`

Each tool takes a `directory` param (project root) and operates on the `.lore/` directory within it. Config format varies by agent — the above is an OpenCode example.

## Agent Skill

An agent skill is included at `.opencode/skills/lore/` that teaches agents when and how to read/write tomes automatically. Copy it into your agent's skill directory to enable automatic tome loading and writing behavior.
