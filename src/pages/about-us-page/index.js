import './index.scss';
import '../../template-partials/question-form/question-form';
import Swiper, { Autoplay, Navigation } from 'swiper';
import 'swiper/css';

function setupTeamSlider() {
  new Swiper(document.querySelector('.team-slider'), {
    loop: true,
    delay: 5000,
    autoplay: {
      disableOnInteraction: false,
    },
    spaceBetween: 16,
    breakpoints: {
      350: { slidesPerView: 2 },
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

function main() {
  setupTeamSlider();
}

main();
