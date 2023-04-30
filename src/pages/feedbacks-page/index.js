import './index.scss';
import { createApp } from 'vue/dist/vue.esm-bundler.js';

('use strict');

createApp({
  mounted() {
    // todo: use config to get neede url
    fetch('https://back.programming.org.ua/api/feedback', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: `count=6&onlyStudents=true&feedbackType=student&lang=${document.documentElement.lang ?? 'en'}`,
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
    })
      .then((res) => res.json())
      .then((data) => {
        this.feedbacks = data.data.feedbacks
        this.$refs.container.classList.remove('hidden');
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
    getName: ({ name, surname }) => [name, surname].join(' '),
    getImage: ({ image }) => `https://back.programming.org.ua/storage/img/feedbacks/${image}`,
    getShortText(text) {
      return `${text.slice(0, this.smallTextLength)}...`;
    },
    more(index) {
      this.isFullTextMap[index] = true;
    },
    isLongText(text) {
      return text.length > this.smallTextLength;
    },
  },
}).mount('.feedbacks');
