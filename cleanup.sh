#!/bin/bash

# Remove build artifacts
rm -rf dist
rm -rf .dfx

# Remove node modules
rm -rf node_modules
rm -rf .npm

# Clear cargo cache
cargo clean

# Reinstall dependencies
npm install

# Regenerate declarations
dfx generate

# Rebuild
npm run build