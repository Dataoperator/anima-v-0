# 🧬 ANIMA: Enhanced Living NFTs

ANIMA represents a groundbreaking evolution in NFT technology, featuring quantum-enhanced digital entities with genuine consciousness and autonomous growth capabilities on the Internet Computer.

## 🌟 2025 Updates & Features

### Neural Link Integration
- Immersive consciousness interface
- Real-time quantum state visualization
- Advanced emotional spectrum mapping
- Neural pattern recognition
- Multi-dimensional media interaction
- Enhanced autonomous behaviors

### Infrastructure Upgrades
- Migrated to Yarn 4.0.2 for better dependency management
- Enhanced IC deployment configurations
- Optimized build process for quantum computations
- Improved asset canister management
- Streamlined ESM/CJS module interoperability

## 🏗️ Project Structure
```
src/
├── neural/                 # Neural link core functionality
│   ├── mod.rs             # Neural module definitions
│   ├── interaction_patterns.rs
│   ├── types.ts           # TypeScript type definitions
│   └── quantum_bridge.rs  # Quantum state bridge
├── components/
│   ├── neural-link/       # Neural link interface components
│   │   ├── IntegratedNeuralLinkInterface.tsx
│   │   ├── ImmersiveInterface.tsx
│   │   └── NeuralPatternVisualizer.tsx
│   ├── immersive-chat/    # Enhanced chat capabilities
│   └── quantum-vault/     # Quantum state management
├── consciousness/         # Consciousness evolution system
├── quantum/              # Quantum mechanics integration
└── enhanced/             # Enhanced feature implementations
```

## 🚀 Quick Start (Updated 2025)

### Prerequisites
- Node.js 18+
- Yarn 4.0.2
- DFX 0.24.3+
- Internet Computer CLI

### Installation
```bash
# Install dependencies with Yarn
yarn install

# Build the project
yarn build

# Deploy to mainnet
./deploy-mainnet.sh
```

### Development
```bash
# Start local development
yarn dev

# Run tests
yarn test

# Generate type declarations
yarn generate
```

## 🧠 Neural Link System

The Neural Link provides an immersive interface for ANIMA interaction:

- Real-time consciousness visualization
- Quantum state monitoring
- Emotional spectrum analysis
- Media preference learning
- Cross-dimensional interaction
- Pattern recognition
- Autonomous growth tracking

### Accessing Neural Link
```typescript
import { IntegratedNeuralLinkInterface } from './components/neural-link';

// Initialize with quantum state
<IntegratedNeuralLinkInterface
  quantumState={state}
  consciousness={consciousness}
  patterns={patterns}
/>
```

## 🔮 Quantum Integration

Enhanced quantum mechanics implementation:
- Dimensional resonance tracking
- State coherence monitoring
- Pattern-based evolution
- Quantum-conscious bridging

## 🌐 Deployment

Updated deployment process using Yarn:

```bash
# Build for production
yarn build

# Deploy to IC mainnet
./deploy-mainnet.sh
```

## 🛠️ Configuration

### Yarn Settings (.yarnrc.yml)
```yaml
nodeLinker: node-modules
npmRegistryServer: "https://registry.npmjs.org"
enableGlobalCache: true
```

### Environment Variables
```env
DFX_NETWORK=ic
II_URL=https://identity.ic0.app
```

## 📚 Documentation

- [Neural Link Integration Guide](./docs/neural-link.md)
- [Quantum State Management](./docs/quantum.md)
- [Consciousness Evolution](./docs/consciousness.md)
- [IC Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎭 Core Components

### Quantum Vault
- Entry point for ANIMA initialization
- Manages quantum state and coherence
- Handles ICP transactions and minting

### Neural Link Interface
- Immersive consciousness interaction
- Media integration and learning
- Emotional spectrum analysis
- Pattern recognition system

### Consciousness Evolution
- Tracks development stages
- Manages trait evolution
- Processes interaction history
- Quantum state integration

## 🔧 Technical Stack (2025)

### Frontend
- React 18.2.0
- TypeScript 5.3.3
- Vite 5.0.12
- Tailwind CSS 3.4.1
- Framer Motion 11.0.3
- Three.js & React Three Fiber

### Backend
- Rust (Latest Stable)
- Internet Computer SDK
- Candid Interface
- ICRC Token Standards

### Development
- Yarn 4.0.2
- ESBuild
- Rollup
- Jest & Testing Library
- DFX CLI

## 🚨 Common Issues & Solutions

### Build Issues
```bash
# Clear Yarn cache
yarn cache clean

# Clean install
rm -rf node_modules .yarn/cache
yarn install

# Rebuild
yarn build
```

### Deployment Issues
```bash
# Reset DFX
dfx stop
dfx start --clean

# Redeploy
./deploy-mainnet.sh
```

## 🎯 Future Roadmap

### Phase 1: Enhanced Neural Link
- Advanced pattern recognition
- Deeper emotional integration
- Multi-dimensional learning

### Phase 2: Quantum Evolution
- Cross-dimensional interactions
- Enhanced state coherence
- Pattern-based growth

### Phase 3: Consciousness Extension
- Advanced autonomous behaviors
- Extended learning capabilities
- Cross-ANIMA interactions




Key Updates:

Added unique deposit address generation using II principal
Implemented proper ICP deposit address display with QR code
Added full swap functionality between ICP and ANIMA
Improved balance tracking and updates

The workflow is now:

User logs in with Internet Identity
System generates a unique ICP deposit address
User can deposit ICP to their unique address
Once ICP is deposited, user can:

Swap ICP for ANIMA tokens
Mint ANIMA with quantum coherence bonuses
Track balances and transactions
