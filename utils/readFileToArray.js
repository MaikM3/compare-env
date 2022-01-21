const fs = require("fs");

const readFileToArray = (filePath) => {
  const file = fs.readFileToArraySync(filePath).toString();
  return file.split("\n");
};

exports.readFileToArray = readFileToArray;
