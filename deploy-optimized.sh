#!/bin/bash
set -e

echo "🧬 ANIMA Optimized Deployment"

# Set environment
export DFX_NETWORK=ic
export CANISTER_ENV=production

# Ensure proper tools
command -v cargo >/dev/null 2>&1 || { echo "❌ Cargo not installed"; exit 1; }
command -v yarn >/dev/null 2>&1 || { echo "❌ Yarn not installed"; exit 1; }
command -v dfx >/dev/null 2>&1 || { echo "❌ DFX not installed"; exit 1; }

# Start parallel builds
echo "🚀 Starting parallel builds..."
echo "   - Building Rust backend..."
(cargo build --target wasm32-unknown-unknown --release) &
RUST_PID=$!

echo "   - Building frontend assets..."
(yarn build) &
YARN_PID=$!

# Wait for builds
wait $RUST_PID
RUST_EXIT=$?
wait $YARN_PID
YARN_EXIT=$?

# Check build status
if [ $RUST_EXIT -ne 0 ] || [ $YARN_EXIT -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Builds completed successfully"

# Generate declarations
echo "📝 Generating canister declarations..."
dfx generate

# Deploy canisters sequentially (changed from parallel)
echo "📦 Deploying canisters..."
echo "   - Deploying backend canister..."
dfx deploy --network ic anima --no-wallet || { echo "❌ Backend deployment failed"; exit 1; }

echo "   - Deploying frontend assets..."
dfx deploy --network ic anima_assets --no-wallet || { echo "❌ Frontend deployment failed"; exit 1; }

# Store canister IDs
ANIMA_CANISTER_ID=$(dfx canister --network ic id anima)
ASSETS_CANISTER_ID=$(dfx canister --network ic id anima_assets)

# Verify deployment
echo "🏥 Verifying deployment..."

# Check frontend
echo "   Checking frontend canister..."
FRONTEND_URL="https://$ASSETS_CANISTER_ID.raw.ic0.app/"
if curl -s "$FRONTEND_URL" > /dev/null; then
    echo "   ✅ Frontend verified at $FRONTEND_URL"
else
    echo "   ❌ Frontend check failed"
    echo "   🔍 URL: $FRONTEND_URL"
fi

# Check backend
echo "   Checking backend canister..."
if dfx canister --network ic call anima get_quantum_status > /dev/null 2>&1; then
    echo "   ✅ Backend verified"
else
    echo "   ❌ Backend check failed"
fi

# Save deployment info
echo "{
  \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
  \"network\": \"ic\",
  \"canisters\": {
    \"anima\": \"$ANIMA_CANISTER_ID\",
    \"anima_assets\": \"$ASSETS_CANISTER_ID\"
  }
}" > deployment-info.json

echo "
🎉 Deployment Complete!
🔗 Frontend: https://$ASSETS_CANISTER_ID.raw.ic0.app/
🔧 Backend: https://$ANIMA_CANISTER_ID.raw.ic0.app/
📝 Deployment info saved to deployment-info.json

Next steps:
1. Check frontend at: https://$ASSETS_CANISTER_ID.raw.ic0.app/
2. Monitor quantum state: dfx canister --network ic call anima get_quantum_status
3. View deployment info: cat deployment-info.json"