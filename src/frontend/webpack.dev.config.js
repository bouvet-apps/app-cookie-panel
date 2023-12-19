// eslint-disable-next-line import/no-extraneous-dependencies
const merge = require("webpack-merge");
const common = require("./webpack.common.config");

module.exports = merge(common, {
  mode: "development",
  entry: {
    main: "./scripts/main.es6"
  },
  devtool: "inline-source-map"
});
