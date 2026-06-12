<template>
  <div class="cover-box">
    <!-- <b-carousel :interval="0" no-touch no-animation v-model="carouselIndex">
      <b-carousel-slide
        v-for="(item, index) in list.filter(
          (item) =>
            item.split('.')[item.split('.').length - 1] !== 'jpg' && item !== ''
        )"
        :key="`product_detail_${index}`"
      >
        <template #img v-if="item && item.length">
          <video-box
            v-if="CoverUrl && list[0] === item && item !== ''"
            :src="item"
            :url="CoverUrl"
          ></video-box>
          <zoom-box v-else :src="item" />
        </template>
      </b-carousel-slide>
    </b-carousel> -->
    <div class="productCover">
      <video-box v-if="CoverUrl && list[0] === currentImage && currentImage !== ''" :src="currentImage"
        :url="CoverUrl"></video-box>
      <zoom-box v-else :src="currentImage" />
    </div>
    <el-tabs v-model="tabsIndex">
      <el-tab-pane v-for="(item, index) in list.filter(
        (item) =>
          item.split('.')[item.split('.').length - 1] !== 'mp4' && item !== ''
      )" :key="`product_tabpane_${index}`">
        <div slot="label" class="cover-box-image" v-if="item.split('.')[item.split('.').length - 1] === 'jpg'">
          <sui-image :src="item" width="60px" height="60px" :lazy="true" />
        </div>
        <div slot="label" class="cover-box-image" v-else>
          <sui-image :src="item" width="60px" height="60px" cut="64" :lazy="true" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SuiImage from "@/components/s-ui/media/Image";
import ZoomBox from "./ZoomBox.vue";
import VideoBox from "@/components/product/VideoBox";

export default {
  components: {
    ZoomBox,
    SuiImage,
    VideoBox,
  },
  props: {
    CoverUrl: {
      type: String,
      default() {
        return "";
      },
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      carouselIndex: 0,
      tabPosition: "left",
    };
  },
  computed: {
    tabsIndex: {
      get() {
        return String(this.carouselIndex);
      },
      set(value) {
        this.carouselIndex = Number(value);
      },
    },
    currentImage() {
      return this.list.filter(
        (item) =>
          item.split('.').pop() !== 'mp4' && item !== ''
      )[this.carouselIndex]
    }
  },
  methods: {
    setCarouselIndex(i = 0) {
      this.carouselIndex = i;
    },
  },
};
</script>

<style lang="scss" scoped>
@use "@/style/_responsive.scss" as *;

.cover-box {
  max-width: 100vw;

  @include mobile {
    display: flex;
    flex-direction: row-reverse;
  }

  &-image {
    width: 64px;
    height: 64px;

    img {
      object-fit: cover;
    }
  }

  .el-tabs.el-tabs--top {
    max-width: 100vw;

    @include mobile {
      max-height: 310px;
    }
  }

  .el-tabs__header {
    @include mobile {
      max-height: 100%;
      overflow: auto;
    }
  }

  .el-tabs__nav-wrap.is-scrollable {
    @include mobile {
      padding: 0 20px;
    }
  }

  .el-tabs__nav-prev {
    @include mobile {
      top: 0;
    }
  }

  .el-tabs__nav-next {
    @include mobile {
      bottom: 0;
    }
  }

  .el-tabs__content {
    display: none;
  }

  .el-tabs--border-card {
    border: none;
    box-shadow: none;
    height: 64px;
  }

  .el-tabs--border-card>.el-tabs__header {
    background-color: transparent;
  }

  .el-tabs--border-card>.el-tabs__header {
    border: none;
  }

  .el-tabs--top .el-tabs__item.is-top:last-child {
    padding-right: 20px;
  }

  .el-tabs__item {
    height: 64px;
    line-height: 64px;
    width: 64px;
    padding-right: 0;
    padding-left: 0;

    @include mobile {
      display: block;
    }
  }

  .el-tabs__active-bar {
    @include mobile {
      right: 0;
      left: auto;
      top: 0;
      bottom: auto;
      display: none;
    }
  }

  .el-tabs__nav-next,
  .el-tabs__nav-prev {
    color: #ef2e22;
    background-color: #ffeeee;
    line-height: 64px;
    font-size: 22px;
  }

  .el-tabs__nav-wrap::after {
    display: none;
  }
}
</style>