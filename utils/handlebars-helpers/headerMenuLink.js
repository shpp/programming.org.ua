const Handlebars = require('handlebars/runtime');

module.exports = function (
  textTranslationKey,
  url,
  { langPrefix, langPrefixPath, baseHref, relativePagePath, translations }
) {
  const isActive = relativePagePath.replace(/\/$/, '') === url.replace(/#.+/, '');
  const text = textTranslationKey.split('.').reduce((acc, val) => acc[val], translations);
  const relativeUrl = url.replace(/^\//, '');

  return new Handlebars.SafeString(
    `<li class="${isActive ? 'active' : ''}"><a href='${baseHref}${langPrefixPath}${relativeUrl}'>${text}</a></li>`
  );
};
