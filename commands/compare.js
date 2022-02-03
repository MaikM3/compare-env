const { prompt } = require("inquirer");
const { ENV_FILES } = require("../constants");
const { compareEnvFiles } = require("../utils/compareEnvFiles");
const { comparePaths } = require("../utils/comparePaths");
const { inquirerErrorHandler } = require("../utils/inquirerErrorHandler");
const { readFileToArray } = require("../utils/readFileToArray");

const conf = new (require("conf"))();

const compare = async () => {
  const storedEnvs = conf.get(ENV_FILES) || [];

  if (storedEnvs.length < 2) {
    console.log(
      chalk.cyan.bold("Need to add at least two .env files to compare!")
    );
  }

  const comparedPaths = comparePaths(storedEnvs);

  const storedEnvChoices = comparedPaths.map((comparedPath, index) => ({
    name: comparedPath,
    value: storedEnvs[index],
  }));

  const firstEnv = await selectEnv(storedEnvChoices);
  const remainingEnvChoices = storedEnvChoices.map((env) => ({
    ...env,
    disabled: env.value === firstEnv,
  }));
  const secondEnv = await selectEnv(remainingEnvChoices);

  const firstFile = await readFileToArray(firstEnv);
  const secondFile = await readFileToArray(secondEnv);
  if (!firstFile || !secondFile) return;

  compareEnvFiles(
    {
      name: storedEnvChoices.find((choice) => choice.value === firstEnv).name,
      file: firstFile,
    },
    {
      name: storedEnvChoices.find((choice) => choice.value === secondEnv).name,
      file: secondFile,
    }
  );
};

const selectEnv = async (choices) => {
  const { choice } = await prompt({
    name: "choice",
    message: "Select an env file to compare",
    type: "list",
    choices,
  }).catch(inquirerErrorHandler);
  return choice;
};

exports.compare = compare;
