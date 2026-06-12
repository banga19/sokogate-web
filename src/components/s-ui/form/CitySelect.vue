<template>
  <div v-if="error">
    <i class="el-icon-warning" style="color: #e6a23c" />
    {{ $t("common.Failedclick") }}
    <el-button type="text" @click="reload">{{ $t("common.Reload") }}</el-button>
  </div>
  <el-select
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
  </el-select>
</template>
<script>
import { GetCityList } from "@/utils/api";

export default {
  props: {
    value: {
      default: "",
    },
  },

  data() {
    return {
      city: [],
      loading: false,
      error: false,
    };
  },

  created() {
    this.getCityList();
  },

  methods: {
    getCityList() {
      this.loading = true;
      GetCityList()
        .then((res) => {
          //   console.log("GetCityList-res", res);
          const allCity = res.data.rows.map((v) => {
            return {
              value: v.cityNameCh,
              label: v.cityNameCh,
            };
          });
          const popularCity = ["深圳市", "广州市", "义乌市"];
          this.$set(this.city, 1, {
            options: allCity,
          });
          this.$set(this.city, 0, {
            options: allCity.filter((v) => popularCity.indexOf(v.value) > -1),
          });
          this.loading = false;
        })
        .catch((err) => {
          console.log("GetCityList-err:", err);
          this.loading = false;
          this.error = true;
        });
    },
    reload() {
      this.error = false;
      this.getCityList();
    },
    handleChange(e) {
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