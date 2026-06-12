<template>
  <div class="back-to-top" @click="gotoTop" v-show="isShow">
    <span class="back-box">
      <i class="el-icon-arrow-up icon-up"></i>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
    };
  },
  mounted() {
    this.listenerFunction();
  },
  beforeDestroy() {
    document.removeEventListener("scroll", this.listenerFunction);
  },
  methods: {
    listenerFunction() {
      document.addEventListener("scroll", this.handleScroll, true);
    },
    handleScroll() {
      if (window.pageYOffset > 300) {
        //window.pageYOffset:获取滚动距离
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    },
    // 返回顶部
    gotoTop() {
      // window.scroll({
      //   top: 0,
      //   left: 0,
      //   behavior: "smooth",
      // });
      let top = document.documentElement.scrollTop || document.body.scrollTop;
      // 实现滚动效果
      const timeTop = setInterval(() => {
        document.body.scrollTop =
          document.documentElement.scrollTop =
          top -=
            50;
        if (top <= 0) {
          clearInterval(timeTop);
        }
      }, 10);
    },
  },
};
</script>

<style lang="scss">
.back-to-top {
  cursor: pointer;
  position: fixed;
  bottom: 40px;
  right: 30px;
  z-index: 999;
  .back-box {
    display: flex;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #ef2e22;
    justify-content: center;
    align-items: center;
    .icon-up {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
    }
  }
}
</style>