const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fetch = require('node-fetch');

const nearestDate = fetch('https://back.scs.p2p.programming.org.ua/ptp/nearest-start-date')
  .then((res) => res.json())
  .then((response) => response.data.nearestStartDate);

module.exports = async () =>
  merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      static: './dist',
      hot: false,
    },
    plugins: [
      ...(await Promise.all(
        ['ua', 'en', 'ru'].map(async (lang) => ({
          lang,
          translations: await fetch(`https://data.kowo.space/data/programming.org.ua/translations/${lang}.json`).then((res) => res.json()),
          startDate: await nearestDate,
        }))
      ).then((languages) =>
        languages
          .map(({ lang, translations, startDate }) => ({
            filenamePrefix: `${lang !== 'ua' ? `${lang}/` : ''}`,
            translations,
            startDate,
            locale: { en: 'en_GB', ua: 'uk_UA', ru: 'ru_RU' }[translations.key] || 'en_GB',
          }))
          .reduce(
            (htmlWebpackPlugins, { filenamePrefix, translations, startDate, locale }) => [
              ...htmlWebpackPlugins,
              new HtmlWebpackPlugin({
                template: 'src/pages/index-page/index.hbs',
                chunks: ['common', 'index'],
                inject: 'body',
                minify: false,
                filename: `${filenamePrefix}index.html`,
                translations,
                startDate,
                locale,
              }),
              new HtmlWebpackPlugin({
                template: 'src/pages/feedbacks-page/index.hbs',
                chunks: ['common', 'feedback-all/index'],
                inject: 'body',
                minify: false,
                filename: `${filenamePrefix}feedback-all/index.html`,
                translations,
                locale,
              }),
            ],
            []
          )
      )),
    ],
    performance: {
      hints: false,
    },
  });
