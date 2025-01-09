#!/bin/bash
set -e

echo "🔄 Deploying ANIMA to Internet Computer mainnet..."

# Set environment variables
export DFX_NETWORK=ic
export CANISTER_ENV=production

# Make scripts executable
chmod +x ./build-wasm.sh
chmod +x ./verify-deployment.sh

# Build WASM
./build-wasm.sh

# Run pre-deployment checks after WASM build
echo "🔍 Running pre-deployment verification..."
./verify-deployment.sh

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
yarn install

# Build frontend
echo "🏗️ Building frontend..."
yarn build

# Ensure all necessary files exist
if [ ! -d "dist" ]; then
    echo "❌ Frontend build failed - dist directory not found"
    exit 1
fi

# Generate declarations
echo "📝 Generating canister declarations..."
dfx generate

# Deploy backend canister first
echo "🚀 Deploying backend canister..."
dfx deploy --network ic anima --no-wallet

# Deploy frontend assets
echo "🎨 Deploying frontend assets..."
dfx deploy --network ic anima_assets --no-wallet

# Store canister IDs
ANIMA_CANISTER_ID=$(dfx canister --network ic id anima)
ASSETS_CANISTER_ID=$(dfx canister --network ic id anima_assets)

echo "🔍 Canister IDs:"
echo "Backend (anima): $ANIMA_CANISTER_ID"
echo "Frontend (anima_assets): $ASSETS_CANISTER_ID"

# Run health check
echo "🏥 Running post-deployment health check..."
if [ -f "healthcheck.ts" ]; then
    yarn ts-node healthcheck.ts
else
    echo "⚠️ Skipping health check - healthcheck.ts not found"
fi

# Save deployment info
echo "{
  \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
  \"canisters\": {
    \"anima\": \"$ANIMA_CANISTER_ID\",
    \"anima_assets\": \"$ASSETS_CANISTER_ID\"
  }
}" > deployment-info.json

echo "📝 Deployment info saved to deployment-info.json"

# Print canister URLs
echo "🌐 Canister URLs:"
echo "Frontend: https://$ASSETS_CANISTER_ID.ic0.app"
echo "Backend: https://$ANIMA_CANISTER_ID.ic0.app"

# Verify canister settings
echo "🔍 Verifying canister settings..."
dfx canister --network ic status anima
dfx canister --network ic status anima_assets