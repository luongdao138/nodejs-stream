const fs = require("node:fs/promises");
const { join } = require("node:path");
const metricExecution = require("../../utils/time-execution");
const { pipeline } = require("stream");

// small: ~= 8MB
// medium: ~= 89MB
// big:~= 1GB

const srcFileName = "text-small.txt";
const destFileName = "text-copy.txt";

// small: 22ms - 38MB
// medium: 100ms - 116MB
// big: 1.175s - 1GB
// metricExecution(async () => {
//   const readHandle = await fs.open(
//     join(__dirname, "../resources", srcFileName),
//     "r"
//   );
//   const writeHandle = await fs.open(join(__dirname, destFileName), "w");

//   const data = await readHandle.readFile();
//   await writeHandle.write(data);
// });

// small: 30ms - 36MB
// medium: 320ms - 40MB
// big: 2.5s - 42MB
// metricExecution(async () => {
//   const readHandle = await fs.open(
//     join(__dirname, "../resources", srcFileName),
//     "r"
//   );
//   const writeHandle = await fs.open(join(__dirname, destFileName), "w");

//   let bytesRead = -1;

//   while (bytesRead !== 0) {
//     const readResult = await readHandle.read();
//     bytesRead = readResult.bytesRead;

//     if (bytesRead !== 16384) {
//       const indexOfNotFilled = readResult.buffer.indexOf(0);
//       const newBuffer = Buffer.alloc(indexOfNotFilled);

//       readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled);
//       await writeHandle.write(newBuffer);
//     } else {
//       await writeHandle.write(readResult.buffer);
//     }
//   }
// });

// small: 20ms - 37MB
// medium: 180ms - 50MB
// big: 3.8s - 52MB
metricExecution(async () => {
  const readHandle = await fs.open(
    join(__dirname, "../resources", srcFileName),
    "r"
  );
  const writeHandle = await fs.open(join(__dirname, destFileName), "w");

  const readStream = readHandle.createReadStream();
  const writeStream = writeHandle.createWriteStream();

  // s1,s2,s3 must be duplex or transform stream, can not be a read stream or write stream
  // pipeline(readHandle, s1,s2,s3, writeStream)

  // readStream.pipe(writeStream);

  return new Promise((resolve, reject) => {
    pipeline(readStream, writeStream, (err) => {
      if (err) reject(err);

      readHandle.close();
      writeHandle.close();
      resolve();
    });
  });
});

// clean up in stream nodejs: pipeline, or finished function
