#!/bin/bash

# Backup directory with timestamp
BACKUP_DIR="../.auth-backup/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Files to remove after backup
declare -a FILES_TO_REMOVE=(
  "agent.ts"
  "agent.js"
  "identity.ts"
  "auth.js"
  "fetch-interceptor.js"
  "agent.ts.bak"
)

# Directories for validation
declare -a REQUIRED_DIRS=(
  "auth"
  "../contexts"
  "../components/auth"
)

# Create backups
for file in "${FILES_TO_REMOVE[@]}"; do
  if [ -f "$file" ]; then
    echo "📦 Backing up $file..."
    cp "$file" "$BACKUP_DIR/$file.bak"
    rm "$file"
    echo "🗑️  Removed $file"
  fi
done

# Verify required directories
for dir in "${REQUIRED_DIRS[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "📁 Creating required directory $dir..."
    mkdir -p "$dir"
  fi
done

# Verify new auth structure
if [ ! -f "auth/index.ts" ]; then
  echo "❌ Error: Missing auth/index.ts"
  exit 1
fi

echo "✨ Auth cleanup complete!"
echo "📂 Backups stored in $BACKUP_DIR"