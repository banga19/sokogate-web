<template>
  <el-steps
    class="steps"
    align-center
    :space="400"
    :active="active"
    finish-status="success"
  >
    <el-step
      :title="`${this.$t('order.step')}${1}`"
      :description="this.$t('order.information')"
    ></el-step>
    <el-step
      :title="`${this.$t('order.step')}${2}`"
      :description="this.$t('order.payment')"
    ></el-step>
    <el-step
      :title="`${this.$t('order.step')}${3}`"
      :description="this.$t('order.complete')"
    ></el-step>
  </el-steps>
</template>

<script>
export default {
  props: {
    active: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style scoped>
.steps {
  padding: 30px 0;
  justify-content: center;
}
</style>