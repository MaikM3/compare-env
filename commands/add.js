const chalk = require("chalk");
const { prompt } = require("inquirer");
const { ENV_FILES } = require("../constants");
const { compareArrays } = require("../utils/compareArrays");
const { getFiles } = require("../utils/getFiles");
const { inquirerErrorHandler } = require("../utils/inquirerErrorHandler");

const conf = new (require("conf"))();

const add = async () => {
  const cwd = process.cwd();
  const cwdFilePrefix = `${cwd}/`;

  const storedEnvs = conf.get(ENV_FILES) || [];

  const files = getFiles(cwd);
  const envFiles = files.filter((file) => file.includes(".env"));

  const noNewEnvs = compareArrays(storedEnvs, envFiles);
  if (noNewEnvs) {
    console.log(
      chalk.cyan.bold(
        "No .env files exist within this directory that you haven't already added!"
      )
    );
    return;
  }

  const choices = envFiles.map((file) => ({
    name: file.replace(cwdFilePrefix, ""),
    value: file,
    disabled: storedEnvs.includes(file) && "Already added",
  }));

  const { chosenEnvs } = await prompt({
    name: "chosenEnvs",
    message: "Choose any number of .env files to add\n",
    type: "checkbox",
    choices,
  }).catch(inquirerErrorHandler);

  const uniqueEnvPaths = [...new Set([...storedEnvs, ...chosenEnvs])];
  conf.set(ENV_FILES, uniqueEnvPaths);
};

exports.add = add;
