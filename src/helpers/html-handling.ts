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
export default function generateHtmlPictureTag (imageFileName: string, originalImgTag: string, fileTypes: string[], sizes: number[], relativeImgDir: string): string {
  let htmlPicContent = "<picture>";

  // Loop through each file type (e.g., .webp, .avif) and generate a <source> element
  for (const fileType of fileTypes) {
    htmlPicContent += `<source type="image/${fileType.split('.')[1]}" srcset="`;

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
};