const inquirerErrorHandler = (error) => {
  if (error.isTtyError) {
    console.error("Prompt couldn't be rendered in the current environment");
  }
  console.error(error);
};

exports.inquirerErrorHandler = inquirerErrorHandler;
