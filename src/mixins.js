// Mixin to make Vue components visible
// Each component that is inited in element with class .vue-container will be hidden by default
// This is useful in cases when you don't want for ugly Vue template be visible before JS with Vue is inited on page
const displayHiddenComponentMixin = {
  mounted() {
    this.$el.parentNode.classList.add('visible')
  }
};

export {
  displayHiddenComponentMixin
}