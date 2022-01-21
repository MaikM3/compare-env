const inquirer = require("inquirer");
const getFiles = require("../utils/getFiles");

const conf = new (require("conf"))();

const ENV_FILES = "compareEnvs.envs.files";

const add = async () => {
  const cwd = process.cwd();
  const cwdFilePrefix = `${cwd}/`;

  const storedEnvs = conf.get(ENV_FILES) || [];

  const files = getFiles(cwd);
  const envFiles = files.filter((file) => file.includes(".env"));

  const choices = envFiles.map((file) => ({
    name: file.replace(cwdFilePrefix, ""),
    value: file,
    disabled: storedEnvs.includes(file) && "Already added",
  }));

  const { chosenEnvs } = await inquirer
    .prompt({
      name: "chosenEnvs",
      message: "Choose any number of .env files to add\n",
      type: "checkbox",
      choices,
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.error("Prompt couldn't be rendered in the current environment");
      }
      console.error(error);
    });

  const uniqueEnvPaths = [...new Set([...storedEnvs, ...chosenEnvs])];
  conf.set(ENV_FILES, uniqueEnvPaths);

  const check = conf.get(ENV_FILES);
  console.log("check :>> ", check);
};

module.exports = add;
