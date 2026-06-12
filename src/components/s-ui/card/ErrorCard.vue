<template>
  <el-result icon="error" :title="data.errmsg" :subTitle="subTitle">
    <template slot="extra">
      <el-button type="primary" size="medium" @click="$emit('refresh')">
        {{ $t("common.refresh") }}
      </el-button>
    </template>
  </el-result>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
    },
  },
  computed: {
    subTitle() {
      return String(JSON.stringify(this.data));
    },
  },
};
</script>

<style>
</style>