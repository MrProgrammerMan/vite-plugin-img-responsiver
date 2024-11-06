import fs from "fs";
import path from "path";
import hash from "./hash";
import { capSizes } from "./image-handling";

/**
 * Generates an HTML `<picture>` tag that references different image sources for various file types and sizes.
 *
 * @param {string} imageFileName - The original image file name (e.g., 'image.jpg').
 * @param {string} originalImgTag - The original `<img>` tag to be used as a fallback within the `<picture>` tag.
 * @param {string[]} fileTypes - An array of image file formats (e.g., ['.webp', '.avif', '.jpg']) to be included in `<source>` elements.
 * @param {number[]} sizes - An array of image sizes (e.g., [240, 480, 768]) representing the widths the image will be scaled to.
 * @param {string} relativeImgDir - The relative path to the image directory from the HTML file.
 * @returns {string} - An HTML `<picture>` tag with `<source>` elements for each file type and size, followed by the original `<img>` tag as a fallback.
 */
export function generateHtmlPictureTag(
  imageFileName: string,
  originalImgTag: string,
  fileTypes: string[],
  sizes: number[],
  relativeImgDir: string
): string {
  let htmlPicContent = "<picture>";

  // Loop through each file type (e.g., .webp, .avif) and generate a <source> element
  for (const fileType of fileTypes) {
    htmlPicContent += `<source type="image/${fileType.split(".")[1]}" srcset="`;

    // Loop through each size and add corresponding image file to the srcset
    for (const size of sizes) {
      htmlPicContent += `${relativeImgDir}/${imageFileName}-${size}${fileType} ${size}w,`;
    }

    // Remove the trailing comma from the srcset and close the <source> tag
    htmlPicContent = htmlPicContent.slice(0, -1) + '">';
  }

  // Add the original <img> tag as a fallback within the <picture> tag
  htmlPicContent += originalImgTag + "</picture>";

  return htmlPicContent;
}

/**
 * Processes an HTML file by replacing all <img> tags with <picture> tags containing multiple image sources.
 *
 * @param htmlDir - The directory containing the HTML file.
 * @param htmlFile - The name of the HTML file to process.
 * @param imgTagRegex - The regular expression used to match <img> tags in the HTML file.
 * @param allHashes - An array of unique hashes representing the filenames of all processed images.
 * @param imageDir - The directory where the processed images are stored.
 * @param conversionSizes - An array of sizes for image variants to generate, given in pixels.
 * @param outputFileTypes - An array of image file formats for output variants.
 */
export default async function processHtml(
  htmlDir: string,
  htmlFile: string,
  imgTagRegex: RegExp,
  allHashes: string[],
  imageDir: string,
  conversionSizes: number[],
  outputFileTypes: string[]
): Promise<void> {
  // Get file content
  let htmlContent = fs.readFileSync(`${htmlDir}/${htmlFile}`, "utf8");
  // Find all img tags in the html file
  const matches = htmlContent.matchAll(imgTagRegex);
  for (const match of matches) {
    const src = match[1]; // <img> src attribute
    const original = match[0]; // Original <img> tag
    const pictureTag = await handleMatch(
      src,
      original,
      htmlDir,
      imageDir,
      allHashes,
      conversionSizes,
      outputFileTypes
    );
    if (pictureTag === "") {
      continue; // Skip if image hasnt been processed
    }
    htmlContent = htmlContent.replace(original, pictureTag);
  }
  fs.writeFileSync(`./${htmlDir}/${htmlFile}`, htmlContent);
  console.log("Processed HTML file: ", htmlFile);
}

/**
 * Handles the match of an image tag in an HTML file.
 *
 * @param src - The source of the image tag.
 * @param original - The original image tag.
 * @param htmlDir - The directory containing the HTML file.
 * @param imageDir - The directory containing the processed images.
 * @param allHashes - An array of unique hashes representing the filenames of all processed images.
 * @param conversionSizes - An array of sizes for image variants to generate, given in pixels.
 * @param outputFileTypes - An array of image file formats for output variants.
 * @returns
 */
export async function handleMatch(
  src: string,
  original: string,
  htmlDir: string,
  imageDir: string,
  allHashes: string[],
  conversionSizes: number[],
  outputFileTypes: string[]
): Promise<string> {
  // Construct the path to the image from root (where this script runs)
  let ogImagePath = path.join(htmlDir, src);
  if (!ogImagePath.startsWith("./")) {
    ogImagePath = `./${ogImagePath}`;
  }

  const newFileName = hash(ogImagePath.replace(/\\/g, "/")).toString();

  if (!allHashes.includes(newFileName)) {
    console.log("Skipping image tag: ", src);
    return ""; // Skip if image hasnt been processed
  }

  const relativeImgDir = "./" + path.relative(htmlDir, imageDir);
  const sizes = await capSizes(conversionSizes, ogImagePath); // Cap sizes based on original image dimensions
  console.log(`Capped sizes for ${ogImagePath}: ${sizes}`);

  return generateHtmlPictureTag(
    newFileName,
    original,
    outputFileTypes,
    sizes,
    relativeImgDir
  );
}
