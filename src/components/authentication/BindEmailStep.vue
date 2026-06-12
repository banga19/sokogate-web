<template>
  <el-steps
    class="steps"
    align-center
    :space="400"
    :active="active"
    finish-status="success"
  >
    <el-step
      :title="`${$t('order.step')}${1}`"
      :description="$t('bindemail')"
    ></el-step>
    <el-step
      :title="`${$t('order.step')}${2}`"
      :description="$t('common.waitingapproval')"
    ></el-step>
    <el-step
      :title="`${$t('order.step')}${3}`"
      :description="$t('bindemail.success')"
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