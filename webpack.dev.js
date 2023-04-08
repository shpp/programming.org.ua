const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fetch = require('node-fetch');

module.exports = async () => merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/pages/index-page/index.hbs',
      chunks: ['common', 'index'],
      inject: 'body',
      minify: false,
      filename: 'index.html',
      translations: await fetch('https://data.kowo.space/data/programming.org.ua/translations/ua.json').then(res => res.json())
    }),
    new HtmlWebpackPlugin({
      template: 'src/pages/index-page/index.hbs',
      chunks: ['common', 'index'],
      inject: 'body',
      minify: false,
      filename: 'en/index.html',
      translations: await fetch('https://data.kowo.space/data/programming.org.ua/translations/en.json').then(res => res.json())
    }),
    new HtmlWebpackPlugin({
      template: 'src/pages/index-page/index.hbs',
      chunks: ['common', 'index'],
      inject: 'body',
      minify: false,
      filename: 'ua/index.html',
      translations: await fetch('https://data.kowo.space/data/programming.org.ua/translations/ua.json').then(res => res.json())
    }),
    new HtmlWebpackPlugin({
      template: 'src/pages/index-page/index.hbs',
      chunks: ['common', 'index'],
      inject: 'body',
      minify: false,
      filename: 'ru/index.html',
      translations: await fetch('https://data.kowo.space/data/programming.org.ua/translations/ru.json').then(res => res.json())
    }),
    new HtmlWebpackPlugin({
      template: 'src/pages/feedbacks-page/index.hbs',
      chunks: ['common', 'feedback-all/index'],
      inject: 'body',
      minify: false,
      filename: 'feedback-all/index.html',
    }),
  ],
  performance: {
    hints: false,
  },
});
