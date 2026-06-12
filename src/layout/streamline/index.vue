<template>
  <el-container>
    <Shortcut />
    <el-header height>
      <Header />
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
import Shortcut from "@/layout/shortcut.vue";
import Header from "@/layout/streamline/header.vue";

export default {
  components: {
    Shortcut,
    Header,
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
.el-main {
  min-height: 50vh;
  padding: 0;
}
</style>