import sharp from "sharp";
import fs from "fs";
import hash from "./hash";
import getFiles from "./getFiles";

/**
 * Generates various sizes and formats of the given input image.
 *
 * @param inputPath Path of the image to generate variants from.
 * @param sizes The sizes of variants to generate, given in pixels. (Aspect ratio is preserved, but both dimensions are capped to this size)
 * @param extensions The different file types to generate. Allows for both modern formats like .avif and more compatible formats like .jpg
 * @param outputFileName Name of the output file. Will be suffixed with '-[size].extension'
 * @param outputDir The directory to output variants to.
 */
export async function generateImageVariants(
  inputPath: string,
  sizes: number[],
  extensions: string[],
  outputFileName: string,
  outputDir: string
): Promise<void> {
  // Array to store all the promises for each image processing task
  const tasks: Promise<void>[] = sizes.flatMap((size) =>
    extensions.map((extension) => {
      const outputPath = `${outputDir}/${outputFileName}-${size}${extension}`;
      if (fs.existsSync(outputPath)) {
        return Promise.resolve();
      }
      return sharp(inputPath)
        .resize(size, size, { fit: "inside" })
        .toFile(outputPath)
        .then((info) =>
          console.log(
            `\t\t\tSaved (${inputPath}) ${info.width}x${info.height} image as ${info.format}`
          )
        );
    })
  );

  try {
    await Promise.all(tasks);
    console.log(`\t\tGenerated variants for image: ${inputPath}`);
  } catch (err) {
    throw new Error(`Error generating image variants: ${err}`);
  }
}

/**
 * Ensures that the sizes array is capped to the dimensions of the input image.
 * Note: will ensure the sizes array does not contain sizes larger than the input image.
 * If the image is larger than all sizes, the maximum dimension will NOT be added.
 *
 * @param sizes The sizes to cap.
 * @param inputPath The path of the input image.
 * @returns An array of capped sizes.
 */
export async function capSizes(
  sizes: number[],
  inputPath: string
): Promise<number[]> {
  const { width, height } = await sharp(inputPath).metadata();
  const maxDimension: number = Math.max(width as number, height as number);

  let sizesCapped: number[] = sizes.filter((size) => size <= maxDimension);

  if (maxDimension < Math.max(...sizes)) {
    sizesCapped.push(maxDimension);
  }

  return sizesCapped;
}

/**
 * Processes all images in a given directory by generating multiple resized and reformatted variants of each image.
 *
 * @param imageDir The directory containing the images to be processed.
 * @param extensions The file extensions of images to be processed, e.g., '.jpg' or ['.jpg', '.png'].
 * @param sizes An array of sizes for image variants to generate, given in pixels. Each size represents the maximum dimension while preserving aspect ratio.
 * @param outputFileTypes The file formats for output variants, allowing both modern formats like '.avif' and standard formats like '.jpg'.
 * @param outputDir The directory where the processed image variants will be saved.
 * @returns A Promise that resolves to an array of unique hashes representing the filenames of all processed images.
 */
export default async function processImages(
  imageDir: string,
  extensions: string[],
  sizes: number[],
  outputFileTypes: string[],
  outputDir: string
): Promise<string[]> {
  const tasks = getFiles(imageDir, extensions).map(async (file) => {
    let inputPath: string = `${imageDir}/${file}`.replace(/\\/g, '/'); // Normalize path separators
    if (!inputPath.startsWith('./')) {
      inputPath = `./${inputPath}`;
    }
    console.log(`\t\tProcessing image: ${inputPath}`);
    const outputFileName = hash(inputPath).toString();
    const sizesCapped = await capSizes(sizes, inputPath);
    await generateImageVariants(
      inputPath,
      sizesCapped,
      outputFileTypes,
      outputFileName,
      outputDir
    );
    return outputFileName;
  });

  try {
    const hashes: string[] = await Promise.all(tasks);
    console.log(`\tProcessed images in directory: ${imageDir}`);
    return hashes;
  } catch (err) {
    throw new Error(`Error processing images: ${err}`);
  }
}
