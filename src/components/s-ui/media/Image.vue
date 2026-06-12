<template>
  <div
    class="sui-image-wrapper"
    :style="wrapperStyle"
  >
    <!-- Low-quality image placeholder (blur-up effect) -->
    <div
      v-if="showPlaceholder"
      class="sui-image-placeholder"
      :style="{ paddingBottom: aspectPadding }"
    >
      <div class="sui-image-skeleton" :style="{ backgroundColor: placeholderColor }"></div>
    </div>

    <el-image
      :src="srcDisplay"
      :style="{'--sui-fade-duration': fadeDuration + 'ms'}"
      class="sui-image"
      :class="{
        'sui-image--loaded': loaded,
        'sui-image--error': error,
      }"
      :preview-src-list="list"
      :lazy="lazy"
      :fit="fit"
      @load="onLoad"
      @error="onError"
    >
      <!-- Skeleton placeholder slot (el-image shows this while loading) -->
      <el-skeleton
        slot="placeholder"
        :style="{ width: width, height: height }"
        :loading="true"
        animated
      >
        <template slot="template">
          <el-skeleton-item
            variant="image"
            class="skeleton-image"
            :style="{ width: width, height: height }"
          />
        </template>
      </el-skeleton>
    </el-image>
  </div>
</template>

<script>
import { getWebPUrl } from '@/utils/image';

export default {
  props: {
    src: {
      type: String,
    },
    cut: {
      type: [String, Number],
    },
    width: {
      type: [String, Number],
      default: '100%',
    },
    height: {
      type: [String, Number],
      default: '100%',
    },
    list: {
      type: Array,
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    /** Image object-fit: contain | cover | fill | none | scale-down */
    fit: {
      type: String,
      default: 'contain',
    },
    /** Enable WebP auto-conversion for OSS images (default: true) */
    webp: {
      type: Boolean,
      default: true,
    },
    /** Fade-in duration in ms after image loads */
    fadeDuration: {
      type: Number,
      default: 300,
    },
    /** Aspect ratio width (for CLS prevention placeholder) */
    aspectWidth: {
      type: Number,
      default: 0,
    },
    /** Aspect ratio height (for CLS prevention placeholder) */
    aspectHeight: {
      type: Number,
      default: 0,
    },
    /** Placeholder background color (for blur-up effect) */
    placeholderColor: {
      type: String,
      default: '#f5f5f5',
    },
  },
  data() {
    return {
      loaded: false,
      error: false,
      showPlaceholder: true,
    };
  },
  computed: {
    srcDisplay() {
      let src = this.src;

      // Apply OSS cut style (resize from server)
      if (this.cut && src) {
        src = `${src}?x-oss-process=style/w${this.cut}`;
      }

      // Auto-convert to WebP for OSS-hosted images
      if (this.webp && src) {
        src = getWebPUrl(src);
      }

      return src || FALLBACK_SVG;
    },
    wrapperStyle() {
      const style = {};
      if (this.width) style.width = this.width;
      if (this.height && !this.aspectHeight) style.height = this.height;
      return style;
    },
    aspectPadding() {
      if (this.aspectWidth && this.aspectHeight) {
        return `${(this.aspectHeight / this.aspectWidth) * 100}%`;
      }
      return '0';
    },
  },
  methods: {
    onLoad() {
      this.loaded = true;
      this.error = false;
      // Hide the low-res placeholder after a brief delay for the fade-in
      setTimeout(() => {
        this.showPlaceholder = false;
      }, this.fadeDuration + 100);
    },
    onError() {
      this.error = true;
      this.loaded = false;
      this.showPlaceholder = false;
    },
  },
};

const FALLBACK_SVG =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Y2EzYWYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0Ij5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
</script>

<style lang="scss">
.sui-image-wrapper {
  position: relative;
  overflow: hidden;
  line-height: 0;

  .sui-image-placeholder {
    width: 100%;
    height: 0;
    position: relative;
    overflow: hidden;

    .sui-image-skeleton {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  .sui-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0;
    transition: opacity var(--sui-fade-duration, 300ms) ease-in-out;

    &.sui-image--loaded {
      opacity: 1;
    }

    &.sui-image--error {
      opacity: 1;
      // Show a subtle error state
      filter: grayscale(0.5);
    }

    .skeleton-image {
      min-height: 388px;
    }

    // Override el-image placeholder to be relative so it sits inside our wrapper
    .el-image__placeholder {
      position: relative;
    }
  }
}
</style>
