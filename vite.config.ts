import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'stream': 'stream-browserify',
      'buffer': 'buffer',
      'util': 'util',
      'process': 'process/browser',
      'react': 'react'
    }
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
      DFX_NETWORK: JSON.stringify(process.env.DFX_NETWORK || 'ic'),
      CANISTER_ID_ANIMA: JSON.stringify(process.env.CANISTER_ID_ANIMA),
      CANISTER_ID_ANIMA_ASSETS: JSON.stringify(process.env.CANISTER_ID_ANIMA_ASSETS)
    },
    global: 'globalThis',
    _global: 'globalThis'
  },
  build: {
    target: 'esnext',
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: process.env.NODE_ENV === 'production',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
      defaultIsModuleExports: true
    },
    rollupOptions: {
      external: [
        '@dfinity/nns-proto',
        'fsevents',
        /\.rs$/
      ],
      output: {
        globals: {
          '@dfinity/nns-proto': 'dfinity_nns_proto',
          'react': 'React',
          'react-dom': 'ReactDOM'
        },
        format: 'es',
        manualChunks: {
          'neural-interface': [
            './src/components/neural-link/IntegratedNeuralLinkInterface.tsx',
            './src/components/neural-link/ImmersiveInterface.tsx',
            './src/components/neural-link/NeuralPatternVisualizer.tsx'
          ],
          'quantum-vault': [
            './src/components/quantum-vault/CyberpunkQuantumVault.tsx',
            './src/components/quantum-vault/NetworkStatus.tsx'
          ],
          'consciousness': [
            './src/components/personality/ConsciousnessMetrics.tsx',
            './src/components/personality/EmotionVisualizer.tsx',
            './src/components/personality/WaveformGenerator.tsx',
            './src/components/personality/PersonalityTraits.tsx'
          ],
          'media': [
            './src/components/media/EnhancedMediaController.tsx',
            './src/components/media/MediaPlayer.tsx'
          ],
          'quantum-core': [
            './src/quantum/dimensional_state.ts',
            './src/quantum/types.ts',
            './src/services/quantum-state.service.ts'
          ]
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      '@dfinity/agent',
      '@dfinity/auth-client',
      '@dfinity/principal',
      '@dfinity/candid',
      '@dfinity/identity',
      '@dfinity/ledger-icp',
      'buffer',
      'process/browser',
      'events',
      'util',
      'stream-browserify'
    ],
    exclude: [
      '**/*.rs'
    ],
    esbuildOptions: {
      target: 'esnext',
      supported: { bigint: true },
      define: {
        global: 'globalThis'
      },
      jsx: 'automatic',
      platform: 'browser'
    }
  },
  assetsInclude: ['**/*.did']
});