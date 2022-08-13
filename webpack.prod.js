const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index-page/index.html',
      inject: 'body',
      minify: true,
      filename: 'index.html',
    }),
  ],
  performance: {
    hints: 'warning',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
});
