import fs from "fs";
import path from "path";

/**
 * Logs a message to the console.
 * 
 * @param {string} message - The message to log to the console.
 */
export function log (message: string) {
  console.log(message);
}

/**
 * Retrieves all files with specified file types from a given directory.
 * 
 * @param {string} dir - The directory to search for files.
 * @param {string[]} fileTypes - An array of file extensions (e.g., ['.jpg', '.png']) to filter the files by.
 * @returns {string[]} - An array of file names with the matching extensions found in the directory.
 */
export function getFiles (dir: string, fileTypes : string[]) {
  return fs.readdirSync(dir) // Synchronously read the contents of the directory
    .filter((file: string) => fileTypes.includes(path.extname(file).toLowerCase())); // Only include files with matching extension
};