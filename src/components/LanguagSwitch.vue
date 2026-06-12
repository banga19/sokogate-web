<template>
  <!-- 语言切换按钮 -->
  <el-dropdown @command="handleCommandLang">
    <div class="we-chat">
      <span class>{{ $t("common.languageChange") }}</span>
      <i class="el-icon-arrow-down"></i>
    </div>
    <template v-slot:dropdown>
      <el-dropdown-menu style="margin-top: -20px">
        <el-dropdown-item command="zh">简体中文</el-dropdown-item>
        <el-dropdown-item command="en">English</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
export default {
  methods: {
    // 语言切换
    handleCommandLang(type) {
      localStorage.setItem("thisLanguage", type);
      this.$i18n.locale = type;
    },
  },
};
</script>