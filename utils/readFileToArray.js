const chalk = require("chalk");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

const readFileToArray = async (filePath) => {
  const buffer = await readFile(filePath).catch((error) => {
    if (error.message.includes("ENOENT: no such file or directory")) {
      console.log(
        chalk.blue.bold("The selected .env file is no longer present")
      );
      console.log(`Path: ${chalk.green(filePath)}`);
      return;
    } else throw error;
  });
  return buffer && buffer.toString().split("\n");
};

exports.readFileToArray = readFileToArray;
