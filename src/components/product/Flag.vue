<template>
  <img :src="src" class="sui-flag" :alt="name" />
</template>

<script>
import phoneCodeJson from "../../../static/phonecode.json";
export default {
  name: "SuiFlag",
  props: {
    name: {
      type: String,
      default: "China",
    },
  },
  data() {
    return {
      // phoneCodelist: phoneCodeJson,
    };
  },
  computed: {
    countryMap() {
      return phoneCodeJson.reduce(
        (a, v) => ({
          ...a,
          [v.nicename]: v.iso.toLowerCase(),
        }),
        {}
      );
    },
    src() {
      return `https://oss.sokogate.com/static/flags/${
        this.countryMap[this.name]
      }.svg`;
    },
  },
};
</script>

<style lang="scss" scoped>
.sui-flag {
  width: 24px;
  margin: 3px;
}
</style>