const transformEnvFileArray = (fileArray) =>
  fileArray.map((line) => line.split("="));

exports.transformEnvFileArray = transformEnvFileArray;
