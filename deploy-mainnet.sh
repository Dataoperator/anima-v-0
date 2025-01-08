#!/bin/bash

set -e  # Exit on error

echo "🔄 Deploying ANIMA to Internet Computer mainnet..."

# Set environment variables
export DFX_NETWORK=ic
export II_URL=https://identity.ic0.app

echo "🏗️ Building frontend..."
yarn build

echo "🚀 Deploying canisters..."
dfx deploy --network=ic

# No need for complex verification - dfx deploy handles this

echo "✨ Initializing quantum field..."
dfx canister --network=ic call anima initialize_quantum_field

echo "✅ Deployment complete!"

# Print URLs
ANIMA_ID=$(dfx canister --network=ic id anima)
ASSETS_ID=$(dfx canister --network=ic id anima_assets)

echo "🌐 Canister URLs:"
echo "Main: https://$ANIMA_ID.icp0.io"
echo "Assets: https://$ASSETS_ID.icp0.io"
echo "Neural Interface: https://$ASSETS_ID.icp0.io/neural-link"