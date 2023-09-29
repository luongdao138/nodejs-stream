const fs = require("node:fs");
const path = require("node:path");
const { Writable } = require("node:stream");

class FileWriteStream extends Writable {
  constructor({ highWaterMark, filePath }) {
    super({ highWaterMark });

    this.filePath = filePath;
    this.fd = null;
    this.chunks = [];
    this.chunkSize = 0;
    this.totalWrites = 0;
  }

  emptyChunk() {
    this.chunks = [];
    this.chunkSize = 0;
  }

  appendChunk(chunk) {
    this.chunks.push(chunk);
    this.chunkSize += chunk.length;
  }

  get isWaterMarkSafe() {
    return this.chunkSize <= this.writableHighWaterMark;
  }

  get isChunkEmpty() {
    return !this.chunkSize;
  }

  writeToFile(callback, { increaseTotalWrites = true } = {}) {
    if (this.isChunkEmpty) return callback();

    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) return callback(err);

      if (increaseTotalWrites) {
        ++this.totalWrites;
      }

      this.emptyChunk();
      callback();
    });
  }

  // this will run after the constructor, it will put off calling all other methods until callback is invoked
  // pass the error to the callback, node will handle the rest, pass nothing if everything is ok
  _construct(callback) {
    fs.open(this.filePath, "w", (err, fd) => {
      if (err) return callback(err);

      this.fd = fd;
      callback();
    });
  }

  // this will be called when stream.write is called
  _write(chunk, encoding, callback) {
    // do our write operation...
    this.appendChunk(chunk);

    if (this.isWaterMarkSafe) return callback();

    // each time we call callback in this function
    // drain event will be emitted
    this.writeToFile(callback);
  }

  // only called when we call end method
  _final(callback) {
    this.writeToFile(callback, { increaseTotalWrites: false });
  }

  // run after _final
  _destroy(err, callback) {
    console.log(`Number of writes: ${this.totalWrites}`);

    if (this.fd) {
      fs.close(this.fd, (_err) => {
        return callback(err || _err);
      });
    } else {
      callback(err);
    }
  }
}

const stream = new FileWriteStream({
  highWaterMark: 1800,
  filePath: path.resolve(__dirname, "../resources/custom", "text-small.txt"),
});

stream.on("drain", () => {
  console.log("drain event fired!");
});

stream.write(Buffer.from("This is a string.\n"));
stream.write(Buffer.from("This is another string.\n"));

stream.end(Buffer.from("This is last write."));

stream.on("finish", () => {
  console.log("Stream was finished");
});

module.exports = FileWriteStream;
