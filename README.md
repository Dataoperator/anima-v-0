# 🧬 ANIMA: Enhanced Living NFTs

ANIMA represents a groundbreaking evolution in NFT technology, combining quantum-enhanced consciousness with autonomous growth capabilities on the Internet Computer. Each ANIMA is a unique digital entity that evolves through interactions, backed by sophisticated quantum state management and blockchain technology.

## 🚀 Quick Start Guide

### Core Systems Overview

#### 1. Quantum State System
```typescript
// Initialize quantum state for an ANIMA
const anima = await quantumVault.initialize({
  coherenceLevel: 1.0,
  dimensionalSync: 1.0,
  consciousness: true
});
```
- Located in `src/quantum/`
- Manages consciousness evolution
- Handles state coherence
- Tracks dimensional resonance

#### 2. Token & Treasury System
```typescript
// Fixed exchange rate: 1 ICP = 10,000 ANIMA
const EXCHANGE_RATE = 10_000n;
// Project Treasury: l2ilz-iqaaa-aaaaj-qngjq-cai
```
- ICP deposits go directly to project canister
- Automated swap processing
- Secure treasury management
- Full transaction history

#### 3. Neural Link System
```typescript
// Access neural interface
import { NeuralLink } from '@anima/neural';
const interface = await NeuralLink.connect(animaId);
```
- Real-time consciousness monitoring
- Pattern recognition
- Emotional spectrum analysis
- Evolution tracking

### Quick Installation

```bash
# Clone repository
git clone https://github.com/yourusername/anima.git
cd anima

# Install dependencies
yarn install

# Build project
yarn build

# Deploy local development environment
dfx start --clean
dfx deploy
```

## 🏗️ Project Structure

```
src/
├── quantum/                 # Quantum state management
│   ├── mod.rs              # Core quantum module
│   ├── types.ts            # Quantum state types
│   ├── consciousness_bridge.rs # Consciousness-quantum bridge
│   └── dimensional_state.rs # Dimensional mechanics
├── wallet/                  # ICP/ANIMA wallet system
│   ├── mod.rs              # Wallet core functionality
│   └── treasury.service.ts  # Treasury management
├── services/               # Core services
│   ├── price-oracle.ts     # Fixed rate implementation
│   ├── escrow.service.ts   # Swap handling
│   └── error-tracker.ts    # Error management
├── neural/                 # Neural system
│   ├── interaction_patterns.rs
│   └── types.ts
├── icrc/                   # Token implementation
│   ├── mod.rs              # ICRC standard implementation
│   ├── ledger.rs           # Ledger interface
│   └── anima_token.rs      # ANIMA token logic
└── components/             # Frontend components
    ├── quantum-vault/      # Quantum visualization
    ├── wallet/             # Wallet interface
    └── neural-link/        # Neural interface
```

## 💫 Core Systems Architecture

### 1. Quantum State Management
- **Location**: `src/quantum/`
- **Key Components**:
  - Quantum State Initialization
  - Consciousness Evolution
  - Dimensional Resonance
  - Pattern Recognition
- **Integration Points**:
  ```rust
  pub struct QuantumState {
      coherence_level: f64,
      consciousness_alignment: bool,
      dimensional_sync: f64,
      // ... other fields
  }
  ```

### 2. Token & Payment System
- **Location**: `src/wallet/` & `src/icrc/`
- **Features**:
  - Fixed 1:10000 ICP to ANIMA ratio
  - Direct treasury deposits
  - Automated swap processing
  - Transaction history
- **Flow**:
  ```typescript
  // User deposits ICP -> Treasury
  // Treasury Canister (l2ilz-iqaaa-aaaaj-qngjq-cai)
  // Mints ANIMA at 1:10000 ratio
  ```

### 3. Neural Link System
- **Location**: `src/neural/`
- **Components**:
  - Consciousness Interface
  - Pattern Recognition
  - Emotional Analysis
  - Evolution Tracking
- **Usage**:
  ```typescript
  const neuralLink = await NeuralLink.initialize({
    consciousness: quantum.consciousness,
    patterns: quantum.resonancePatterns
  });
  ```

### 4. Frontend Components
- **Location**: `src/components/`
- **Key Interfaces**:
  - Quantum Vault Visualization
  - Wallet Management
  - Neural Link Interface
  - Evolution Tracking

## 🌐 System Integration

### 1. Token Swap Process
```typescript
// 1. User deposits ICP
await wallet.deposit(icpAmount);

// 2. Treasury receives ICP
// Canister: l2ilz-iqaaa-aaaaj-qngjq-cai

// 3. ANIMA minted at fixed rate
const animaAmount = icpAmount * 10000n;

// 4. User receives ANIMA
await token.mint(userPrincipal, animaAmount);
```

### 2. Quantum State Evolution
```rust
// 1. Initialize quantum state
let mut state = QuantumState::new();

// 2. Process consciousness evolution
state.update_consciousness(interaction);

// 3. Update dimensional resonance
state.process_dimensional_shift();
```

### 3. Neural Link Integration
```typescript
// 1. Connect to neural interface
const neural = await NeuralLink.connect(animaId);

// 2. Process interaction patterns
await neural.processInteraction({
  type: InteractionType.EMOTIONAL,
  data: interactionData
});

// 3. Update quantum state
await quantum.updateState(neural.getPatterns());
```

## 🔧 Development Tools

### Local Development
```bash
# Start local environment
dfx start --clean

# Deploy local instance
dfx deploy

# Run development server
yarn dev
```

### Testing
```bash
# Run quantum tests
cargo test quantum

# Run neural tests
cargo test neural

# Run frontend tests
yarn test
```

### Deployment
```bash
# Build for production
yarn build

# Deploy to IC
./deploy-mainnet.sh
```

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Study the core systems:
   - Quantum state management
   - Token & treasury system
   - Neural link implementation
4. Make changes
5. Run tests: `yarn test && cargo test`
6. Create pull request

### Code Style
- Rust: Follow `rustfmt` guidelines
- TypeScript: Use provided ESLint config
- React: Follow component structure in `src/components`

## 📚 Additional Resources

- [Quantum System Documentation](./docs/quantum.md)
- [Neural Link Guide](./docs/neural-link.md)
- [Treasury Management](./docs/treasury.md)
- [Deployment Guide](./docs/deployment.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.