const fs = require("node:fs/promises");
const { join } = require("node:path");

// this code use 100% cpu (1 core), 0.3% memory
// (async () => {
//   console.time("writeMany");
//   const fileHandle = await fs.open("test.txt", "w");

//   const stream = fileHandle.createWriteStream();

//   for (let i = 0; i < 1e6; i++) {
//     stream.write(Buffer.from(` ${i} `, "utf-8"));
//     // await fileHandle.write(` ${i} `);
//   }

//   console.timeEnd("writeMany");
// })();

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

(async () => {
  console.time("writeMany");
  const fileHandle = await fs.open(
    join(__dirname, "../resources", "text-small.txt"),
    "w"
  );

  const stream = fileHandle.createWriteStream();
  console.log(stream.writableHighWaterMark);

  let current = MIN;
  let totalDrainCount = 0;
  current = writeToFile(MIN, stream);

  stream.on("drain", () => {
    totalDrainCount++;
    current = writeToFile(current + 1, stream);
  });

  stream.on("finish", () => {
    console.log(`Total drain count: ${totalDrainCount}`);
    console.timeEnd("writeMany");
  });

  stream.on("error", (error) => {
    console.error("error when write, ", error);
    fileHandle.close();
  });
})();
