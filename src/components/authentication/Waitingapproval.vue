<template>
  <div class="waiting-approval">
    <el-row>
      <el-col>
        <el-result
          icon="warning"
          :title="$t('common.underreview')"
          :subTitle="$t('common.pleasewaitpatiently')"
        >
        </el-result>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.waiting-approval {
  margin-bottom: 20%;
}
</style>