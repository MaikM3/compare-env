const inquirer = require("inquirer");
const getFiles = require("../utils/getFiles");

const conf = new (require('conf'))()

const ENV_FILES = 'compare-envs.envs.files'

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

  const { chosenEnvs } = await inquirer
    .prompt({
      name: "chosenEnvs",
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

  const storedEnvs = conf.get(ENV_FILES)
  const envPathsToStore = chosenEnvs.map(chosenEnv => envFileMap[chosenEnv])

  const uniqueEnvPaths = [...new Set([...(storedEnvs ? storedEnvs : []), ...envPathsToStore])]
  conf.set(ENV_FILES, uniqueEnvPaths)

  const check = conf.get(ENV_FILES)
  console.log('check :>> ', check);
};

module.exports = add;
