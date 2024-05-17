import './index.scss';
import { StudentStorage } from '../sign-up-index-page/student-storage';

const pageLocalStorageKey = 'anketa/last';
const pageVisitedKey = `${pageLocalStorageKey}.isVisited`;
const studentEmailKey = `${pageLocalStorageKey}.student.email`;
const languageKey = { en: 'en', uk: '', ru: 'ru' }[document.documentElement.lang] ?? '';
const studentEmail = localStorage.getItem(studentEmailKey);

handleRedirects();
function handleRedirects() {
  if (!studentEmail) {
    location.href = `/${languageKey}`;

    return;
  }

  document.querySelector('.content .email').innerHTML = `(${studentEmail})`;
  StudentStorage.reset();

  if (!localStorage.getItem(pageVisitedKey)) {
    localStorage.setItem(pageVisitedKey, 'true');

    return;
  }

  location.href = `/${languageKey}`;
}
