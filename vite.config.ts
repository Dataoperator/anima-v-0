import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Define component groups for chunking
const ANIMA_CORE = [
  'AnimaPage',
  'CyberpunkQuantumVault',
  'UnifiedNeuralLink',
  'GenesisPage',
  'MintAnima'
];

const QUANTUM_COMPONENTS = [
  'QuantumCore',
  'QuantumField',
  'QuantumStateVisualizer',
  'QuantumVault'
];

const NEURAL_COMPONENTS = [
  'NeuralGrid',
  'NeuralInterface',
  'NeuralLink',
  'NeuralMantra'
];

const PAYMENT_COMPONENTS = [
  'PaymentPanel',
  'ICPPaymentPanel',
  'PaymentHistory',
  'TransactionHistory'
];

export default defineConfig({
  plugins: [
    react()
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'global': 'globalThis',
    '__IC_FETCH_ROOT_KEY__': true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    target: 'esnext',
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('@dfinity')) return 'vendor-dfinity';
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('three') || id.includes('@react-three')) return 'vendor-three';
            if (id.includes('framer-motion')) return 'vendor-animation';
            return 'vendor';
          }

          // App chunks
          const filepath = id.toLowerCase();

          // Core ANIMA features
          if (ANIMA_CORE.some(component => filepath.includes(component.toLowerCase()))) {
            return 'anima-core';
          }

          // Quantum-related components
          if (QUANTUM_COMPONENTS.some(component => filepath.includes(component.toLowerCase()))) {
            return 'quantum-features';
          }

          // Neural network components
          if (NEURAL_COMPONENTS.some(component => filepath.includes(component.toLowerCase()))) {
            return 'neural-features';
          }

          // Payment and transaction components
          if (PAYMENT_COMPONENTS.some(component => filepath.includes(component.toLowerCase()))) {
            return 'payment-features';
          }

          // Authentication and initialization
          if (filepath.includes('/auth/') || filepath.includes('initialization')) {
            return 'auth-system';
          }

          // Services and utilities
          if (filepath.includes('/services/') || filepath.includes('/utils/')) {
            return 'core-services';
          }

          // Context providers
          if (filepath.includes('/contexts/') || filepath.includes('/providers/')) {
            return 'app-context';
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  },
  optimizeDeps: {
    include: [
      '@dfinity/agent',
      '@dfinity/auth-client',
      '@dfinity/principal',
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      '@react-three/postprocessing'
    ],
    exclude: ['@dfinity/ic']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943',
        changeOrigin: true
      }
    }
  }
});