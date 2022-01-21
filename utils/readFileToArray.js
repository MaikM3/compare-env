const fs = require("fs");

const readFileToArray = (filePath) => {
  const file = fs.readFileSync(filePath).toString();
  return file.split("\n");
};

exports.readFileToArray = readFileToArray;
