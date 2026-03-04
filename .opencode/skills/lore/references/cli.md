# Lore CLI Commands

Run commands with `bun packages/cli/index.ts <command>` from the repo root.

## Commands

```
lore init                     # Initialize .lore/ in current directory
lore create <name>            # Create a new tome
lore list                     # List all tomes
lore show <name>              # Show tome details
lore memory <name> <content>  # Append an entry to a tome
lore complete <name>          # Mark a tome as completed
lore delete <name>            # Delete a tome
```

## Examples

```bash
# List tomes
bun packages/cli/index.ts list

# Show a tome
bun packages/cli/index.ts show "my-tome"

# Append an entry
bun packages/cli/index.ts memory "my-tome" "Decided to use PostgreSQL for the database layer"
```
