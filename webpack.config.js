const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fetch = require('node-fetch');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const nearestDate = fetch('https://back.scs.p2p.programming.org.ua/ptp/nearest-start-date')
  .then((res) => res.json())
  .then((response) => response.data.nearestStartDate);

module.exports = async (_, { mode = 'development' }) => ({
  entry: {
    common: './src/common.js',
    index: './src/pages/index-page/index.js',
    'feedback-all/index': './src/pages/feedbacks-page/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css',
    }),
    ...(await Promise.all(
      ['ua', 'en', 'ru'].map(async (lang) => ({
        lang,
        translations: await fetch(`https://data.kowo.space/data/programming.org.ua/translations/${lang}.json`).then((res) => res.json()),
        startDate: await nearestDate,
        filenamePrefix: `${lang === 'ua' ? '' : `${lang}/`}`,
        locale: { en: 'en_GB', ua: 'uk_UA', ru: 'ru_RU' }[lang] || 'en_GB',
        langPrefix: lang === 'ua' ? '' : `/${lang}`,
      }))
    ).then((languages) =>
      languages.reduce(
        (htmlWebpackPlugins, { filenamePrefix, translations, startDate, locale, langPrefix, lang }) => [
          ...htmlWebpackPlugins,
          new HtmlWebpackPlugin({
            template: 'src/pages/index-page/index.hbs',
            chunks: ['common', 'index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}index.html`,
            content: {
              lang,
              translations,
              startDate,
              locale,
              langPrefix,
              shppAge: (() => {
                const creationDate = '01-05-2015';
                const pattern = translations.home.intro.item3;
                const inRange = (x, from, to) => x >= from && x <= to;
                const tokens = {
                  years1: { ru: 'лет', ua: 'років', en: 'years' },
                  years2: { ru: 'год', ua: 'рік', en: 'year' },
                  years3: { ru: 'года', ua: 'роки', en: 'years' },
                };

                const [day, month, year] = creationDate.split('-');
                const schoolFoundationDate = new Date(year, month - 1, day);
                const ageDifMs = Date.now() - schoolFoundationDate;
                const ageDate = new Date(ageDifMs);
                const yearsNum = Math.abs(ageDate.getUTCFullYear() - 1970);

                const yearsStr = inRange(yearsNum, 5, 20)
                  ? tokens.years1[lang]
                  : yearsNum % 10 === 1
                  ? tokens.years2[lang]
                  : inRange(yearsNum % 10, 2, 4)
                  ? tokens.years3[lang]
                  : tokens.years1[lang];

                return (pattern || '').replace('{{yearsNum}}', yearsNum).replace('{{yearsStr}}', yearsStr);
              })(),
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/feedbacks-page/index.hbs',
            chunks: ['common', 'feedback-all/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}feedback-all/index.html`,
            content: {
              lang,
              translations,
              locale,
              langPrefix,
            },
          }),
        ],
        []
      )
    )),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__ : true,
      __VUE_PROD_DEVTOOLS__: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
  ...(mode === 'development' && {
    devtool: 'inline-source-map',
    devServer: {
      static: './dist',
      hot: false,
    },
  }),
  ...(mode === 'production' && {
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  }),
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
    hints: mode === 'production' ? 'warning' : false,
  },
});
