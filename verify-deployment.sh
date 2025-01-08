#!/bin/bash

echo "🔍 Verifying deployment configuration..."

# Check DFX version
DFX_VERSION=$(dfx --version)
REQUIRED_VERSION="0.15.1"
if [ "$DFX_VERSION" != "dfx $REQUIRED_VERSION" ]; then
    echo "❌ Wrong dfx version. Required: $REQUIRED_VERSION, Found: $DFX_VERSION"
    exit 1
fi

# Verify canister IDs exist
if [ ! -f "canister_ids.json" ]; then
    echo "❌ Missing canister_ids.json"
    exit 1
fi

# Verify candid interfaces
echo "📝 Verifying Candid interfaces..."
if [ ! -f "src/lib.did" ]; then
    echo "❌ Missing lib.did"
    exit 1
fi

if [ ! -f "candid/ledger.did" ]; then
    echo "❌ Missing ledger.did"
    exit 1
fi

# Check environment files
echo "🔐 Checking environment configuration..."
if [ ! -f ".env.production" ]; then
    echo "❌ Missing .env.production"
    exit 1
fi

# Verify build output
echo "🏗️ Verifying build artifacts..."
if [ ! -d "dist" ]; then
    echo "❌ Missing dist directory"
    exit 1
fi

# Check dependencies
echo "📦 Checking dependencies..."
MISSING_DEPS=0
REQUIRED_DEPS=("@dfinity/agent" "@dfinity/candid" "@dfinity/principal" "react" "react-dom")

for dep in "${REQUIRED_DEPS[@]}"; do
    if ! grep -q "\"$dep\":" package.json; then
        echo "❌ Missing dependency: $dep"
        MISSING_DEPS=1
    fi
done

if [ $MISSING_DEPS -eq 1 ]; then
    exit 1
fi

# Verify IC network configuration
echo "🌐 Verifying IC network configuration..."
if ! dfx ping ic; then
    echo "❌ Cannot connect to IC network"
    exit 1
fi

# Verify WASM module integrity
if [ -f "target/wasm32-unknown-unknown/release/anima.wasm" ]; then
    echo "✅ WASM module exists"
else
    echo "❌ Missing WASM module"
    exit 1
fi

echo "✅ Deployment verification complete!"