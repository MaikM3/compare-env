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

  table.push(createHeader("Shared keys with same values"));
  table.push(...sharedKeyValueFilledCells);
  table.push(...sharedKeyValueEmptyCells);

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

  table.push(createHeader("Shared keys with different values"));
  table.push(...sharedKeyCells);

  const uniqueKeysInEnv1 = transformedFile1.filter(
    ([key1]) => !transformedFile2.find(([key2]) => key1 === key2)
  );

  table.push(createHeader(`Unique keys in ${env1.name}`));
  table.push(...uniqueKeysInEnv1);

  const uniqueKeysInEnv2 = transformedFile2.filter(
    ([key2]) => !transformedFile1.find(([key1]) => key2 === key1)
  ).map(([key, value]) => [key, "", value]);

  table.push(createHeader(`Unique keys in ${env2.name}`));
  table.push(...uniqueKeysInEnv2);

  console.log(table.toString());
};

exports.compareEnvFiles = compareEnvFiles;

const createHeader = (text) => [
  {
    colSpan: 3,
    content: chalk.green.bold(text),
    hAlign: "center",
  },
];

// create a dict with ALL keys that appear in all envs, then go through and add
// their values as keys on those keys

/*

I want to create something that highlights:

| key    | .env1    | .env2    |
| Shared keys with same values |
| A_B    | one      | one      |
| E_F    |          |          |
| Shared keys with different values |
| C_D    | one      | two      |
| Unique keys in .env1         |
| G_H    | three               |
| I_J    |                     |
| Unique keys in .env2         |
| K_L    | four                |
| M_N    |                     |


*/
