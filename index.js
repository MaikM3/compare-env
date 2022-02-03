#! /usr/bin/env node

const { program } = require("commander");
const { add } = require("./commands/add");
const { compare } = require("./commands/compare");

// Add a path to an .env file for later comparison. Will either take a
// path, or search from current directory to find .env files
program
  .command("add")
  .description("Add an .env file for comparison")
  .action(add);

// Compare two envs
program
  .command("compare")
  .description("Compare two .env files")
  .action(compare);

program.parse();
