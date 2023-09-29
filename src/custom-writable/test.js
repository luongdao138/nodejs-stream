const path = require("node:path");
const FileWriteStream = require("./customWritable");

const MIN = 0;
const MAX = 1e6;

function writeToFile(from, stream) {
  console.log("write from: ", from);
  for (let i = from; i < MAX; i++) {
    const buff = Buffer.from(` ${i} `);

    if (i === MAX - 1) {
      stream.end(buff);
      return i;
    }

    if (!stream.write(buff)) return i;
  }
}

const testWritable = async () => {
  console.time("writeMany");

  const stream = new FileWriteStream({
    filePath: path.resolve(__dirname, "../resources/custom", "text-small.txt"),
  });

  console.log(stream.writableHighWaterMark);

  let current = MIN;
  current = writeToFile(MIN, stream);

  stream.on("drain", () => {
    current = writeToFile(current + 1, stream);
  });

  stream.on("finish", () => {
    console.timeEnd("writeMany");
  });

  stream.on("error", (error) => {
    console.error("error when write, ", error);
  });
};

module.exports = testWritable;
