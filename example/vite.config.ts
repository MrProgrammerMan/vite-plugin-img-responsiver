import { defineConfig } from 'vite';
import imgResponsiver from 'rollup-plugin-img-responsiver'; // Import your plugin

export default defineConfig({
  plugins: [
    imgResponsiver({
      imagesDirs: ["./src/assets/imgs"],
      imageExtensions: [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      conversionSizes: [240, 480, 768, 1280, 1920],
      outputFileTypes: [".avif", ".webp", ".jpg"],
      outputDir: "img-responsiver-output",
      htmlDirs: ["./", "./src/assets/html"],
      htmlFileType: ".html",
      imgTagRegex: /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/g,
    })
  ]
});