type imgTypes = ".jpg" | "jpeg" | ".png" | ".webp" | ".avif" | ".gif" | ".tiff";
type inputImgTypes = imgTypes | ".svg";

/**
 * Configuration object for handling image processing and HTML conversion.
 */
export default interface Config {
  /**
   * Root directory for source code and assets.
   */
  rootDir: string;
  /**
   * Directories where the source images are located.
   * 
   * @type {string | string[]}
   */
  imagesDirs: string | string[];
  /**
   * List of image file extensions to be processed.
   * 
   * @type {string[]}
   */
  imageExtensions: inputImgTypes[];
  /**
   * List of target sizes (in pixels) for converting image files.
   * Images will maintain their aspect ratio, and the largest dimension (width or height) 
   * will be scaled to the specified values.
   * 
   * @type {number[]}
   */
  conversionSizes: number[];
  /**
   * List of output image file formats, in order of priority.
   * 
   * @type {string[]}
   */
  outputFileTypes: imgTypes[];
  /**
   * Directories containing the HTML files to be processed.
   * 
   * @type {string | string[]}
   */
  htmlDirs: string | string[];
  /**
   * File extension for the HTML files.
   * 
   * @type {string}
   */
  htmlFileType: string;
  /**
   * Regular expression for tags to replace in HTML files.
   * 
   * @type {RegExp}
   */
  imgTagRegex: RegExp;
}