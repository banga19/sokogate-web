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
  <div v-if="error">
    <i class="el-icon-warning" style="color: #e6a23c" />
    {{ $t("common.Failedclick") }}
    <el-button type="text" @click="reload">{{ $t("common.Reload") }}</el-button>
  </div>
  <el-cascader
    v-else
    v-loading="loading"
    :key="keyValue"
    :value="value"
    :props="{ expandTrigger: 'hover', checkStrictly: true }"
    :options="city"
    @change="handleChange"
  ></el-cascader>
</template>

<script>
import { GetStateAndCityListByCountryId } from "@/utils/api";
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
      loading: false,
      keyValue: 0,
      error: false,
    };
  },
  created() {
    this.getStateAndCityListByCountryId();
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
        this.getStateAndCityListByCountryId();
      }
    },
    city(newVal) {
      console.log(newVal, "newVal");
      this.keyValue++;
    },
  },
  methods: {
    getStateAndCityListByCountryId() {
      this.loading = true;
      // let cityName = localStorage.getItem("currentCountry");
      GetStateAndCityListByCountryId({ countryId: this.currentCountry })
        .then((res) => {
          console.log("GetStateAndCityListByCountryId-res", res);
          const cityList = res.data.cityList;
          // console.log(cityList, "cityList");
          const stateList = res.data.stateList;
          // console.log("stateList", stateList);

          let _childer_callback = function (categoryid) {
            let children = [];
            for (let item of cityList) {
              if (item.stateId == categoryid) {
                children.push({
                  value: item.name,
                  label: item.name,
                });
              }
            }
            return children;
          };
          let _arrange_data = [];
          for (let category of stateList) {
            _arrange_data.push({
              value: category.name,
              label: category.name,
              children: _childer_callback(category.id),
            });
          }
          this.city = _arrange_data;
          // console.log(this.city, "lessonList");
          this.loading = false;
        })
        .catch((err) => {
          console.log("GetStateAndCityListByCountryId-err:", err);
          this.loading = false;
          this.error = true;
        });
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