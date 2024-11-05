import { Plugin } from 'rollup';
import Config from './config';
import defaults from './defaults';
import processImages from './helpers/image-handling';
import fs from 'fs';

export default function imgResponsiver(userConfig: Partial<Config> = {}): Plugin {
  console.log('Running img-responsiver plugin...');


  // Merge user configuration with default configuration
  const config: Config = { ...defaults, ...userConfig };
  console.log(config);

  // Convert all ambiguous configuration values to arrays
  config.imagesDirs = Array.isArray(config.imagesDirs) ? config.imagesDirs : [config.imagesDirs];
  config.htmlDirs = Array.isArray(config.htmlDirs) ? config.htmlDirs : [config.htmlDirs];

  return {
    name: 'img-responsiver',
    version: '1.0.0',
    async buildStart() {
      if (!fs.existsSync(config.outputDir)) {
        fs.mkdirSync(config.outputDir);
      }

      let hashes: string[] = [];

      for (const imageDir of config.imagesDirs) {
        console.log(`Processing images in directory: ${imageDir}`);
        const hashesOut = await processImages(imageDir, config.imageExtensions, config.conversionSizes, config.outputFileTypes, config.outputDir);
        hashes = hashes.concat(hashesOut);
      }

      console.log('Processed all images.');
      console.log(hashes);
    }
  };
}
