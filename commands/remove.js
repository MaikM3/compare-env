const { prompt } = require("inquirer");
const { ENV_FILES } = require("../constants");
const { comparePaths } = require("../utils/comparePaths");
const { inquirerErrorHandler } = require("../utils/inquirerErrorHandler");

const conf = new (require("conf"))();

const remove = async () => {
  const storedEnvs = conf.get(ENV_FILES) || [];

  const comparedPaths = comparePaths(storedEnvs);

  const choices = comparedPaths.map((comparedPath, index) => ({
    name: comparedPath,
    value: storedEnvs[index],
  }));

  const { chosenEnvs } = await prompt({
    name: "chosenEnvs",
    message: "Choose any number of .env files to remove\n",
    type: "checkbox",
    choices,
    loop: false,
  }).catch(inquirerErrorHandler);

  const filteredEnvPaths = storedEnvs.filter(storedEnv => !chosenEnvs.includes(storedEnv));
  conf.set(ENV_FILES, filteredEnvPaths);
};

exports.remove = remove;
