const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fetch = require('node-fetch');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const nearestDate = fetch('https://back.scs.p2p.programming.org.ua/ptp/nearest-start-date')
  .then((res) => res.json())
  .then((response) => response.data.nearestStartDate);
const languages = {
  ua: 'Ukrainian',
  ru: 'russian',
  en: 'English',
  defaultLanguage: 'Default',
};

module.exports = async (_, { mode = 'development' }) => ({
  entry: {
    common: './src/common.js',
    index: './src/pages/index-page/index.js',
    'feedback-all/index': './src/pages/feedbacks-page/index.js',
    'about/index': './src/pages/about-us-page/index.js',
    'courses/adults/index': './src/pages/adults-courses-page/index.js',
    'contacts/index': './src/pages/contacts-page/index.js',
    'courses/index': './src/pages/courses-page/index.js',
    'feedback-form/index': './src/pages/feedback-form-page/index.js',
    'anketa/index': './src/pages/sign-up-index-page/index.js',
    'anketa/teens': './src/pages/sign-up-teens-page/index.js',
    'anketa/adults': './src/pages/sign-up-adults-page/index.js',
    'anketa/last': './src/pages/sign-up-success-page/index.js',
    'email-confirmed/index': './src/pages/sign-up-confirmation-page/index.js',
    'supportus/index': './src/pages/support-us-page/index.js',
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
      Object.entries({
        [languages.ua]: fetch(`https://data.kowo.space/data/programming.org.ua/translations/ua.json`).then((response) => response.json()),
        [languages.ru]: fetch(`https://data.kowo.space/data/programming.org.ua/translations/ru.json`).then((response) => response.json()),
        [languages.en]: fetch(`https://data.kowo.space/data/programming.org.ua/translations/en.json`).then((response) => response.json()),
        get [languages.defaultLanguage]() {
          return this[languages.ua];
        },
      }).map(async ([language, translation]) => ({
        lang: {
          [languages.ua]: 'ua',
          [languages.ru]: 'ru',
          [languages.en]: 'en',
          [languages.defaultLanguage]: 'ua',
        }[language],
        translations: await translation,
        startDate: await nearestDate,
        filenamePrefix: {
          [languages.ua]: 'ua/',
          [languages.ru]: 'ru/',
          [languages.en]: 'en/',
          [languages.defaultLanguage]: '',
        }[language],
        locale: {
          [languages.en]: 'en_GB',
          [languages.ua]: 'uk_UA',
          [languages.defaultLanguage]: 'uk_UA',
          [languages.ru]: 'ru_RU',
        }[language],
        langPrefix: {
          [languages.ua]: '',
          [languages.ru]: '/ru',
          [languages.en]: '/en',
          [languages.defaultLanguage]: '',
        }[language],
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
          new HtmlWebpackPlugin({
            template: 'src/pages/about-us-page/index.hbs',
            chunks: ['common', 'about/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}about/index.html`,
            content: {
              lang,
              translations,
              locale,
              langPrefix,
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/adults-courses-page/index.hbs',
            chunks: ['common', 'courses/adults/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}courses/adults/index.html`,
            content: {
              lang,
              translations,
              locale,
              langPrefix,
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/contacts-page/index.hbs',
            chunks: ['common', 'contacts/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}contacts/index.html`,
            content: {
              lang,
              translations,
              locale,
              langPrefix,
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/courses-page/index.hbs',
            chunks: ['common', 'courses/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}courses/index.html`,
            content: {
              lang,
              translations,
              locale,
              langPrefix,
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/feedback-form-page/index.hbs',
            chunks: ['common', 'feedback-form/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}feedback-form/index.html`,
            content: {
              lang,
              translations,
              locale,
              langPrefix,
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/sign-up-index-page/index.hbs',
            chunks: ['common', 'anketa/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}anketa/index.html`,
            content: {
              lang,
              translations,
              locale,
              langPrefix,
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/sign-up-teens-page/index.hbs',
            chunks: ['common', 'anketa/teens/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}anketa/teens/index.html`,
            content: {
              lang,
              translations,
              locale,
              langPrefix,
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/sign-up-adults-page/index.hbs',
            chunks: ['common', 'anketa/adults/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}anketa/adults/index.html`,
            content: {
              lang,
              translations,
              locale,
              langPrefix,
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/sign-up-success-page/index.hbs',
            chunks: ['common', 'anketa/last/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}anketa/last/index.html`,
            content: {
              lang,
              translations,
              locale,
              langPrefix,
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/sign-up-confirmation-page/index.hbs',
            chunks: ['common', 'email-confirmed/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}email-confirmed/index.html`,
            content: {
              lang,
              translations,
              locale,
              langPrefix,
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/support-us-page/index.hbs',
            chunks: ['common', 'supportus/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}supportus/index.html`,
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
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
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
