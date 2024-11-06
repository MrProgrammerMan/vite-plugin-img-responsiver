import { Plugin } from "vite";
import Config from "./config";
import defaults from "./defaults";
import processImages from "./helpers/image-handling";
import fs from "fs";
import getFiles from "./helpers/getFiles";
import processHtml from "./helpers/html-handling";

export default function imgResponsiver(
  userConfig: Partial<Config> = {}
): Plugin {
  console.log("Running img-responsiver plugin...");

  // Merge user configuration with default configuration
  const config: Config = { ...defaults, ...userConfig };
  console.log("Configuration: ");
  console.log(config);

  return {
    name: "img-responsiver",
    version: "1.0.0",
    async configResolved(viteConfig) {
      // Return if in preview mode
      if (viteConfig.command === "serve" && viteConfig.mode === "production") {
        console.log("Preview mode detected. Skipping plugin img-responsiver.");
        return;
      }

      // Create output directory if it doesn't exist
      if (!fs.existsSync(config.outputDir)) {
        fs.mkdirSync(config.outputDir);
      }
      console.log(`Outputting to directory: ${config.outputDir}`);

      // Ensure that imagesDirs and htmlDirs are arrays. This is in case user has only specified a single directory
      config.imagesDirs = Array.isArray(config.imagesDirs)
        ? config.imagesDirs
        : [config.imagesDirs];

      const htmlDirsArray = Array.isArray(config.htmlDirs)
        ? config.htmlDirs
        : [config.htmlDirs];

      console.log(`Image Directories: ${config.imagesDirs}`);
      const imgTasks: Promise<string[]>[] = config.imagesDirs.map(
        async (imageDir) => {
          console.log(`\tGenerating image variants for directory: ${imageDir}`);
          return await processImages(
            imageDir,
            config.imageExtensions,
            config.conversionSizes,
            config.outputFileTypes,
            config.outputDir
          );
        }
      );

      const allHashes = (await Promise.all(imgTasks)).flat();
      console.log(
        `Generated image variants for all directories: ${config.imagesDirs}`
      );
      console.log(`Generated image hashes: ${allHashes}`);

      console.log(`HTML Directories: ${htmlDirsArray}`);
      const htmlTasks: Promise<void>[] = htmlDirsArray.flatMap((htmlDir) => {
        console.log(`Processing HTML files in directory: ${htmlDir}`);
        return getFiles(htmlDir, [config.htmlFileType]).map(
          async (htmlFile) => {
            console.log(`\tProcessing HTML file: ${htmlFile}`);
            processHtml(
              htmlDir,
              htmlFile,
              config.imgTagRegex,
              allHashes,
              config.outputDir,
              config.conversionSizes,
              config.outputFileTypes
            );
          }
        );
      });

      await Promise.all(htmlTasks);
      console.log("Processed all HTML files in directories: ", htmlDirsArray);
    },
    async closeBundle() {
      const htmlDirsArray = Array.isArray(config.htmlDirs)
        ? config.htmlDirs
        : [config.htmlDirs];

      // <picture> tag regex that captures internal <img> tag
      const pictureTagRegex =
        /<picture>(?:\s*<source[^>]*>\s*)*(<img[^>]*>)\s*<\/picture>/g;

      console.log("Cleaning up html...");
      console.log(`HTML Directories: ${htmlDirsArray}`);
      const htmlTasks: Promise<void>[] = htmlDirsArray.flatMap((htmlDir) => {
        console.log(`Cleaning up HTML files in directory: ${htmlDir}`);
        return getFiles(htmlDir, [config.htmlFileType]).map(
          async (htmlFile) => {
            console.log(`\tCleaning HTML file: ${htmlFile}`);

            // Get file content
            let htmlContent = fs.readFileSync(`${htmlDir}/${htmlFile}`, "utf8");
            // Find all picture tags in the html file
            const matches = htmlContent.matchAll(pictureTagRegex);
            for (const match of matches) {
              const imgTag = match[1]; // <img> tag
              const pictureTag = match[0]; // <picture> tag
              htmlContent = htmlContent.replace(pictureTag, imgTag);
            }
            fs.writeFileSync(`./${htmlDir}/${htmlFile}`, htmlContent);
          }
        );
      });

      await Promise.all(htmlTasks);
      console.log("Cleaned up all HTML files in directories: ", htmlDirsArray);
    },
  };
}
