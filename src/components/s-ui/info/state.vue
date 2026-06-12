<template>
  <el-tag :type="type" size="small">{{ statusText[value] }}</el-tag>
</template>

<script>
export default {
  props: {
    value: Number,
  },
  data() {
    return {};
  },
  computed: {
    statusText: function () {
      return this.$t("order.statusText");
    },
    type: function () {
      switch (this.value) {
        case 101:
        case 201:
        case 401:
        case 501:
        case 701:
        case 801:
        case 901:
          return "warning";
        case 301:
        case 601:
          return "";
        case 1001:
        case 1101:
          return "success";
        case 1201:
        case 1301:
          return "danger";
        default:
          return "info";
      }
    },
  },
};
</script>

<style>
</style>