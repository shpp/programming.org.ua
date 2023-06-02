import './index.scss';

const pageLocalStorageKey = 'anketa/last';

document.querySelector('.content .email').innerHTML = `(${localStorage.getItem(
  `${pageLocalStorageKey}.student.email`
)})`;

const pageVisitedKey = `${pageLocalStorageKey}.isVisited`;
const languageKey = { en: 'en', uk: '', ru: 'ru' }[document.documentElement.lang] ?? '';

!localStorage.getItem(pageVisitedKey)
  ? localStorage.setItem(pageVisitedKey, 'true')
  : (location.href = `/${languageKey}`);
