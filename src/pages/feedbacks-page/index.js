import './index.scss';
import { createApp } from 'petite-vue';

('use strict');

createApp({
  mounted() {
    // todo: use config to get neede url
    fetch('https://back.programming.org.ua/api/feedback', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: 'count=6&onlyStudents=true&feedbackType=student&lang=en',
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
    })
      .then((res) => res.json())
      .then((data) => (this.feedbacks = data.data.feedbacks));
  },
  feedbacks: [],
  smallTextLength: 300,
  isFullTextMap: {},
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
  less(index) {
    this.isFullTextMap[index] = false;
  },
  isLongText(text) {
    return text.length > this.smallTextLength;
  },
}).mount('.feedbacks');
