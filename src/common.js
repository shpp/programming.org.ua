import './common.scss';
require.context('/assets/images', true);

globalThis.programmingOrgUa = {
  openMobileMenu: () => document.querySelector('header > .right')?.classList.add('mobile-menu-opened'),
  closeMobileMenu: () => document.querySelector('header > .right')?.classList.remove('mobile-menu-opened'),
};
