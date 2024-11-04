import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';

export default defineConfig({
  plugins: [Inspect()],
  build: {
    lib: {
      entry: 'src/index.ts',        // Entry point of your plugin
      name: 'ImgResponsiver',        // Global name for UMD build
      fileName: (format) => `img-responsiver.${format}.js`,  // Output file names
      formats: ['es', 'cjs', 'umd']  // Output formats for broad compatibility
    },
    rollupOptions: {
      external: ['sharp', 'path', 'fs'], // Add external dependencies if needed
      output: {
        globals: {
          sharp: 'sharp', // Specify global variable name for the UMD build
          path: 'path',
          fs: 'fs',
        },
      },
    },
  },
});