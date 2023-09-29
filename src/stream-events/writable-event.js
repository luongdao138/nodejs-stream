const fs = require("node:fs/promises");
const timeExecution = require("../utils/time-execution");
const { join } = require("node:path");
const { pipeline } = require("node:stream");

timeExecution(async () => {
  console.log("Learn more about writable stream events");
  const writeHandle = await fs.open(
    join(__dirname, "../resources/custom", "text-small.txt"),
    "w"
  );
  const readHandle = await fs.open(
    join(__dirname, "../resources", "text-small.txt"),
    "r"
  );

  const writeStream = writeHandle.createWriteStream({ emitClose: true });
  const readStream = readHandle.createReadStream();

  writeStream.on("drain", () => {
    console.log("drain event fired!!!");
  });

  // the finish event is emitted after stream.end() method has been called, and all the data has been flushed to the underlying system.
  writeStream.on("finish", () => {
    console.log("finish event fired!!!");
  });

  // close event is emitted when the stream or its underlying resources (like file descriptor) has been closed
  // The event indicates that no more events will be emitted, and no further computation will occur.
  // always the last event to be fired => the last callback to be executed
  writeStream.on("close", () => {
    console.log("close event fired!!!");
  });

  // the error event is emitted if an error occured while writing or piping data.
  // the stream is closed when the error event is emitted, unless autoDestroy was set to false
  // A Writable stream will always emit the 'close' event if it is created with the emitClose option.
  writeStream.on("error", (error) => {
    console.error("from error event handler: ", error);
    console.log("error event fired!!!");
  });

  return new Promise((resolve, reject) => {
    pipeline(readStream, writeStream, (err) => {
      if (err) reject(err);

      readHandle.close();
      writeHandle.close();
      resolve();
    });
  });
});
