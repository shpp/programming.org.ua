('use strict');
import { displayHiddenComponentMixin } from '../../mixins';
import { createApp } from 'vue/dist/vue.esm-bundler.js';
import Accordion from '../../template-partials/accordion';
import Swiper, { Pagination, Navigation } from 'swiper';
import './index.scss';
import 'swiper/css';

function init() {
  new Accordion('.faq ul');
  setupFeedbacks();
}

init();

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
        body: `count=5&onlyStudents=true&feedbackType=random&lang=${
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
              loop: true,
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
          }, 1000);
        });
    },
    data() {
      return {
        feedbacks: [],
        smallTextLength: 300,
        isFullTextMap: {},
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
