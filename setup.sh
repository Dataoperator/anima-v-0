#!/bin/bash

echo "🔧 Making scripts executable..."
chmod +x init-canisters.sh
chmod +x deploy-full.sh

echo "✨ Setup complete! You can now run:"
echo "./init-canisters.sh  # Only needed first time"
echo "./deploy-full.sh     # For deployment"