import { defineConfig } from 'vite';
import imgResponsiver from 'rollup-plugin-img-responsiver'; // Import your plugin

export default defineConfig({
  plugins: [imgResponsiver()]
});