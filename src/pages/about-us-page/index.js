import './index.scss';
import '../../template-partials/question-form/question-form';
import Swiper, { Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/css';

function setupTeamSlider() {
  new Swiper(document.querySelector('.team-slider'), {
    loop: true,
    delay: 5000,
    autoplay: {
      disableOnInteraction: false,
    },
    slidesPerView: 2,
    spaceBetween: 16,
    breakpoints: {
      576: { slidesPerView: 3 },
      992: { slidesPerView: 5 },
      1200: { slidesPerView: 7 },
    },
    navigation: {
      nextEl: '.team-slider-next',
      prevEl: '.team-slider-previous',
    },
    modules: [Autoplay, Navigation],
  });
}

function setupHistorySlider() {
  console.log('call swiper');
  new Swiper(document.querySelector('.history-slider'), {
    loop: false,
    spaceBetween: 32,
    breakpoints: {
      768: { slidesPerView: 2 },
      992: { slidesPerView: 4 },
      1400: { slidesPerView: 5 },
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.history-slider-next',
      prevEl: '.history-slider-previous',
    },
    modules: [Pagination, Navigation],
  });
}

function main() {
  setupTeamSlider();
  setupHistorySlider();
}

main();
