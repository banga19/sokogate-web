<template>
  <el-image :src="srcDisplay" class="sui-image" :preview-src-list="list" :lazy="lazy">
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
</template>

<script>
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
      default: "100%",
    },
    height: {
      type: [String, Number],
      default: "100%",
    },
    list: {
      type: Array,
    },
    lazy: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    srcDisplay() {
      const src = this.cut ? `${this.src}?x-oss-process=style/w${this.cut}` : this.src
      return src || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Y2EzYWYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0Ij5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='
    },
  },
};
</script>

<style lang="scss">
.sui {
  &-image {
    width: 100%;
    height: 100%;
    object-fit: contain;

    .skeleton-image {
      min-height: 388px;
    }
  }
}
</style>