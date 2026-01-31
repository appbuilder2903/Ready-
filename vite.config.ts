import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    host: true
  },
  build: {
    // Production optimizations
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ai-vendor': ['@google/genai'],
          'ui-vendor': ['lucide-react']
        }
      }
    },
    // Increase chunk size warning limit for large app
    chunkSizeWarningLimit: 1000,
    // Source maps for production debugging (optional, can be disabled)
    sourcemap: false
  },
  // Environment variable configuration
  envPrefix: 'VITE_',
  define: {
    // Ensure process.env is available for compatibility
    'process.env': {}
  }
})