const path = require("node:path");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  target: "node",
  entry: {
    main: path.resolve(__dirname, "src/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].bundle.js",
    clean: true,
  },
  resolve: {
    extensions: [".js"],
    alias: { "~": path.resolve(__dirname, "src") },
    // fallback: {
    //   fs: false,
    //   tls: false,
    //   net: false,
    //   path: false,
    //   zlib: false,
    //   http: false,
    //   https: false,
    //   stream: false,
    //   crypto: false,
    // },
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
};
