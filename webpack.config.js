const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
  {
    mode: "development",
    devtool: "inline-source-map",
    entry: "./src/index.ts",
    output: {
      path: path.join(__dirname, "dist"),
      sourceMapFilename: "[file].map",
      filename: "index.js",
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    target: "web",
    node: {
      __dirname: false,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        inject: false,
      }),
    ],
  },
];
