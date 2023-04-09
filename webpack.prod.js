const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fetch = require('node-fetch');

const nearestDate = fetch('https://back.scs.p2p.programming.org.ua/ptp/nearest-start-date')
  .then((res) => res.json())
  .then((response) => response.data.nearestStartDate);

module.exports = async () =>
  merge(common, {
    mode: 'production',
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
            langPrefix: translations.key === 'ua' ? '' : `/${lang}`,
          }))
          .reduce(
            (htmlWebpackPlugins, { filenamePrefix, translations, startDate, locale, langPrefix }) => [
              ...htmlWebpackPlugins,
              new HtmlWebpackPlugin({
                template: 'src/pages/index-page/index.hbs',
                chunks: ['common', 'index'],
                inject: 'body',
                minify: true,
                filename: `${filenamePrefix}index.html`,
                translations,
                startDate,
                locale,
                langPrefix,
                shppAge: (() => {
                  const lang = translations.key || 'en';
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
              }),
              new HtmlWebpackPlugin({
                template: 'src/pages/feedbacks-page/index.hbs',
                chunks: ['common', 'feedback-all/index'],
                inject: 'body',
                minify: true,
                filename: `${filenamePrefix}feedback-all/index.html`,
                translations,
                locale,
                langPrefix,
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
