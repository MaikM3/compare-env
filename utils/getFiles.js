const { resolve } = require("path");
const { readdirSync, statSync } = require("fs");

/**
 * Recursively finds all files in a directory
 *
 * @param {string} dir - The directory to start searching from
 * @returns {Array} Array of filepaths
 */
function getFiles(dir) {
  const subdirs = readdirSync(dir);
  const files = subdirs.map((subdir) => {
    const path = resolve(dir, subdir);
    return (statSync(path)).isDirectory() ? getFiles(path) : path;
  });
  return files.flat();
}

module.exports = getFiles;
