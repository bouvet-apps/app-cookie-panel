const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const resourceFolder = "../../build/resources/main/assets/";

const fs = require("fs");

let appName = "defaultAppName";
const lines = fs.readFileSync("../../gradle.properties", "utf-8").split("\n");
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.startsWith("appName")) {
    appName = line.substring(line.indexOf("=") + 1).trim();
    break;
  }
}

module.exports = {
  entry: {
    main: "./scripts/main.es6"
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new StylelintPlugin({
      context: "./styles/"
    })
  ],
  module: {
    rules: [
      {
        test: /\.es6?$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          }, {
            loader: "css-loader"
          }, {
            loader: "postcss-loader"
          }, {
            loader: "resolve-url-loader"
          }, {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              implementation: require("sass")
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", "json", "scss", "sass"]
  },
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, resourceFolder),
    chunkFilename: "js/[name].chunk.js",
    publicPath: `/_/asset/${appName}:[hash]/`
  }
};
