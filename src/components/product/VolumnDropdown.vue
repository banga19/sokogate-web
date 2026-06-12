<template>
  <div class="myvolumn-dropdown">
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">{{ Volumevalue + unit }}</span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(item, index) in items"
          :key="`weight_${index}`"
          :command="item.unit"
          >{{ item.unit }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "0.1*0.1*0.1",
    },
  },
  data() {
    return {
      Volumevalue: "",
      unit: this.$t("productManagement.m"),
      items: [
        {
          unit: this.$t("productManagement.m"),
        },
        {
          unit: this.$t("productManagement.cm"),
        },
        {
          unit: this.$t("productManagement.mm"),
        },
      ],
    };
  },
  created() {
    this.Volumevalue = this.value;
  },
  methods: {
    // dropdown的command事件
    handleCommand(command) {
      const vol = this.value.split("*");
      const arr = vol.map(Number);
      if (command === this.$t("productManagement.cm")) {
        this.Volumevalue = arr.map((item) => {
          return (item * 100).toFixed(2);
        });
        this.unit = command;
        this.Volumevalue = this.Volumevalue.join("*");
      } else if (command === this.$t("productManagement.mm")) {
        this.Volumevalue = arr.map((item) => {
          return (item * 1000).toFixed(2);
        });
        this.unit = command;
        this.Volumevalue = this.Volumevalue.join("*");
      } else {
        this.unit = this.$t("productManagement.m");
        this.Volumevalue = this.value;
      }
    },
  },
};
</script>


<style lang="scss" scoped>
.myvolumn-dropdown {
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

