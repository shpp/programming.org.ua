export default {
  props: ['name', 'placeholder', 'required'],
  data: () => ({
    preview: '',
    filename: '',
    dragActive: false,
  }),
  mounted() {
    this.initDragNDrop();
  },
  methods: {
    renderPreview(file) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        this.filename = file.name;
        this.preview = reader.result;
      });

      if (file) {
        reader.readAsDataURL(file);
      }
    },
    clearInput() {
      this.filename = '';
      this.preview = '';
      this.$refs.input.value = null;
    },
    initDragNDrop() {
      const dropzone = this.$refs.dropzone;

      // Prevent default drag behaviors
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
        dropzone.addEventListener(
          eventName,
          (e) => {
            e.preventDefault();
            e.stopPropagation();
          },
          false
        );
        document.body.addEventListener(
          eventName,
          (e) => {
            e.preventDefault();
            e.stopPropagation();
          },
          false
        );
      });

      // Highlight drop zone when item is dragged over it
      ['dragenter', 'dragover'].forEach((eventName) => {
        dropzone.addEventListener(eventName, () => (this.dragActive = true), false);
      });

      ['dragleave', 'drop'].forEach((eventName) => {
        dropzone.addEventListener(eventName, () => (this.dragActive = false), false);
      });

      // Handle dropped files
      dropzone.addEventListener('drop', (e) => this.renderPreview(e.dataTransfer.files[0]), false);
    },
  },
  template: ` <div class="form-element-image" ref="dropzone">
                    <input
                        type="file"
                        :id="name"
                        :name="name"
                        :required="required"
                        accept="image/*"
                        ref="input"
                        @change="e => renderPreview(e.target.files[0])">
                    <label
                        :for="name"
                        v-if="!preview"
                        :class="{dragActive}"
                        v-html="placeholder"
                    ></label>
                    <figure v-else>
                        <img :src="preview"/>
                        <figcaption>{{filename}}</figcaption>
                        <button @click="clearInput"><i class="fa fa-xmark"></i></button>
                    </figure>
                </div>`,
};
