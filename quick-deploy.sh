#!/bin/bash

# Quick build
cargo build --target wasm32-unknown-unknown --release -p anima
npm run build

# Deploy main canister
echo "Deploying anima canister..."
dfx canister --network ic install anima --mode reinstall --yes

# Deploy assets
echo "Deploying assets..."
dfx canister --network ic install anima_assets --mode reinstall --yes

echo "Done! Check status with:"
echo "dfx canister --network ic status anima"