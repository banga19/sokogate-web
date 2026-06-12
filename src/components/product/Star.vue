<template>
  <el-rate :value="value" disabled text-color="#ff9900"> </el-rate>
</template>

<script>
export default {
  props: {
    value: { type: Number, default: 5 },
  },
};
</script>

<style lang="scss">
@use "@/style/_responsive.scss" as *;

.el-rate {
  height: 24px;
  @include mobile {
    height: 18px;
    flex-shrink: 0;
  }
  @include tabletLand {
    height: 19px;
  }
  @include tabletPro {
    height: 20px;
  }
  @include tablet {
    height: 21px;
  }
  @include laptop {
    height: 22px;
  }
  @include desktop {
    height: 23px;
  }
  @include largeScrenn {
    height: 24px;
  }
  .el-rate__item {
    width: 24px;
    height: 24px;
    @include mobile {
      width: 18px;
      height: 18px;
    }
    @include tabletLand {
      width: 19px;
      height: 19px;
    }
    @include tabletPro {
      width: 20px;
      height: 20px;
    }
    @include tablet {
      width: 21px;
      height: 21px;
    }
    @include laptop {
      width: 22px;
      height: 22px;
    }
    @include desktop {
      width: 23px;
      height: 23px;
    }
    @include largeScrenn {
      width: 24px;
      height: 24px;
    }
    .el-rate__icon {
      font-size: 24px;
      @include mobile {
        font-size: 18px;
      }
      @include tabletLand {
        width: 19px;
      }
      @include tabletPro {
        width: 20px;
      }
      @include tablet {
        width: 21px;
      }
      @include laptop {
        width: 22px;
      }
      @include desktop {
        width: 23px;
      }
      @include largeScrenn {
        width: 24px;
      }
    }
  }
}
</style>