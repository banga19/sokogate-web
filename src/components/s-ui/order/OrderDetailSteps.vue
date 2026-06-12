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
      :description="$t('content.orderDetailSteps.placeorder')"
    ></el-step>
    <el-step
      :title="`${$t('order.step')}${2}`"
      :description="$t('content.orderDetailSteps.depositpayment')"
    ></el-step>
    <el-step
      :title="`${$t('order.step')}${3}`"
      :description="$t('content.orderDetailSteps.preparegoods')"
    ></el-step>
    <el-step
      :title="`${$t('order.step')}${4}`"
      :description="$t('content.orderDetailSteps.finalpayment')"
    ></el-step>
    <el-step
      :title="`${$t('order.step')}${5}`"
      :description="$t('content.orderDetailSteps.sendtologisticscompany')"
    ></el-step>
    <el-step
      :title="`${$t('order.step')}${6}`"
      :description="$t('content.orderDetailSteps.import&getthegoods')"
    ></el-step>
    <el-step
      :title="`${$t('order.step')}${7}`"
      :description="$t('content.orderDetailSteps.orderfinished')"
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