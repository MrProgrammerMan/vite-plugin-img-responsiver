import fs from "fs";
import path from "path";

/**
 * Retrieves all files with specified file types from a given directory.
 *
 * @param {string} dir - The directory to search for files.
 * @param {string[]} fileTypes - An array of file extensions (e.g., ['.jpg', '.png']) to filter the files by.
 * @returns {string[]} - An array of file names with the matching extensions found in the directory.
 */
export default function getFiles(dir: string, fileTypes: string[]): string[] {
  return fs
    .readdirSync(dir) // Synchronously read the contents of the directory
    .filter((file: string) =>
      fileTypes.includes(path.extname(file).toLowerCase())
    ); // Only include files with matching extension
}
