<template>
  <div class="zoom-box">
    <pic-zoom :url="src"></pic-zoom>
    <div id="canvasEl"></div>
  </div>
</template>


<script>
// 放大镜组件
import PicZoom from 'vuejs-picture-zoom'

export default {
  components: { PicZoom },
  props: {
    src: {
      type: String,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    cover() {
      return this.src + "?x-oss-process=style/w640";
    },
  },
  watch: {
    // $route() {
    //   const ml = document.getElementById("_magnifier_layer");
    //   if (ml) {
    //     ml.parentNode.removeChild(ml);
    //   }
    // },
  },
};
</script>


<style lang="scss" scoped>
.zoom-box {
  width: 458px;
  height: 458px;
  position: relative;

  ::v-deep {
    .magnifier-box {
      .mouse-cover {
        background-color: rgba(239, 46, 34, 0.2);
      }
    }
  }

  ._magnifier img {
    object-fit: contain;
  }
}
</style>