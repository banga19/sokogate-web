<template>
  <el-container>
    <Shortcut />
    <el-header height class="header-box sticky">
      <Header />
    </el-header>
    <el-main>
      <router-view />
    </el-main>
    <el-footer height>
      <Footer />
    </el-footer>
  </el-container>
</template>

<script>
import Shortcut from "@/layout/shortcutV2.vue";
import Header from "@/layout/HeaderV2/index.vue";
import Footer from "@/layout/footer.vue";

export default {
  name: 'IndexV2Home',
  components: {
    Shortcut,
    Header,
    Footer,
  },
  computed: {
    topNavActive() {
      return this.$store.getters['nav/getCurrentNav']
    },
    isAllProduct() {
      if (!this.topNavActive || this.topNavActive.name === '0') {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.aside {
  height: 100vh;
  background: #23262f;
}

.el-header {
  padding: 0;
}

.header-box {
  background-color: #fff;

  &.sticky {
    position: sticky;
    top: 60px;
    z-index: 200;
  }
}

.el-main {
  min-height: 50vh;
  padding: 0;
  overflow: inherit;
}

.el-footer {
  min-height: 30vh;
  background: #232323;
}
</style>