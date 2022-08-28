const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
      chunks : ['index'],
      inject: 'body',
      minify: false,
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      template: 'src/feedbacks-page/index.html',
      chunks : ['feedback-all/index'],
      inject: 'body',
      minify: false,
      filename: 'feedback-all/index.html',
    }),
    new BundleAnalyzerPlugin(),
  ],
  performance: {
    hints: false,
  },
});
