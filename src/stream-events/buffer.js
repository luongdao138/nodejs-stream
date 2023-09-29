const timeExecution = require("../utils/time-execution");

timeExecution(async () => {
  const buff = Buffer.from([255555555555], "utf-8");

  //   console.log(buff);
  //   console.log(buff.toString("hex"));

  //   const buff = Buffer.from("1ag123", "hex");

  console.log(buff.toJSON());
});
