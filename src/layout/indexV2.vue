<template>
  <el-container>
    <Shortcut />
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
import Footer from "@/layout/footer.vue";

export default {
  name: "IndexV2",
  components: {
    Shortcut,
    Footer,
  },
};
</script>

<style scoped>
.aside {
  height: 100vh;
  background: #23262f;
}

.el-header {
  padding: 0;
}

.header-box {
  position: sticky;
  top: -50px;
  z-index: 11;
  background-color: #fff;
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