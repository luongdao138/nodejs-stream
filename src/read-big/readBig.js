const fs = require("node:fs/promises");
const { join } = require("node:path");

(async () => {
  const fileHandleRead = await fs.open(join(__dirname, "src.txt"), "r");
  const fileHandleWrite = await fs.open(join(__dirname, "dest.txt"), "w");
  const readStream = fileHandleRead.createReadStream({
    highWaterMark: 64 * 1024,
    autoClose: true,
    emitClose: true,
  });
  const writeStream = fileHandleWrite.createWriteStream();

  // readable stream can have three different states
  // when stream is first created, it will be in paused state => not actually reading the data

  readStream.on("data", (chunk) => {
    console.log(chunk.length);

    const numbers = chunk
      .toString("utf-8")
      .split("  ")
      .filter((n) => n.trim());

    console.log(numbers);

    if (!writeStream.write(chunk)) {
      readStream.pause();
    }
  });

  readStream.on("end", () => {
    console.log("End reading data");
    fileHandleWrite.close();
  });

  writeStream.on("drain", () => {
    readStream.resume();
  });

  writeStream.on("close", () => {
    console.log("fileHandleWrite is closed");
  });

  readStream.on("close", () => {
    console.log("fileHandleRead is closed");
  });
})().catch(console.error);
