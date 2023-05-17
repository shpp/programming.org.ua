import './index.scss';

location.hash === '#detailed' &&
  document.querySelector('.support-description').classList.add('detailed');

window.addEventListener(
  'hashchange',
  () =>
    location.hash === '#detailed' &&
    document.querySelector('.support-description').classList.add('detailed')
);
