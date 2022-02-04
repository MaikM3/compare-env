const path = require("path");
/**
 * Prepares any number of envPaths and replaces their common parts with "..", relative to the current working directory.
 *
 * @param  {Array} envPaths
 * @returns
 */
const comparePaths = (envPaths) => {
  const cwd = process.cwd();

  const relativeEnvPaths = envPaths.map((envPath) =>
    path.relative(cwd, envPath)
  );

  const splitenvPaths = relativeEnvPaths.map((envPath) =>
    envPath.split("/").filter(Boolean)
  );

  const longestPathIndex = splitenvPaths.reduce(
    (longestIndex, splitPath, index) =>
      splitPath.length > splitenvPaths[longestIndex].length
        ? index
        : longestIndex,
    0
  );
  const longestPath = splitenvPaths[longestPathIndex];

  let replacedEnvPaths = splitenvPaths.map(() => []);

  longestPath.forEach((segment, index) => {
    const correspondingSegments = splitenvPaths.map(
      (splitPath) => splitPath[index]
    );

    const allSegmentsTheSame = new Set(correspondingSegments).size === 1;

    if (allSegmentsTheSame) {
      const firstTwoCharactersOfSegment = segment.slice(0, 2)
      replacedEnvPaths.forEach((envPath) => envPath.push(firstTwoCharactersOfSegment));
    } else {
      replacedEnvPaths.forEach((envPath, index) => {
        const correspondingSegment = correspondingSegments[index];
        if (correspondingSegment) envPath.push(correspondingSegment);
      });
    }
  });

  return replacedEnvPaths.map((replacedPath) => replacedPath.join("/"));
};

exports.comparePaths = comparePaths;
