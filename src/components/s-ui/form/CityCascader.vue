<template>
  <!-- <el-select
    v-else
    v-loading="loading"
    :value="value"
    :placeholder="$t('common.selectPlaceholder')"
    autocomplete="autocomplete"
    filterable
    @change="handleChange"
  >
    <el-option-group
      v-for="group in city"
      :key="group.label"
      :label="group.label"
    >
      <el-option
        v-for="item in group.options"
        :key="item.name"
        :label="item.value"
        :value="item.value"
      >
      </el-option>
    </el-option-group>
  </el-select> -->
  <!-- v-else -->
  <el-cascader
    v-loading="loading"
    :value="value"
    :props="{ expandTrigger: 'hover', checkStrictly: true }"
    :options="city"
    @change="handleChange"
  ></el-cascader>
</template>

<script>
import { GetAreabyAName } from "@/utils/api";
export default {
  props: {
    value: {
      trpe: Array,
      default() {
        [];
      },
    },
  },

  data() {
    return {
      city: [],
      // value: [],
      loading: false,
      // error: false,
    };
  },
  created() {
    this.getAreabyAName();
  },
  computed: {
    currentCountry() {
      return this.$store.state.currentCountry;
    },
  },
  watch: {
    currentCountry: function (newVal, oldVal) {
      // console.log("newVal", newVal, "oldVal", oldVal);
      if (newVal !== oldVal) {
        this.getAreabyAName();
      }
    },
  },
  methods: {
    getAreabyAName() {
      this.loading = true;
      // let cityName = localStorage.getItem("currentCountry");
      GetAreabyAName({ aName: "中国" })
        .then((res) => {
          // console.log("GetAreabyAName-res", res);
          this.city = this.formatCategory(res.data.areaList);
          // console.log("city", this.city);
          this.loading = false;
        })
        .catch((err) => {
          console.log("GetCityList-err:", err);
          this.loading = false;
          // this.error = true;
        });
    },
    formatCategory(list) {
      return list.map((v) => {
        const options = v.areaList
          ? { children: this.formatCategory(v.areaList) }
          : {};
        return {
          value: v.aName,
          label: v.aName,
          ...options,
        };
      });
    },
    reload() {
      this.error = false;
      this.getAreabyAName();
    },
    handleChange(e) {
      // console.log("handleChange", e);
      this.$emit("input", e);
    },
  },
};
</script>

<style>
@import url("../../../style/flags.css");

.el-input--prefix .el-input__prefix {
  margin-left: 5px;
  margin-right: 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>