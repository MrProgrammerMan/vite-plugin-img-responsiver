import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import sharp from 'sharp';
import processImages from '../src/helpers/image-handling';
import hash from '../src/helpers/hash';

// Helper function to create a dummy image
async function createDummyImage(filePath, width, height) {
  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  }).toFile(filePath);
}

describe('processImages Integration Test', () => {
  let tempInputDir: string;
  let tempOutputDir: string;

  beforeAll(async () => {
    // Create temporary directories in the system's temporary folder
    const tempInputDirAbsolute = await fs.mkdtemp(
      path.join(os.tmpdir(), 'temp_input_')
    );
    tempOutputDir = await fs.mkdtemp(path.join(os.tmpdir(), "temp_output_"));
    tempInputDir = path.relative(process.cwd(), tempInputDirAbsolute);
    console.log(
      `Created temporary directories: ${tempInputDir}, ${tempOutputDir}`
    );
    console.log(`Absolute input directory: ${tempInputDirAbsolute}`);

    // Create a sample image
    await createDummyImage(tempInputDirAbsolute + "\\test.jpg", 800, 600);
  });

  it('should process images and generate resized variants in multiple formats', async () => {
    const sizes = [200, 400, 600]; // sizes for resizing
    const extensions = ['.jpg']; // input extensions to look for
    const outputFileTypes = ['.jpg', '.png']; // output formats to generate

    // Run processImages
    const resultHashes = await processImages(
      tempInputDir,
      extensions,
      sizes,
      outputFileTypes,
      tempOutputDir
    );

    // Verify that the returned hash matches the expected hash of the test image
    const testImagePath = './' + tempInputDir + '/test.jpg';
    console.log(`Test image path being hashed: ${testImagePath}`);
    const expectedHash = hash(testImagePath.replace(/\\/g, '/')).toString();
    expect(resultHashes).toContain(expectedHash);

    // Verify the expected output files exist
    for (const size of sizes) {
      for (const format of outputFileTypes) {
        const outputFilePath = path.join(
          tempOutputDir,
          `${expectedHash}-${size}${format}`
        );
        const fileExists = await fs
          .stat(outputFilePath)
          .then(() => true)
          .catch(() => false);
        expect(fileExists).toBe(true);

        const metadata = await sharp(outputFilePath).metadata();
        if (metadata.format === 'jpeg') {
          metadata.format = 'jpg';
        }
        expect(metadata.format).toBe(format.replace('.', ''));
        expect(metadata.width).toBeLessThanOrEqual(size);
        expect(metadata.height).toBeLessThanOrEqual(size);
      }
    }
  });
});
