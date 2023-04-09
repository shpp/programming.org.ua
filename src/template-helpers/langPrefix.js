const defaultLanguage = 'ua';
module.exports = (lang = defaultLanguage) => (lang === defaultLanguage ? '' : `/${lang}`);
