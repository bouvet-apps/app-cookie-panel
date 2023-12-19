const merge = require("webpack-merge");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const common = require("./webpack.common.config");

module.exports = merge(common, {
  mode: "production",
  optimization: {
    minimizer: [
      "...",
      new UglifyJsPlugin(),
      new CssMinimizerPlugin()
    ]
  }
});
