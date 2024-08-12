const Handlebars = require('handlebars/runtime');

module.exports = function (
  textTranslationKey,
  url,
  { langPrefix, relativePagePath, translations }
) {
  const isActive = relativePagePath.replace(/\/$/, '') === url.replace(/#.+/, '');
  const text = textTranslationKey.split('.').reduce((acc, val) => acc[val], translations);

  return new Handlebars.SafeString(
    `<li class="${isActive ? 'active' : ''}"><a href='${langPrefix}${url}'>${text}</a></li>`
  );
};
