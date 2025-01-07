#!/bin/bash
set -e

echo "Verifying deployment..."

# Check canister status
dfx canister --network ic status anima
dfx canister --network ic status anima_assets

# Test basic functionality
echo "Testing basic functionality..."

# Create test anima
RESULT=$(dfx canister --network ic call anima create_anima '("Test Anima")')
echo "Create Anima Result: $RESULT"

# Get the created anima
OWNER=$(dfx identity get-principal)
echo "Testing get_user_animas for owner: $OWNER"
ANIMAS=$(dfx canister --network ic call anima get_user_animas "($OWNER)")
echo "User Animas: $ANIMAS"

# Test quantum interaction
echo "Testing quantum interaction..."
TOKEN_ID="1"
dfx canister --network ic call anima process_quantum_interaction "($TOKEN_ID, \"test_interaction\", \"Hello quantum world!\")"

echo "Verification complete!"