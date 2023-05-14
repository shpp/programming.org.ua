('use strict');
import './index.scss';
import { createApp } from 'vue/dist/vue.esm-bundler.js';
import ImageUpload from './image-upload';
import { displayHiddenComponentMixin } from '../../mixins';

createApp({
  mixins: [displayHiddenComponentMixin],
  components: {
    ImageUpload,
  },
  data: () => ({
    shouldBeValidated: false,
    role: 'student',
    loading: false,
    responseCode: null,
  }),
  methods: {
    async validateAndSubmit() {
      this.shouldBeValidated = true;
      await this.$nextTick();
      const isFormValid = this.$refs.form.reportValidity();

      if (!isFormValid) {
        return;
      }

      const formData = new FormData(this.$refs.form);
      this.loading = true;
      fetch(' https://back.programming.org.ua/api/feedback/create', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then(({ status }) => {
          this.responseCode = status;
          this.loading = false;

          if (status === 200) {
            this.$refs.form.reset();
            this.$refs.imageUpload.clearInput();
            this.shouldBeValidated = false;
          }
        })
        .catch((err) => {
          this.responseCode = err.code;
          this.loading = false;
        })
        .finally(() => setTimeout(() => (this.responseCode = null), 5 * 1000));
    },
  },
}).mount('main');
