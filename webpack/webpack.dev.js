const webpackMerge = require("webpack-merge");
const webpackCommon = require("./webpack.common");
const portfinder = require("portfinder-sync");

module.exports = webpackMerge.merge(webpackCommon, {
  stats: "errors-warnings",
  mode: "development",
  devServer: {
    open: true,
    historyApiFallback: true,
    host: "127.0.0.1",
    port: portfinder.getPort(9000),
    hot: false,
  },
});
