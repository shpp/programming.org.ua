const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index-page/index.html',
      inject: 'body',
      minify: false,
      filename: 'index.html',
    }),
  ],
  performance: {
    hints: false,
  },
});
