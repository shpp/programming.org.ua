import './common.scss';
require.context('/assets/images', true);

globalThis.programmingOrgUa = {
  openMobileMenu: () => document.querySelector('header > .right')?.classList.add('mobile-menu-opened'),
  closeMobileMenu: () => document.querySelector('header > .right')?.classList.remove('mobile-menu-opened'),
};

document.querySelectorAll('.languages .language a').forEach((link) => (link.href += `${location.search}${location.hash}`));
document.querySelector('.footer .footer-copyright .current-year').textContent = new Date().getFullYear();
