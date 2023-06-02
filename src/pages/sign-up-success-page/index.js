import './index.scss';

const pageLocalStorageKey = 'anketa/last';

document.querySelector('.content .email').innerHTML = `(${localStorage.getItem(
  `${pageLocalStorageKey}.student.email`
)})`;

const pageVisitedKey = `${pageLocalStorageKey}.isVisited`;

!localStorage.getItem(pageVisitedKey)
  ? localStorage.setItem(pageVisitedKey, 'true')
  : (location.href = '/');
