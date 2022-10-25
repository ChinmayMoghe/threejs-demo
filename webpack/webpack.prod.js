const webpackMerge = require("webpack-merge");
const webpackCommon = require("./webpack.common");

module.exports = webpackMerge.merge(webpackCommon, {
  mode: "production",
  output: {
    clean: true,
  },
});
