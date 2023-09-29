const fs = require("node:fs");
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

module.exports = FileWriteStream;

// something your need to keep in mind when implement a custom writable stream
// first your have to extend from Writable class
// implement some important methods: _construct, _write, _final, _destroy
// never throw error in these methods, pass the error object to the callback instead
// never emit events, let nodejs handle it for you
//
