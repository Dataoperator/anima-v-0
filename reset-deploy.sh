#!/bin/bash

echo "🧹 Cleaning up everything..."
rm -rf .dfx dist node_modules
rm -f canister_ids.json

echo "📦 Reinstalling dependencies..."
npm install

echo "🔑 Checking identity..."
dfx identity list
read -p "Enter identity to use: " IDENTITY
dfx identity use $IDENTITY

echo "🏗️ Creating canisters..."
dfx canister create --network ic anima
dfx canister create --network ic anima_assets

echo "🔧 Building Rust canisters..."
dfx build --network ic

echo "📝 Generating declarations..."
dfx generate

echo "🏗️ Building frontend..."
npm run build

echo "🚀 Deploying canisters..."
dfx deploy --network ic

echo "✅ Deployment complete!"