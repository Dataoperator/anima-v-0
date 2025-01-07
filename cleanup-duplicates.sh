#!/bin/bash

# Create backups directory
echo "Creating backups directory..."
mkdir -p .backups/components

# Backup and remove chat components
echo "Cleaning up chat components..."
mv src/components/chat/ImmersiveAnimaUI.jsx .backups/components/
mv src/components/chat/ImmersiveChatInterface.tsx .backups/components/
mv src/components/chat/Chat.jsx.bak.old .backups/components/
mv src/components/chat/AnimaChat.jsx .backups/components/
mv src/components/chat/ImmersiveEnhancedChat.tsx .backups/components/ 2>/dev/null

# Clean up RecentlyConnected duplicates
echo "Cleaning up RecentlyConnected components..."
mv src/components/RecentlyConnected.jsx .backups/components/

# Remove Zone.Identifier files
echo "Removing Zone.Identifier files..."
find . -name "*:Zone.Identifier" -type f -delete

# Clean up other known duplicates
echo "Cleaning up other duplicates..."
mv src/components/pages/GenesisPage.jsx .backups/components/ 2>/dev/null
mv src/components/auth/AuthRedirect.jsx .backups/components/ 2>/dev/null
mv src/components/quantum/QuantumField.jsx .backups/components/ 2>/dev/null
mv src/components/ui/LaughingMan.jsx .backups/components/ 2>/dev/null

# Remove backup directory if empty
if [ -z "$(ls -A .backups/components)" ]; then
    rm -r .backups
fi

echo "Cleanup complete! Backups stored in .backups/components/"