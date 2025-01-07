#!/bin/bash

echo "🔧 Creating canisters on IC network..."
dfx canister create anima --network=ic
dfx canister create anima_assets --network=ic

echo "📝 Saving canister IDs..."
dfx canister id anima --network=ic > .env.anima
dfx canister id anima_assets --network=ic > .env.assets

echo "🔄 Updating environment variables..."
ANIMA_ID=$(cat .env.anima)
ASSETS_ID=$(cat .env.assets)

# Update environment file
cat > .env << EOL
DFX_NETWORK=ic
CANISTER_ID_ANIMA=$ANIMA_ID
CANISTER_ID_ANIMA_ASSETS=$ASSETS_ID
EOL

echo "✅ Initialization complete!"
echo "Canister IDs:"
echo "  ANIMA: $ANIMA_ID"
echo "  ASSETS: $ASSETS_ID"