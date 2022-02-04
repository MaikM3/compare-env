const { prompt } = require("inquirer");
const { ENV_FILES } = require("../constants");
const { compareEnvFiles } = require("../utils/compareEnvFiles");
const { comparePaths } = require("../utils/comparePaths");
const { inquirerErrorHandler } = require("../utils/inquirerErrorHandler");
const { readFileToArray } = require("../utils/readFileToArray");

const conf = new (require("conf"))();

process.env.EDITOR = "nano";

const PASTE_CHOICE = "Paste .env file contents";

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
  const firstFile = await fetchOrPasteEnv(firstEnv);

  const remainingEnvChoices = storedEnvChoices.map((env) => ({
    ...env,
    disabled: env.value === firstEnv,
  }));

  const secondEnv = await selectEnv(remainingEnvChoices);
  const secondFile = await fetchOrPasteEnv(secondEnv);

  if (!firstFile || !secondFile) return;

  compareEnvFiles(
    {
      name: storedEnvChoices.find((choice) => choice.value === firstEnv)?.name || 'First env (pasted)',
      file: firstFile,
    },
    {
      name: storedEnvChoices.find((choice) => choice.value === secondEnv)?.name || 'Second env (pasted)',
      file: secondFile,
    }
  );
};

const selectEnv = async (choices) => {
  const { choice } = await prompt({
    name: "choice",
    message: "Select an env file to compare",
    type: "list",
    choices: [...choices, PASTE_CHOICE],
    loop: false,
  }).catch(inquirerErrorHandler);
  return choice;
};

const pasteEnv = async () => {
  const { paste } = await prompt({
    name: "paste",
    message: "Paste in an .env file",
    type: "editor",
  }).catch(inquirerErrorHandler);
  return paste;
};

const fetchOrPasteEnv = async (env) =>
  env === PASTE_CHOICE
    ? (await pasteEnv()).split("\n").filter(Boolean).sort()
    : await readFileToArray(env);

exports.compare = compare;
