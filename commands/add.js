const inquirer = require("inquirer");
const getFiles = require("../utils/getFiles");

const add = async () => {
  const cwd = process.cwd();
  const cwdFilePrefix = `${cwd}/`;

  const files = getFiles(cwd);
  const envFiles = files.filter((file) => file.includes(".env"));
  const envFileEntries = envFiles.map((file) => [
    file.replace(cwdFilePrefix, ""),
    file,
  ]);
  const envFileMap = Object.fromEntries(envFileEntries);

  const choice = await inquirer
    .prompt({
      name: "envs",
      message: "Choose any number of .env files to add\n",
      type: "checkbox",
      choices: Object.keys(envFileMap),
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.error("Prompt couldn't be rendered in the current environment");
      }
      console.error(error);
    });

  console.log("choice :>> ", choice);
};

module.exports = add;
