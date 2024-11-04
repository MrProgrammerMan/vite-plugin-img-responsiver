import sharp from "sharp";
import fs from "fs";

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
        .toFile(`${outputDir}/${outputFileName}-${size}${extension}`)
        .then((info) =>
          console.log(
            `\t\tSaved (${inputPath}) ${info.width}x${info.height} image as ${info.format}`
          )
        );
    })
  );

  try {
    await Promise.all(tasks);
    console.log(`\tGenerated variants for image: ${inputPath}`);
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
