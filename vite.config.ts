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
      external: [], // Add external dependencies if needed
    }
  }
});