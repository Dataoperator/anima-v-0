#!/bin/bash
set -e

echo "🔍 Running pre-deployment verification..."

# Check WASM file
WASM_PATH="target/wasm32-unknown-unknown/release/anima.wasm"
if [ ! -f "$WASM_PATH" ]; then
    echo "❌ WASM file not found: $WASM_PATH"
    exit 1
fi

# Check WASM size
WASM_SIZE=$(stat -f%z "$WASM_PATH" 2>/dev/null || stat -c%s "$WASM_PATH")
echo "📦 WASM size: $WASM_SIZE bytes"

# Check candid interface
if [ ! -f "src/anima.did" ]; then
    echo "❌ Candid interface file not found"
    exit 1
fi

# Verify dfx.json exists
if [ ! -f "dfx.json" ]; then
    echo "❌ dfx.json not found"
    exit 1
fi

echo "✅ Pre-deployment verification passed"