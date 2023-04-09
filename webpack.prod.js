const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fetch = require('node-fetch');

module.exports = async () =>
  merge(common, {
    mode: 'production',
    plugins: [
      ...(await Promise.all(
        ['ua', 'en', 'ru'].map(async (lang) => ({
          lang,
          translations: await fetch(`https://data.kowo.space/data/programming.org.ua/translations/${lang}.json`).then((res) => res.json()),
        }))
      )
        .then((languages) => [...languages, { lang: null, translations: languages.find(({ lang }) => lang === 'ua').translations }])
        .then((languages) =>
          languages
            .map(({ lang, translations }) => ({ filenamePrefix: `${lang ? `${lang}/` : ''}`, translations }))
            .reduce(
              (htmlWebpackPlugins, { filenamePrefix, translations }) => [
                ...htmlWebpackPlugins,
                new HtmlWebpackPlugin({
                  template: 'src/pages/index-page/index.hbs',
                  chunks: ['common', 'index'],
                  inject: 'body',
                  minify: true,
                  filename: `${filenamePrefix}index.html`,
                  translations,
                }),
                new HtmlWebpackPlugin({
                  template: 'src/pages/feedbacks-page/index.hbs',
                  chunks: ['common', 'feedback-all/index'],
                  inject: 'body',
                  minify: true,
                  filename: `${filenamePrefix}feedback-all/index.html`,
                  translations,
                }),
              ],
              []
            )
        )),
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
