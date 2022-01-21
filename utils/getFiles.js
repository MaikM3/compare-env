const { promisify } = require('util');
const { resolve } = require('path');
const fs = require('fs');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

/**
 * Recursively finds all files in a directory
 * 
 * @param {string} dir - The directory to start searching from
 * @returns {Array} Array of filepaths
 */
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.reduce((a, f) => a.concat(f), []);
}

module.exports = getFiles