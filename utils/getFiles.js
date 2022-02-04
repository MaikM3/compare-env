const { resolve } = require("path");
const { readdirSync, statSync } = require("fs");

/**
 * Recursively finds all files in a directory
 *
 * @param {string} dir - The directory to start searching from
 * @returns {Array} Array of filepaths
 */
const getFiles = (dir) => {
  try {
    const subdirs = readdirSync(dir);
    const files = subdirs.map((subdir) => {
      const path = resolve(dir, subdir);
      return (statSync(path)).isDirectory() ? getFiles(path) : path;
    });
    return files.flat();
  } catch (error) {
    console.log(error.message);
    return []
  }
}

exports.getFiles = getFiles;
