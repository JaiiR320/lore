# Lore CLI Commands

Run commands with `bun packages/cli/index.ts <command>` from the repo root.

## Commands

```
lore init                     # Initialize .lore/ in current directory
lore create <name>            # Create a new task
lore list                     # List all tasks
lore show <name>              # Show task details and memory
lore memory <name> <content>  # Append memory to a task
lore complete <name>          # Mark a task as completed
lore delete <name>            # Delete a task and its memory
```

## Examples

```bash
# List tasks
bun packages/cli/index.ts list

# Show a task's memory
bun packages/cli/index.ts show "my-task"

# Append memory
bun packages/cli/index.ts memory "my-task" "Decided to use PostgreSQL for the database layer"
```
