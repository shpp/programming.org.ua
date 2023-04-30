const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fetch = require('node-fetch');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const nearestDate = fetch('https://back.scs.p2p.programming.org.ua/ptp/nearest-start-date')
  .then((res) => res.json())
  .then((response) => response.data.nearestStartDate);

const getShppAge = (date, lang, pattern) => {
  const inRange = (x, from, to) => x >= from && x <= to;
  const tokens = {
    years1: { ru: 'лет', uk: 'років', en: 'years' },
    years2: { ru: 'год', uk: 'рік', en: 'year' },
    years3: { ru: 'года', uk: 'роки', en: 'years' },
  };

  const [day, month, year] = date.split('-');
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
};

const localesConfig = {
  uk: {
    lang: 'uk',
    filenamePrefix: 'ua/',
    locale: 'uk_UA',
    langPrefix: '',
  },
  ru: {
    lang: 'ru',
    filenamePrefix: 'ru/',
    locale: 'ru_RU',
    langPrefix: '/ru',
  },
  en: {
    lang: 'en',
    filenamePrefix: 'en/',
    locale: 'en_GB',
    langPrefix: '/en',
  },
  defaultLanguage: {
    lang: 'uk',
    filenamePrefix: '',
    locale: 'uk_UA',
    langPrefix: '',
  },
};

const BASE_URL = 'https://programming.org.ua';

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
        uk: fetch(`https://data.kowo.space/data/programming.org.ua/translations/ua.json`).then((response) => response.json()),
        ru: fetch(`https://data.kowo.space/data/programming.org.ua/translations/ru.json`).then((response) => response.json()),
        en: fetch(`https://data.kowo.space/data/programming.org.ua/translations/en.json`).then((response) => response.json()),
        get defaultLanguage() {
          return this.uk;
        },
      }).map(async ([language, translation]) => ({
        ...localesConfig[language],
        translations: await translation,
        startDate: await nearestDate,
      }))
    ).then((languages) =>
      languages.reduce((htmlWebpackPlugins, { filenamePrefix, translations, startDate, locale, langPrefix, lang }) => {
        const shppAge = getShppAge('01-05-2015', lang, translations.home.intro.item3);
        const alternativeLocales = ['en', 'ru', 'uk'].filter((l) => l !== lang).map((l) => localesConfig[l]);

        const getCommonContent = (relativePagePath) => ({
          lang,
          translations,
          locale,
          langPrefix,
          canonicalUrl: `${BASE_URL}${filenamePrefix}${relativePagePath}`,
          alternativeLocales: alternativeLocales.map(({ langPrefix, lang }) => ({
            lang,
            url: `${BASE_URL}${langPrefix}${relativePagePath}`,
          })),
          currentYear: new Date().getFullYear(),
        });

        return [
          ...htmlWebpackPlugins,
          new HtmlWebpackPlugin({
            template: 'src/pages/index-page/index.hbs',
            chunks: ['common', 'index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}index.html`,
            content: {
              ...getCommonContent('/'),
              startDate,
              shppAge,
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/feedbacks-page/index.hbs',
            chunks: ['common', 'feedback-all/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}feedback-all/index.html`,
            content: {
              ...getCommonContent('/feedback-all/'),
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/about-us-page/index.hbs',
            chunks: ['common', 'about/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}about/index.html`,
            content: {
              ...getCommonContent('/about/'),
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/adults-courses-page/index.hbs',
            chunks: ['common', 'courses/adults/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}courses/adults/index.html`,
            content: {
              ...getCommonContent('/courses/adults/'),
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/contacts-page/index.hbs',
            chunks: ['common', 'contacts/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}contacts/index.html`,
            content: {
              ...getCommonContent('/contacts/'),
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/courses-page/index.hbs',
            chunks: ['common', 'courses/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}courses/index.html`,
            content: {
              ...getCommonContent('/courses/'),
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/feedback-form-page/index.hbs',
            chunks: ['common', 'feedback-form/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}feedback-form/index.html`,
            content: {
              ...getCommonContent('/feedback-form/'),
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/sign-up-index-page/index.hbs',
            chunks: ['common', 'anketa/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}anketa/index.html`,
            content: {
              ...getCommonContent('/anketa/'),
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/sign-up-teens-page/index.hbs',
            chunks: ['common', 'anketa/teens/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}anketa/teens/index.html`,
            content: {
              ...getCommonContent('/anketa/teens/'),
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/sign-up-adults-page/index.hbs',
            chunks: ['common', 'anketa/adults/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}anketa/adults/index.html`,
            content: {
              ...getCommonContent('/anketa/adults/'),
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/sign-up-success-page/index.hbs',
            chunks: ['common', 'anketa/last/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}anketa/last/index.html`,
            content: {
              ...getCommonContent('/anketa/last/'),
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/sign-up-confirmation-page/index.hbs',
            chunks: ['common', 'email-confirmed/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}email-confirmed/index.html`,
            content: {
              ...getCommonContent('/email-confirmed/'),
            },
          }),
          new HtmlWebpackPlugin({
            template: 'src/pages/support-us-page/index.hbs',
            chunks: ['common', 'supportus/index'],
            inject: 'body',
            minify: mode === 'production',
            filename: `${filenamePrefix}supportus/index.html`,
            content: {
              ...getCommonContent('/supportus/'),
              shppCreation: getShppAge('01-08-2012', lang, translations.before_shpp_creation),
              kowoCreation: getShppAge('01-06-2014', lang, translations.before_kowo_creation),
              p2pCreation: getShppAge('01-01-2017', lang, translations.before_p2p_creation),
            },
          }),
        ];
      }, [])
    )),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '' }, //to the dist root directory
      ],
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
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
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
