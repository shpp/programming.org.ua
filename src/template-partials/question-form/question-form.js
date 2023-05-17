('use strict');
import './question-form.scss';
import { createApp } from 'vue/dist/vue.esm-bundler.js';
import { displayHiddenComponentMixin } from '../../mixins';

createApp({
  mixins: [displayHiddenComponentMixin],
  data: () => ({
    shouldBeValidated: false,
    loading: false,
    responseCode: null,
    responseMessage: null,
  }),
  methods: {
    async validateAndSubmit() {
      this.shouldBeValidated = true;
      await this.$nextTick();
      const isFormValid = this.$refs.questionForm.reportValidity();

      if (!isFormValid) {
        return;
      }

      const formData = new FormData(this.$refs.questionForm);
      this.loading = true;
      fetch('https://back.programming.org.ua/api/user/question', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then(({ status, error }) => {
          this.responseCode = status;

          if (error) {
            return Promise.reject(error);
          }

          if (status === 200) {
            this.$refs.questionForm.reset();
            this.shouldBeValidated = false;
          }
        })
        .catch((err) => {
          this.responseCode = err.code;
          this.responseMessage = err.message;
        })
        .finally(() => {
          this.loading = false;
          setTimeout(() => (this.responseCode = null), 5 * 1000);
        });
    },
  },
}).mount('.question-form');
