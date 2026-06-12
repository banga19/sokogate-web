<template>
  <el-input-number
    :value="value"
    size="small"
    :disabled="disabled"
    :precision="0"
    :step="step"
    :min="min"
    :max="max"
    class="sui-number-input"
    @change="onChange"
  ></el-input-number>
</template>

<script>
export default {
  props: {
    value: { type: Number },
    min: { type: Number, default: 0 },
    step: { type: Number, default: 1 },
    max: { type: [Number, String] },
  },
  data() {
    return {
      disabled: false,
    };
  },
  methods: {
    onChange(val) {
      this.disabled = true;
      setTimeout(() => {
        this.disabled = false;
      }, 200);
      this.$emit("input", val);
    },
  },
};
</script>

<style lang="scss">
.sui-number-input.el-input-number {
  .el-input-number__decrease,
  .el-input-number__increase {
    border: 0;
    font-weight: bold;
    border-radius: 50%;
    color: #ef2e22;
    background-color: #ffeeee;
    transition: 0.5s;

    &:hover {
      color: #fff;
      background-color: #ef2e22;
    }

    &.is-disabled {
      color: #eee;
      background-color: #eee;
    }
  }
  .el-input__inner {
    border: 0;
    background-color: transparent;
  }
}
</style>