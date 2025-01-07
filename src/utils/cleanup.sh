#!/bin/bash

# Backup directory
BACKUP_DIR=".file-backup/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Files to remove after backup
FILES_TO_REMOVE=(
  "src/utils/agent.ts"
  "src/utils/agent.js"
  "src/utils/identity.ts"
  "src/utils/auth.js"
  "src/utils/fetch-interceptor.js"
  ".ic-assets.json"
)

# Backup and remove files
for file in "${FILES_TO_REMOVE[@]}"; do
  if [ -f "$file" ]; then
    echo "Backing up $file..."
    cp "$file" "$BACKUP_DIR/$(basename "$file")"
    rm "$file"
    echo "Removed $file"
  fi
done

echo "Cleanup complete. Backups stored in $BACKUP_DIR"