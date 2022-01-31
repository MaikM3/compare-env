const { prompt } = require("inquirer");
const { ENV_FILES } = require("../constants");
const { compareEnvFiles } = require("../utils/compareEnvFiles");
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

  const firstEnv = await selectEnv(storedEnvs);
  const remainingEnvs = storedEnvs.map((env) => ({
    value: env,
    disabled: env === firstEnv,
  }));
  const secondEnv = await selectEnv(remainingEnvs);

  const firstFile = await readFileToArray(firstEnv);
  const secondFile = await readFileToArray(secondEnv);
  if (!firstFile || !secondFile) return;

  compareEnvFiles(
    { name: firstEnv, file: firstFile },
    { name: secondEnv, file: secondFile }
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
