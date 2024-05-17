export const PageProxy = {
  redirectToAdults() {
    location.href += '/adults';
  },

  redirectToTeens() {
    location.href += '/teens';
  },

  showWarning() {
    document.querySelector('.warning').classList.remove('hidden');
    document.querySelector('.warning').classList.add('visible');
  },
};
