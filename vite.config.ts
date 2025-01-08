import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'process': 'process/browser',
        'stream': 'stream-browserify',
        'zlib': 'browserify-zlib',
        'util': 'util',
        'buffer': 'buffer'
      }
    },
    define: {
      'process.env': env,
      global: 'globalThis',
    },
    build: {
      rollupOptions: {
        external: [],
        output: {
          manualChunks: {
            'three-vendor': ['three', 'three-stdlib'],
            'react-vendor': ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
            'ic-vendor': [
              '@dfinity/agent',
              '@dfinity/auth-client',
              '@dfinity/candid',
              '@dfinity/principal'
            ]
          }
        }
      },
      chunkSizeWarningLimit: 1600,
      sourcemap: true,
      minify: 'esbuild',
      target: 'es2020',
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020',
      },
      exclude: ['@dfinity/agent', '@dfinity/candid', '@dfinity/principal']
    },
  }
});