const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fetch = require('node-fetch');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const SitemapPlugin = require('sitemap-webpack-plugin').default;

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
    filenamePrefix: 'uk/',
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

const partnersConfig = [
  {
    link: 'https://www.techsoup.org/',
    imgSrc: '/img/partners/techsoup.png',
    title: 'Techsoup Ukraine',
  },
  {
    link: 'https://slack.com/',
    imgSrc: '/img/partners/slack.png',
    title: 'Slack',
  },
  {
    link: 'https://notion.so/',
    imgSrc: '/img/partners/notion.jpg',
    title: 'Notion',
  },
  {
    link: 'https://onix-systems.com/',
    imgSrc: '/img/partners/onix.png',
    title: 'Onix Systems',
  },
  {
    link: 'https://bandapixels.com',
    imgSrc: '/img/partners/bandapixels.svg',
    title: 'Bandapixels',
  },
  {
    link: 'http://www.roboclub.if.ua/',
    imgSrc: '/img/partners/roboclub.png',
    title: 'RoboClub',
  },
  {
    link: 'https://probono.org.ua/',
    imgSrc: '/img/partners/pbc.png',
    title: 'Pro Bono Club',
  },
  {
    link: 'https://codeclub.com.ua/',
    imgSrc: '/img/partners/codeclub.png',
    title: 'CodeClub',
  },
  {
    link: 'https://italent.org.ua/',
    imgSrc: '/img/partners/italent.png',
    title: 'iTalent',
  },
  {
    link: 'https://www.jetbrains.com/',
    imgSrc: '/img/partners/jet.png',
    title: 'Jet Brains',
  },
  {
    link: 'https://www.grammarly.com/',
    imgSrc: '/img/partners/grammarly.png',
    title: 'Grammarly',
  },
  {
    link: 'https://canva.com/',
    imgSrc: '/img/partners/canva.png',
    title: 'Canva',
  },
  {
    link: 'https://cyberpolice.gov.ua/',
    imgSrc: '/img/partners/cyberpolice.jpg',
    title: 'Департамент кіберполіції національної поліції України',
  },
  {
    link: 'https://200x300.com/',
    imgSrc: '/img/partners/200x300.png',
    title: '200x300 Studio',
  },
  {
    link: 'https://www.wowza.com/',
    imgSrc: '/img/partners/wowza.png',
    title: 'Wowza Streaming Engine',
  },
];

const teamMembersConfig = [
  {
    name: { en: 'Vlad', uk: 'Влад', ru: 'Влад' },
    surname: { en: 'Doncov', uk: 'Донцов', ru: 'Донцов' },
    image: 'vdoncov',
    occupation: 'Frontend developer / mentor (React)',
    roles: ['adults-mentor'],
  },
  {
    name: { en: 'Artem', uk: 'Артем', ru: 'Артём' },
    surname: { en: 'Dobrovolskyi', uk: 'Добровольський', ru: 'Добровольский' },
    image: 'adobrovolskyi',
    occupation: 'Fullstack developer / mentor',
    roles: ['adults-mentor'],
  },
  {
    name: { en: 'Artem', uk: 'Артем', ru: 'Артём' },
    surname: { en: 'Korniets', uk: 'Корнієць', ru: 'Корниец' },
    image: 'akorniets',
    occupation: 'Student, mentor Zero',
    roles: ['adults-mentor'],
    visible: false,
  },
  {
    name: { en: 'Ivan', uk: 'Іван', ru: 'Иван' },
    surname: { en: 'Sahnovskyi', uk: 'Сахновський', ru: 'Сахновский' },
    image: 'isahnovskyi',
    occupation: 'Mentor Frontend',
    roles: ['adults-mentor'],
  },
  {
    name: { en: 'Roman', uk: 'Роман', ru: 'Роман' },
    surname: { en: 'Shmelev', uk: 'Шмельов', ru: 'Шмелёв' },
    image: 'rshmelev',
    occupation: 'Streaming engineer, mentor CS, backend, coordinator',
    roles: ['adults-mentor', 'team', 'teens-mentor'],
  },
  {
    name: { en: 'Kate', uk: 'Катерина', ru: 'Катя' },
    surname: { en: 'Boyko', uk: 'Бойко', ru: 'Бойко' },
    image: 'kboyko',
    occupation: 'Frontend developer / mentor, coordinator',
    roles: ['adults-mentor', 'team', 'teens-mentor'],
  },
  {
    name: { en: 'Anastasiia', uk: 'Анастасія', ru: 'Анастасия' },
    surname: { en: 'Pereverzieva', uk: 'Перевєрзєва', ru: 'Переверзева' },
    image: 'apereverzeva',
    occupation: 'Frontend developer / mentor',
    roles: ['adults-mentor'],
  },
  {
    name: { en: 'Yuriy', uk: 'Юрій', ru: 'Юрий' },
    surname: { en: 'Degtyar', uk: 'Дегтяр', ru: 'Дегтярь' },
    image: 'ydegtyar',
    occupation: 'Fullstack developer / mentor',
    roles: ['adults-mentor'],
  },
  {
    name: { en: 'Konstantin', uk: 'Костянтин', ru: 'Константин' },
    surname: { en: 'Petrenko', uk: 'Петренко', ru: 'Петренко' },
    image: 'kpetrenko',
    occupation: 'Android developer / mentor',
    roles: ['adults-mentor'],
  },
  {
    name: { en: 'Volodymyr', uk: 'Володимир', ru: 'Владимир' },
    surname: { en: 'Nechai', uk: 'Нечай', ru: 'Нечай' },
    image: 'vnechai',
    occupation: 'Magento developer / mentor',
    roles: ['adults-mentor'],
  },
  {
    name: { en: 'Antriy', uk: 'Андрій', ru: 'Андрей' },
    surname: { en: 'Chudinovskyh', uk: 'Чудіновських', ru: 'Чудиновских' },
    image: 'achudinovskyh',
    occupation: 'Backend developer / mentor',
    roles: ['adults-mentor'],
  },
  {
    name: { en: 'Konstantin', uk: 'Костянтин', ru: 'Константин' },
    surname: { en: 'Yakimenko', uk: 'Якименко', ru: 'Якименко' },
    image: 'kyakimenko',
    occupation: 'Backend developer / mentor',
    roles: ['adults-mentor', 'team'],
  },
  {
    name: { en: 'Constantine', uk: 'Костя', ru: 'Костя' },
    surname: { en: 'Gorbach', uk: 'Горбач', ru: 'Горбач' },
    image: 'kgorbach',
    occupation: 'Android developer / mentor',
    roles: ['team', 'adults-mentor'],
  },
  {
    name: { en: 'Maryna', uk: 'Марина', ru: 'Марина' },
    surname: { en: 'Sokol', uk: 'Сокол', ru: 'Сокол' },
    image: 'msokol',
    occupation: 'Mentor Frontend (Vue.js)',
    roles: ['adults-mentor'],
  },
].filter((m) => m.visible !== false);

const mediaMentionsConfig = [
  {
    imgSrc: '/img/media/suspilne.svg',
    alt: 'Суспільне Кропивницький',
    date: '01.06.2023',
    link: 'https://www.youtube.com/watch?v=DWq-b9VbBf8',
    title: {
      ru: 'Борьба в тылу | В Кропивницком действует бесплатная школа программирования для взрослых и подростков (язык: украинский)',
      uk: 'Боротьба в тилу | В Кропивницькому діє безкоштовна школа програмування для дорослих і підлітків',
      en: 'Fighting in the rear | There is a free programming school for adults and teenagers in Kropyvnytskyi (language: ukrainian)',
    },
  },
  {
    imgSrc: '/img/media/gre4ka.png',
    alt: 'Гречка',
    date: '18.06.2020',
    link: 'https://gre4ka.info/statti/59680-yak-u-kropyvnytskomu-aitishnyky-podaruvaly-mistu-bezkoshtovnu-shkolu-prohramuvannia-i-kreatyvnyi-prostir',
    title: {
      ru: 'Как в Кропивницком айтишники подарили городу бесплатную школу программирования и креативное пространство (язык: украинский)',
      uk: 'Як у Кропивницькому айтішники подарували місту безкоштовну школу програмування і креативний простір',
      en: 'How programmers gave the Kropyvnytskyi a free programming school and a creative space (language: ukrainian)',
    },
  },
  {
    imgSrc: '/img/media/dou.svg',
    alt: 'DOU',
    date: '20.12.2019',
    link: 'https://dou.ua/lenta/interviews/kropyvnytskyi-it-school/',
    title: {
      ru: 'IT-волонтеры: как в Кропивницком основали бесплатную школу программирования и социальное креативное пространство (язык: украинский)',
      uk: 'IT-волонтери: як у Кропивницькому заснували безкоштовну школу програмування та соціальний креативний простір',
      en: 'IT volunteers: how they founded a free programming school and social creative space in Kropyvnytskyi (language: ukrainian)',
    },
  },
  {
    imgSrc: '/img/media/dozor.jpg',
    alt: 'Медіапортал DOZOR',
    date: '09.11.2018',
    link: 'https://dozor.kr.ua/post/hochesh-buti-programistom-bud-nim-nekirovogradska-filosofiya-kirovogradskoi-shkoli--8160.html',
    title: {
      ru: 'Хочешь быть программистом? Будь им!\nНекировоградская философия кировоградской школы (язык: украинский)',
      uk: 'Хочеш бути програмістом? Будь ним!\nНекіровоградська філософія кіровоградської школи',
      en: 'Do you want to be a programmer? Be him!\nNon-Kirovohrad philosophy of the Kirovohrad school (language: ukrainian)',
    },
  },
  {
    imgSrc: '/img/media/pravda-kr.jpg',
    alt: 'Кіровоградська Правда',
    date: '07.03.2018',
    link: 'https://pravda-kr.com.ua/sotsium/11662-u-kirovogradi-die-shkola-de-bezplatno-vchat-programuvannyu-i-dayut-shans-na-nove-zhittya.html',
    title: {
      ru: 'В Кировограде действует школа, где бесплатно учат программированию и дают шанс на новую жизнь (язык: украинский)',
      uk: 'У Кіровограді діє школа, де безплатно вчать програмуванню і дають шанс на нове життя',
      en: 'There is a school in Kirovohrad that teaches programming for free and gives a chance for a new life (language: ukrainian)',
    },
  },
  {
    imgSrc: '/img/media/novagazeta.jpg',
    alt: 'Нова газета',
    date: '08.10.2015',
    link: 'https://novagazeta.kr.ua/index.php/podii/socium/851-shkola-prohramuvannia-ta-altruizmu',
    title: {
      ru: 'Школа программирования и альтруизма (язык: украинский)',
      uk: 'Школа програмування та альтруїзму',
      en: 'School of programming and altruism (language: ukrainian)',
    },
  },
];
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
    'anketa/teens/index': './src/pages/sign-up-teens-page/index.js',
    'anketa/adults/index': './src/pages/sign-up-adults-page/index.js',
    'anketa/last/index': './src/pages/sign-up-success-page/index.js',
    'email-confirmed/index': './src/pages/sign-up-confirmation-page/index.js',
    'supportus/index': './src/pages/support-us-page/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new SitemapPlugin({
      base: BASE_URL,
      paths: [
        ...[
          'about',
          'contacts',
          'feedback-all',
          '',
          'supportus',
          'courses/adults',
          'courses',
          'feedback-form',
          'anketa',
        ].map((pageName) => ({
          path: `/${pageName}`,
          lastmod: new Date().toISOString(),
          priority: 1,
          changefreq: 'weekly',
          links: ['ru', 'uk', 'en'].map((lang) => ({
            hreflang: lang,
            url: `/${lang}/${pageName}`,
          })),
        })),
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css',
    }),
    ...(await Promise.all(
      Object.entries({
        uk: fetch(`https://data.kowo.space/data/programming.org.ua/translations/ua.json`).then(
          (response) => response.json()
        ),
        ru: fetch(`https://data.kowo.space/data/programming.org.ua/translations/ru.json`).then(
          (response) => response.json()
        ),
        en: fetch(`https://data.kowo.space/data/programming.org.ua/translations/en.json`).then(
          (response) => response.json()
        ),
        get defaultLanguage() {
          return this.uk;
        },
      }).map(async ([language, translation]) => ({
        ...localesConfig[language],
        translations: await translation,
        startDate: await nearestDate,
      }))
    ).then((languages) =>
      languages.reduce(
        (
          htmlWebpackPlugins,
          { filenamePrefix, translations, startDate, locale, langPrefix, lang }
        ) => {
          const alternativeLocales = ['en', 'ru', 'uk']
            .filter((l) => l !== lang)
            .map((l) => localesConfig[l]);

          const getCommonContent = (relativePagePath) => ({
            lang,
            translations,
            locale,
            langPrefix,
            relativePagePath,
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
                shppAge: getShppAge('01-05-2015', lang, translations.home.intro.item3),
                partners: partnersConfig,
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
                partners: partnersConfig,
                team: teamMembersConfig,
                media: mediaMentionsConfig,
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
                freeEducation: getShppAge(
                  '01-05-2015',
                  lang,
                  translations.support.achievements.items[0]
                ),
              },
            }),
          ];
        },
        []
      )
    )),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '' }, // to the dist root directory
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
        options: {
          helperDirs: [path.resolve(__dirname, 'utils/handlebars-helpers')],
        },
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
          filename: (pathData) => `img/${pathData.filename.replace('assets/images/', '')}`,
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
