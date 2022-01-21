/**
 * Basic error handling for inquirer prompts
 * 
 * @param {error} error - The inquirer error
 */
const inquirerErrorHandler = (error) => {
  if (error.isTtyError) {
    console.error("Prompt couldn't be rendered in the current environment");
  }
  console.error(error);
};

exports.inquirerErrorHandler = inquirerErrorHandler;
