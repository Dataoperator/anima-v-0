#!/bin/bash
set -e

echo "🏗️ Building WASM module..."

# Ensure proper rust target is installed
rustup target add wasm32-unknown-unknown

# Set WASM-specific flags
export RUSTFLAGS="-C target-feature=+atomics,+bulk-memory,+mutable-globals --cfg feature=\"cdk\""

# Clean previous builds
cargo clean

# Build optimized WASM
cargo build --target wasm32-unknown-unknown --release

# Verify WASM exists and has correct size
WASM_PATH="target/wasm32-unknown-unknown/release/anima.wasm"
if [ ! -f "$WASM_PATH" ]; then
    echo "❌ WASM build failed - file not found"
    exit 1
fi

WASM_SIZE=$(stat -f%z "$WASM_PATH" 2>/dev/null || stat -c%s "$WASM_PATH")
echo "📦 WASM size: $WASM_SIZE bytes"

if [ "$WASM_SIZE" -lt 10240 ]; then
    echo "❌ WASM file seems too small: $WASM_PATH ($WASM_SIZE bytes)"
    exit 1
fi

echo "✅ WASM build successful"