<template>
  <i
    class="svg-icon"
    :class="iconName"
    aria-hidden="true"
    :style="{
      color: color,
      width: size,
      height: size,
      cursor: pointer ? 'pointer' : 'default',
    }"
  >
  </i>
</template>


<script>
export default {
  name: "icon-svg",
  props: {
    iconClass: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#873535",
    },
    size: {
      type: String,
      default: "20px",
    },
    pointer: {
      //default不enable鼠标手状
      type: Boolean,
      default: false,
    },
  },
  computed: {
    iconName() {
      return `sokogate icon-${this.iconClass}`;
    },
  },
};
</script>


<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;
.svg-icon {
  font-size: 20px;
  vertical-align: middle;
  fill: currentColor;
  // overflow: hidden;
  position: relative;
  margin-top: 5px;
  top: 31px;
  left: 0.5%;
  z-index: 99;
  @include mobile {
    left: 2%;
  }
}
</style>