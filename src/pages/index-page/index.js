('use strict');
import './index.scss';
import Swiper, { Autoplay, Pagination, Navigation } from 'swiper';
import 'swiper/css';
import { createApp } from 'vue/dist/vue.esm-bundler.js';
import { displayHiddenComponentMixin } from '../../mixins';
import setupManifesto from '../../template-partials/good-school-manifesto/good-school-manifesto';

init();

function init() {
  setupFeedbacks();
  setupBlogPosts();
  setupManifesto();
  setupPartnersSlider();
}

function setupBlogPosts() {
  createApp({
    mixins: [displayHiddenComponentMixin],
    data() {
      return { blogPosts: [] };
    },
    mounted() {
      // todo: use config to get needed url
      fetch('https://blog.programming.org.ua/wp-json/wp/v2/posts?_embed=true&per_page=9')
        .then((res) => res.json())
        .then((res) => {
          this.blogPosts = res.filter(
            ({ polylang_current_lang: postLanguage }) =>
              postLanguage ===
                { en: 'en_GB', uk: 'uk', ru: 'ru_RU' }[document.documentElement.lang] ?? 'en_GB'
          );
        });
    },
    methods: {
      getImage(post = null) {
        return (
          post?._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.large?.source_url ||
          null
        );
      },
    },
  }).mount('.blog-posts');
}

function setupFeedbacks() {
  createApp({
    mixins: [displayHiddenComponentMixin],
    mounted() {
      // todo: use config to get neede url
      fetch('https://back.programming.org.ua/api/feedback', {
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: `count=6&onlyStudents=true&feedbackType=random&lang=${
          document.documentElement.lang ?? 'en'
        }`,
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
      })
        .then((res) => res.json())
        .then((data) => {
          this.feedbacks = data.data.feedbacks;

          setTimeout(() => {
            this.slider = new Swiper(this.$refs.sliderRef, {
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
          }, 0);
        });
    },
    data() {
      return {
        feedbacks: [],
        smallTextLength: 300,
        isFullTextMap: {},
        slider: null,
      };
    },
    methods: {
      shouldShowFullText(index) {
        return this.isFullTextMap[index];
      },
      getName: (feedback) => [feedback.name, feedback.surname].join(' '),
      getImage: (feedback) =>
        `https://back.programming.org.ua/storage/img/feedbacks/${feedback.image}`,
      getShortText(text) {
        return `${text.slice(0, this.smallTextLength)}...`;
      },
      more(index) {
        this.isFullTextMap[index] = true;
        setTimeout(() => this.slider?.updateAutoHeight(), 0);
      },
      isLongText(text) {
        return text && text.length > this.smallTextLength;
      },
    },
  }).mount('.feedbacks');
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
      [1500, 6],
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
