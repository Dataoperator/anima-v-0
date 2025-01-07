#!/bin/bash

echo "🔄 Deploying ANIMA to Internet Computer mainnet..."

# Set environment variables for mainnet deployment
export DFX_NETWORK=ic
export II_URL=https://identity.ic0.app

# Ensure .dfx/local exists
mkdir -p .dfx/local/canisters/anima_assets

echo "🏗️ Building frontend..."
yarn build

echo "🚀 Deploying to mainnet..."
dfx deploy anima_assets --network=ic --mode=reinstall

echo "✅ Deployment complete!"
echo "Mainnet Canister URLs:"
echo "Main: https://$(dfx canister --network ic id anima).icp0.io"
echo "Assets: https://$(dfx canister --network ic id anima_assets).icp0.io"

# Print status and neural link endpoints
echo "📊 Canister Status:"
dfx canister --network ic status anima
dfx canister --network ic status anima_assets

echo "🧠 Neural Link Endpoints:"
echo "Interface: https://$(dfx canister --network ic id anima_assets).icp0.io/neural-link"