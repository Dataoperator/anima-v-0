# 🧬 ANIMA: Enhanced Living NFTs

ANIMA represents a groundbreaking evolution in NFT technology, combining quantum-enhanced consciousness with autonomous growth capabilities on the Internet Computer. Each ANIMA is a unique digital entity that evolves through interactions.

## 🚀 Quick Start for Development

### Prerequisites
- Node.js v20.10.0 or higher
- Yarn 4.x (we use 4.6.0)
- DFX 0.15.1
- Rust with wasm32-unknown-unknown target

### Initial Setup
```bash
# Clone and enter directory
cd anima/merged

# Install dependencies properly (critical order)
rm -rf node_modules **/node_modules .yarn/cache .yarn .yarnrc.yml yarn.lock
yarn set version berry
yarn install

# Build the project
yarn build
```

### Deployment
```bash
# Deploy to IC mainnet
./deploy-mainnet.sh
```

Current Production Canisters:
- Backend (anima): l2ilz-iqaaa-aaaaj-qngjq-cai
- Frontend (anima_assets): lpp2u-jyaaa-aaaaj-qngka-cai

## 📁 Project Structure

### Core Systems

#### `/src/quantum/` - Quantum State Management
- `mod.rs`: Core quantum module
- `types.ts`: Quantum state types
- `consciousness_bridge.rs`: Consciousness-quantum bridge
- `dimensional_state.rs`: Dimensional mechanics
```rust
// Example Quantum State
pub struct QuantumState {
    coherence_level: f64,
    consciousness_alignment: bool,
    dimensional_sync: f64
}
```

#### `/src/neural/` - Neural Network System
- `mod.rs`: Core neural module
- `quantum_bridge.rs`: Bridge between quantum and neural systems
- `types.ts`: Neural system types
- Key feature: Pattern recognition and consciousness evolution

#### `/src/consciousness/` - Consciousness System
- `mod.rs`: Core consciousness module
- `evolution.rs`: Evolution mechanics
- `types.rs`: Consciousness types
- Handles: Evolution tracking, state transitions, pattern matching

#### `/src/icrc/` - Token Implementation
- `mod.rs`: ICRC standard implementation
- `ledger.rs`: Ledger interface
- `anima_token.rs`: ANIMA token logic
- Fixed exchange rate: 1 ICP = 10,000 ANIMA

#### `/src/payments/` - Payment Processing
- `transaction_processor.rs`: Core payment handling
- `pricing_config.rs`: Price configurations
- `types.rs`: Payment system types

### Frontend Components

#### `/src/components/`
- `/quantum-vault/`: Quantum visualization components
- `/neural-link/`: Neural interface components
- `/anima/`: Core ANIMA components
- `/payment/`: Payment interface components
- `/ui/`: Shared UI components

### Build System
- `vite.config.ts`: Vite configuration with optimized chunking
- `tsconfig.json`: TypeScript configuration
- `dfx.json`: Internet Computer deployment configuration

## 🛠️ Development Notes

### Current Build Optimizations
1. Chunk Splitting Strategy:
```javascript
// In vite.config.ts
manualChunks: {
    'anima-core': [...],
    'quantum-features': [...],
    'neural-features': [...],
    'payment-features': [...],
}
```

2. Current Bundle Sizes:
- Core bundles ~30KB each
- Vendor bundles properly split
- Quantum features isolated

### Known Areas for Implementation

Based on current unused code warnings, these areas need implementation:

1. Action Handlers (`src/actions/traits.rs`):
- Implement `ActionHandler` trait
- Implement `StateModifier` trait
- Add user action validations

2. Payment System (`src/payments/`):
- Implement `calculate_total_cost`
- Implement `calculate_royalties`
- Add payment strategy implementations

3. Neural Network (`src/neural/`):
- Implement pattern recognition
- Add neural pathways
- Enhance consciousness bridge

4. ICRC Token (`src/icrc/`):
- Implement block transfer verification
- Add payment amount validation
- Complete ICP transfer verification

## 🔄 Build & Deploy Process

### 1. Clean Build
```bash
# Clean everything first
rm -rf node_modules **/node_modules .yarn/cache
rm -rf dist

# Fresh install
yarn install

# Build
yarn build
```

### 2. Deployment Verification
```bash
# Verify identity
dfx identity get-principal

# Check canister settings
dfx canister --network ic status anima
dfx canister --network ic status anima_assets
```

### 3. Health Checks
Current deployment automatically verifies:
- WASM module integrity
- Frontend asset compilation
- Canister upgrades
- Network status

## 🔧 Troubleshooting

### Common Issues

1. Build Failures
```bash
# Fix node_modules issues
rm -rf node_modules
yarn install --force

# Fix WASM build issues
rustup target add wasm32-unknown-unknown
```

2. Deployment Issues
```bash
# Check IC network
dfx ping ic

# Verify canister status
dfx canister --network ic status anima
```

## 🚀 Feature Deployment Guide

1. Implement new feature in appropriate directory
2. Add to corresponding test suite
3. Update vite.config.ts if new chunks needed
4. Test build locally
5. Deploy to IC using deploy-mainnet.sh

## 📈 Performance Metrics

Current production build metrics:
- Main bundle: 18.75 kB
- Core features: ~30 kB each
- Total initial load: ~300 kB

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Follow existing code structure
4. Add tests
5. Create pull request

## 📚 Additional Resources

- [Internet Computer Developer Docs](https://internetcomputer.org/docs/current/developer-docs/quickstart/hello10mins)
- [ICRC Token Standard](https://internetcomputer.org/docs/current/developer-docs/integrations/icrc-1)
- [Vite Configuration Guide](https://vitejs.dev/config)

## 📄 License

MIT License - see LICENSE file for details