const chalk = require("chalk");
const Table = require("cli-table3");
const { transformEnvFileArray } = require("./transformEnvFileArray");

const compareEnvFiles = (env1, env2) => {
  const transformedFile1 = transformEnvFileArray(env1.file);
  const transformedFile2 = transformEnvFileArray(env2.file);

  const table = new Table({
    head: [
      chalk.green("Key"),
      { content: chalk.green(env1.name) },
      { content: chalk.green(env2.name) },
    ],
    style: { head: [], border: [], compact: true },
  });

  const sharedKeys = transformedFile1.filter(([key1]) =>
    transformedFile2.find(([key2]) => key1 === key2)
  );

  const sharedKeyValues = sharedKeys.filter(([_key1, value1]) =>
    transformedFile2.find(([_key2, value2]) => value1 === value2)
  );

  const sharedKeyValuesCells = sharedKeyValues.map(([key, value]) => [
    key,
    value,
    value,
  ]);

  const sharedKeyValueFilledCells = sharedKeyValuesCells.filter(
    ([_, value]) => !!value.content
  );
  const sharedKeyValueEmptyCells = sharedKeyValuesCells.filter(
    ([_, value]) => !value.content
  );

  table.push(...createSection("Shared keys with same values", [
    ...sharedKeyValueFilledCells,
    ...sharedKeyValueEmptyCells,
  ]));

  const sharedKeyCells = transformedFile1
    .filter(([key1, value1]) =>
      transformedFile2.find(
        ([key2, value2]) => key1 === key2 && value1 !== value2
      )
    )
    .map(([key1, value]) => [
      key1,
      value,
      transformedFile2.find(([key2, value]) => key1 === key2)[1],
    ]);

  table.push(...createSection("Shared keys with different values", sharedKeyCells));

  const uniqueKeysInEnv1 = transformedFile1.filter(
    ([key1]) => !transformedFile2.find(([key2]) => key1 === key2)
  );

  table.push(...createSection(`Unique keys in ${env1.name}`, uniqueKeysInEnv1));

  const uniqueKeysInEnv2 = transformedFile2
    .filter(([key2]) => !transformedFile1.find(([key1]) => key2 === key1))
    .map(([key, value]) => [key, "", value]);

  table.push(...createSection(`Unique keys in ${env2.name}`, uniqueKeysInEnv2));

  console.log(table.toString());
};

exports.compareEnvFiles = compareEnvFiles;

const createSection = (heading, keys) => {
  const noKeys = keys.length === 0;
  const headingText = noKeys
    ? chalk.red.bold(`No ${heading[0].toLowerCase() + heading.slice(1)}`)
    : chalk.green.bold(heading);
  const headingCell = [
    {
      colSpan: 3,
      content: headingText,
      hAlign: "center",
    },
  ];
  return [headingCell, ...keys];
};
