const getMemory = require("./memory-usage");

module.exports = async function metricExecution(
  func,
  label = "timeExecution",
  ...args
) {
  try {
    console.time(label);

    await func.apply(undefined, args);
  } catch (error) {
    console.error(label, ": ", error);
  } finally {
    console.timeEnd(label);
    console.log("memoryUsage:", getMemory());
  }
};
