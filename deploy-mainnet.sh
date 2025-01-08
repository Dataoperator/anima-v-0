#!/bin/bash
set -e

echo "🔄 Deploying ANIMA to Internet Computer mainnet..."

# Run pre-deployment checks
echo "🔍 Running pre-deployment verification..."
./verify-deployment.sh

# Set environment variables
export DFX_NETWORK=ic
export CANISTER_ENV=production

# Update Cargo.lock first
echo "📦 Updating Cargo.lock..."
cargo update
cargo build --target wasm32-unknown-unknown --release -p anima

# Build frontend
echo "🏗️ Building frontend..."
dfx generate
yarn build

# Ensure all necessary files exist
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

# Check wasm build
WASM_PATH="target/wasm32-unknown-unknown/release/anima.wasm"
if [ ! -f "$WASM_PATH" ]; then
    echo "❌ WASM build failed - $WASM_PATH not found"
    exit 1
fi

# Deploy canisters
echo "🚀 Deploying canisters..."
dfx deploy --network ic anima
dfx deploy --network ic anima_assets

# Store canister IDs
ANIMA_CANISTER_ID=$(dfx canister --network ic id anima)
export ANIMA_CANISTER_ID

# Run health check
echo "🏥 Running post-deployment health check..."
yarn ts-node healthcheck.ts

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful! Canister ID: $ANIMA_CANISTER_ID"
    
    # Save deployment info
    echo "{\"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\", \"canisterId\": \"$ANIMA_CANISTER_ID\"}" > deployment-info.json
    
    echo "📝 Deployment info saved to deployment-info.json"
    
    # Verify canister settings
    echo "🔍 Verifying canister settings..."
    dfx canister --network ic status anima
    dfx canister --network ic status anima_assets
else
    echo "❌ Post-deployment health check failed!"
    exit 1
fi