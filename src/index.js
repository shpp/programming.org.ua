import './index.scss';
import Swiper, { Autoplay } from 'swiper';
import 'swiper/css';

('use strict');

require.context('/assets/images', true);

globalThis.programmingOrgUa = {
  openMobileMenu: () => document.querySelector('header > .right')?.classList.add('mobile-menu-opened'),
  closeMobileMenu: () => document.querySelector('header > .right')?.classList.remove('mobile-menu-opened'),
};

new Swiper(document.querySelector('.partners-slider'), {
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  breakpoints: [
    [576, 1],
    [768, 2],
    [992, 3],
    [1199, 4],
    [1200, 5],
  ].reduce(
    (breakPointsConfig, [resolution, numberOfSlides]) => ({
      ...breakPointsConfig,
      [resolution]: { slidesPerView: numberOfSlides },
    }),
    {}
  ),
  modules: [Autoplay],
});
