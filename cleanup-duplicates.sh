#!/bin/bash

# Remove outdated/duplicate components
rm -f src/components/chat/ImmersiveChatInterface.tsx
rm -f src/components/immersive-chat/ImmersiveChat.tsx
rm -f src/components/neural-link/AnimaNeuralLink.tsx
rm -f src/enhanced/immersive/ImmersiveChat.tsx

# Update imports and references
find src -type f -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -exec sed -i 's/ImmersiveChatInterface/UnifiedNeuralLink/g' {} +
find src -type f -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -exec sed -i 's/ImmersiveChat/UnifiedNeuralLink/g' {} +
find src -type f -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -exec sed -i 's/AnimaNeuralLink/UnifiedNeuralLink/g' {} +