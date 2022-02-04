const chalk = require("chalk");

const addHelpText = `
The add command will search recursively from the current working directory, and offer any discovered .env files to be registered.

The paths to the .env files will be displayed relative to the current working directory, for simplicity.

For example, given a file structure:

${chalk.green(`Users/
├─ your.user/
│  ├─ projects/
│  │  ├─ project1/
│  │  │  ├─ .env
│  │  │  ├─ .env.template
│  │  ├─ project2/
│  │  │  ├─ .env
│  │  │  ├─ .env.template`)}

If the current working directory is ${chalk.green(
  "/Users/your.user/projects/"
)}, the add command will discover and offer:
- ${chalk.green("project1/.env")}
- ${chalk.green("project1/.env.template")}
- ${chalk.green("project2/.env")}
- ${chalk.green("project2/.env.template")}

The absolute paths to the selected .env files will be registered for use with the compare command.

Example:
  compare-env add`;

const compareHelpText = `
The compare command will allow you to choose any registered .env files, or paste contents on an .env file, for comparison.  

The paths to the .env files will be relative to the current working directory.

For example, given a file structure:
${chalk.green(`Users/
├─ your.user/
│  ├─ projects/
│  │  ├─ project1/
│  │  │  ├─ .env          ${chalk.white("(registered)")}
│  │  │  ├─ .env.template 
│  │  ├─ project2/
│  │  │  ├─ .env          ${chalk.white("(registered)")}
│  │  │  ├─ .env.template`)}

If the current working directory is ${chalk.green(
  "/Users/your.user/projects/"
)}, the compare command will present the registered .env files as:
- ${chalk.green("project1/.env")}
- ${chalk.green("project2/.env")}

If the current working directory is ${chalk.green(
  "/Users/your.user/projects/project1"
)}, the compare command will present the registered .env files as:
- ${chalk.green(".env")}
- ${chalk.green("../project2/.env")}

After selecting (or pasting in) two .env files, the files will be read and compared.

Example:
  compare-env compare`;

exports.addHelpText = addHelpText;
exports.compareHelpText = compareHelpText;
