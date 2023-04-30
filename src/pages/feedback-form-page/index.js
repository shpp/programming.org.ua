import './index.scss';
import { createApp } from 'vue/dist/vue.esm-bundler.js';
import ImageUpload from '../../image-upload';

('use strict');

createApp({
    components: {
        ImageUpload
    },
    data: () => ({
        validated: false,
        role: 'student',
        loading: false,
        responseCode: null
    }),
    methods: {
        validateAndSubmit() {
            this.validated = true;

            setTimeout(() => {
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
                    .then(res => res.json())
                    .then(({status}) => {
                        this.responseCode = status;
                        this.loading = false;

                        if (status === 200) {
                            // not sure if it's needed
                            // this.$refs.form.reset();
                            this.validated = false;
                        }
                    })
                    .catch(err => {
                        this.responseCode = err.code;
                        this.loading = false;
                    })
            }, 0)

        },
    }
}).mount('main');