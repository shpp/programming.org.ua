import './index.scss';
import Swiper, { Autoplay, Pagination, Navigation } from 'swiper';
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

globalThis.PetiteVue.createApp({
  blogPosts: [],
  mounted() {
    fetch('https://blog.programming.org.ua/wp-json/wp/v2/posts?_embed=true&per_page=9')
      .then((res) => res.json())
      .then((res) => {
        this.blogPosts = res.filter(({ polylang_current_lang }) => polylang_current_lang === 'en_GB'); // todo: update polylang_current_lang after add language support;
      });
  },
}).mount('.blog-posts');

const feedbacksSlider = new Swiper(document.querySelector('.feedbacks-slider'), {
  spaceBetween: 30,
  autoHeight: true,
  breakpoints: {
    768: { slidesPerView: 1 },
    1200: { slidesPerView: 3 },
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.feedbacks-next',
    prevEl: '.feedbacks-previous',
  },
  modules: [Pagination, Navigation],
});
globalThis.PetiteVue.createApp({
  mounted() {
    fetch('https://back.programming.org.ua/api/feedback', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: 'count=6&onlyStudents=true&feedbackType=random&lang=en',
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
    })
      .then((res) => res.json())
      .then((data) => {
        this.feedbacks = data.data.feedbacks;
        setTimeout(() => feedbacksSlider.update(), 0);
      });
  },
  feedbacks: [],
  smallTextLength: 300,
  // todo: find better name for variable
  fullTexts: {},
  shouldShowFullText(index) {
    return this.fullTexts[index];
  },
  getName: (feedback) => [feedback.name, feedback.surname].join(' '),
  getImage: (feedback) => `https://back.programming.org.ua/storage/img/feedbacks/${feedback.image}`,
  getShortText(text) {
    return `${text.slice(0, this.smallTextLength)}...`;
  },
  more(index) {
    this.fullTexts[index] = true;
    setTimeout(() => feedbacksSlider.update(), 0);
  },
  less(index) {
    this.fullTexts[index] = false;
    setTimeout(() => feedbacksSlider.update(), 0);
  },
  isLongText(text) {
    return text.length > this.smallTextLength;
  },
}).mount('.feedbacks-slider');

// todo: review and simplify
class Accordion {
  constructor(el) {
    this.el = el;
    this.summary = el.querySelector('summary');
    this.content = el.querySelector('.content');

    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.summary.addEventListener('click', (e) => this.onClick(e));
  }

  onClick(e) {
    e.preventDefault();
    this.el.style.overflow = 'hidden';
    if (this.isClosing || !this.el.open) {
      this.open();
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }
  }

  shrink() {
    this.isClosing = true;
    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight}px`;

    this.animation && this.animation.cancel();

    this.animation = this.el.animate(
      {
        height: [startHeight, endHeight],
      },
      {
        duration: 400,
        easing: 'ease-out',
      }
    );

    this.animation.onfinish = () => this.onAnimationFinish(false);
    this.animation.oncancel = () => (this.isClosing = false);
  }

  open() {
    this.el.style.height = `${this.el.offsetHeight}px`;
    this.el.open = true;
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    this.isExpanding = true;
    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight + this.content.offsetHeight}px`;

    this.animation && this.animation.cancel();

    this.animation = this.el.animate(
      { height: [startHeight, endHeight] },
      {
        duration: 400,
        easing: 'ease-out',
      }
    );
    this.animation.onfinish = () => this.onAnimationFinish(true);
    this.animation.oncancel = () => (this.isExpanding = false);
  }

  onAnimationFinish(open) {
    this.el.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.el.style.height = '';
    this.el.style.overflow = '';
  }
}

document.querySelectorAll('details').forEach((el) => new Accordion(el));
