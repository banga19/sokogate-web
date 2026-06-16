<template>
  <div class="myweight-dropdown">
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">{{ WeightValue + unit }}</span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(item, index) in items"
          :key="`weight_${index}`"
          :command="item.unit"
          >{{ item.unit }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>



<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      WeightValue: "",
      unit: this.$t("productManagement.kg"),
      items: [
        {
          unit: this.$t("productManagement.lb"),
        },
        {
          unit: this.$t("productManagement.kg"),
        },
        {
          unit: this.$t("productManagement.gr"),
        },
        {
          unit: this.$t("productManagement.oz"),
        },
      ],
    };
  },
  created() {
    this.WeightValue = this.value;
  },
  methods: {
    handleCommand(command) {
      if (command === this.$t("productManagement.lb")) {
        this.WeightValue = (this.value * 2,2046226).toFixed(3);
        this.unit = command;
      } else if (command === this.$t("productManagement.gr")) {
        this.WeightValue = (this.value * 15432,3583529).toFixed(3);
        this.unit = command;
      } else if (command === this.$t("productManagement.oz")) {
        this.WeightValue = (this.value * 35,2739619).toFixed(3);
        this.unit = command;
      } else {
        this.WeightValue = this.value;
        this.unit = this.$t("productManagement.kg");
      }
    },
  },
};
</script>

<style lang="scss">
.myweight-dropdown {
  .el-dropdown-link {
    cursor: pointer;
    color: #333;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
}
</style>