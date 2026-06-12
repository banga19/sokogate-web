<template>
  <span>{{ result }}</span>
</template>

<script>
export default {
  props: {
    text: String,
    transMap: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    result() {
      if (this.transMap !== null) {
        const transResult = Object.prototype.hasOwnProperty.call(
          this.transMap,
          this.$store.state.language
        );
        if (transResult) {
          return this.transMap[this.$store.state.language].value;
        } else {
          return this.text;
        }
      } else {
        return this.text;
      }
    },
  },
};
</script>

<style>
</style>