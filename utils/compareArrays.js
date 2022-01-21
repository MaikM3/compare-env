/**
 * Predicte that compares two arrays containing strings/numbers. Will not handle
 * deep object or array comparison.
 *
 * @param {Array} arr1 - The first array
 * @param {Array} arr2 - The second array
 * @returns {boolean} If the arrays contains the same elements
 */
const compareArrays = (arr1, arr2) =>
  arr1.length === arr2.length &&
  JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());

exports.compareArrays = compareArrays;
