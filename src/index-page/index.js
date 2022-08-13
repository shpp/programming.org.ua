import './index.scss';
import Swiper, { Autoplay, Pagination, Navigation } from 'swiper';
import 'swiper/css';
import { createApp } from 'petite-vue';

('use strict');

require.context('/assets/images', true);

init();

function init() {
  setupGlobalScope();
  setupFeedbacks();
  setupBlogPosts();
  setupManifesto();
  setupPartnersSlider();
  setupMessengersWidget();
}

function setupGlobalScope() {
  globalThis.programmingOrgUa = {
    openMobileMenu: () => document.querySelector('header > .right')?.classList.add('mobile-menu-opened'),
    closeMobileMenu: () => document.querySelector('header > .right')?.classList.remove('mobile-menu-opened'),
  };
}

function setupBlogPosts() {
  createApp({
    blogPosts: [],
    mounted() {
      // todo: use config to get needed url
      fetch('https://blog.programming.org.ua/wp-json/wp/v2/posts?_embed=true&per_page=9')
        .then((res) => res.json())
        .then((res) => {
          this.blogPosts = res.filter(({ polylang_current_lang }) => polylang_current_lang === 'en_GB'); // todo: update polylang_current_lang after add language support;
        });
    },
  }).mount('.blog-posts');
}

function setupFeedbacks() {
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
      nextEl: '.feedbacks-slider-next',
      prevEl: '.feedbacks-slider-previous',
    },
    modules: [Pagination, Navigation],
  });
  createApp({
    mounted() {
      // todo: use config to get neede url
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
    isFullTextMap: {},
    shouldShowFullText(index) {
      return this.isFullTextMap[index];
    },
    getName: (feedback) => [feedback.name, feedback.surname].join(' '),
    getImage: (feedback) => `https://back.programming.org.ua/storage/img/feedbacks/${feedback.image}`,
    getShortText(text) {
      return `${text.slice(0, this.smallTextLength)}...`;
    },
    more(index) {
      this.isFullTextMap[index] = true;
      setTimeout(() => feedbacksSlider.update(), 0);
    },
    less(index) {
      this.isFullTextMap[index] = false;
      setTimeout(() => feedbacksSlider.update(), 0);
    },
    isLongText(text) {
      return text.length > this.smallTextLength;
    },
  }).mount('.feedbacks');
}

function setupManifesto() {
  document.querySelectorAll('details').forEach(
    (el) =>
      new (class {
        // todo: review and simplify
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
      })(el)
  );
}

function setupMessengersWidget() {
  // todo: get translations url from config
  fetch('https://data.kowo.space/data/programming.org.ua/translations/en.json')
    .then((res) => res.json())
    .then((translations) => {
      // todo: find a way to import message widget not in index.html
      new globalThis.MessengersWidget({
        color: '#27ae60',
        title: translations.contact.title,
        messengers: {
          phone: '+380502011180',
          email: 'info@programming.org.ua',
          telegram: 'shpp_me',
          viber: '380502011180',
          facebook: '626295794236927',
        },
        titles: {
          phone: translations.contact.call,
          email: translations.contact.email,
          telegram: translations.contact.telegram,
          viber: translations.contact.viber,
          facebook: translations.contact.facebook,
        },
      });
    });
}

function setupPartnersSlider() {
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
}