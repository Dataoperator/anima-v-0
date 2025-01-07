#!/bin/bash

# Source environment variables if they exist
if [ -f .env ]; then
  source .env
fi

echo "🧹 Cleaning up previous build artifacts..."
rm -rf .dfx/local
rm -rf dist

echo "🔧 Checking canister initialization..."
if [ ! -f .env.anima ] || [ ! -f .env.assets ]; then
  echo "❌ Canisters not initialized. Running initialization..."
  ./init-canisters.sh
fi

echo "🔨 Building Rust canisters..."
dfx build anima --network=ic

echo "📝 Generating declarations..."
dfx generate anima

echo "🏗️ Building frontend..."
npm run build

echo "🚀 Deploying to mainnet..."
dfx deploy --network ic

echo "✅ Deployment complete!"
echo "URLs:"
echo "  Frontend: https://$(dfx canister id anima_assets --network=ic).ic0.app/"
echo "  Canister: https://$(dfx canister id anima --network=ic).raw.ic0.app/"