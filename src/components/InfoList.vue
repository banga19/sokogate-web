<template>
  <div>
    <el-row class="info-list" type="flex">
      <el-col v-if="title" class="info-list-title">{{ $t(title) }}</el-col>
      <template v-for="(value, key) in value">
        <el-col :key="`label-${key}`" :sm="4" :xs="8" class="info-list-label">
          {{ (names && names[key]) || key }}
        </el-col>
        <el-col
          :key="`content-${key}`"
          :sm="8"
          :xs="16"
          class="info-list-content"
        >
          <!-- <template v-if="exhibit[key]">
            <component v-bind:is="exhibit[key].type" :value="value"></component>
          </template> -->
          <!-- <template v-else> -->
          {{ value || "-" }}
          <!-- </template> -->
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
// import State from "@/components/s-ui/info/state";
// import Price from "@/components/s-ui/info/price";
export default {
  // components: {
  //   State,
  //   Price,
  // },
  props: {
    title: String,
    value: {
      type: Object,
      required: true,
    },
    names: {
      type: Object,
      required: false,
    },
    exhibit: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="scss">
.info-list {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;

  &-title {
    color: #333;
    background: transparent;
    border: 1px solid transparent;
    padding: 12px 10px;
    font-size: 18px;
  }

  &-label {
    color: #909399;
    background: #fafafa;
    padding: 12px 10px;
    box-sizing: border-box;
    text-align: left;
    font-weight: 400;
    line-height: 1.5;
    border-right: 1px solid #ebeef5;
    border-bottom: 1px solid #ebeef5;
  }

  &-content {
    color: #606266;
    background-color: #fff;
    padding: 12px 10px;
    box-sizing: border-box;
    text-align: left;
    font-weight: 400;
    line-height: 1.5;
    border-bottom: 1px solid #ebeef5;
    border-right: 1px solid #ebeef5;
  }
}
</style>