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
    <template v-if="value" v-slot:prefix>
      <div class="flag" :class="classObject"></div>
    </template>
    <el-option-group
      v-for="group in country"
      :key="group.label"
      :label="group.label"
    >
      <el-option
        v-for="item in group.options"
        :key="item.name"
        :label="$t('categorys.' + item.value)"
        :value="item.value"
      >
        <div class="flag" :class="`flag-${item.iso_code}`"></div>
        {{ $t("categorys." + item.value) }}
      </el-option>
    </el-option-group>
  </el-select>
</template>
<script>
import { GetCountryList } from "@/utils/api";

export default {
  props: {
    value: {
      default: "",
    },
  },

  data() {
    return {
      country: [],
      loading: false,
      error: false,
    };
  },

  created() {
    this.getCountry();
  },

  computed: {
    classObject: function () {
      if (this.country.length) {
        const selectCountry =
          this.country[0].options.find((v) => v.value === this.value) ||
          this.country[1].options.find((v) => v.value === this.value);
        if (selectCountry) {
          return {
            ["flag-" + selectCountry.iso_code]: !!this.value && !!selectCountry,
          };
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
  },

  methods: {
    getCountry() {
      this.loading = true;
      GetCountryList()
        .then((res) => {
          const allCountry = res.data.rows.map((v) => {
            return {
              value: v.countryName,
              iso_code: v.isoCode.toLowerCase(),
              label: v.countryName,
            };
          });
          const popularCountry = ["China", "Turkey", "United Arab Emirates"];
          this.$set(this.country, 1, {
            options: allCountry,
          });
          this.$set(this.country, 0, {
            options: allCountry.filter(
              (v) => popularCountry.indexOf(v.value) > -1
            ),
          });
          this.loading = false;
        })
        .catch((err) => {
          console.log("GetCountryList-err:", err);
          this.loading = false;
          this.error = true;
        });
    },
    reload() {
      this.error = false;
      this.getCountry();
    },
    handleChange(e) {
      const zh = this.$i18n.getLocaleMessage("zh");
      const country = zh.categorys;
      // console.log("country", country, country[e]);
      this.$store.commit("setcurrentCountry", country[e]);
      this.$emit("input", e);
    },
  },
};
</script>

<style>
@import url("../../../style/flags.css");

.el-input--prefix .el-input__prefix {
  margin-left: 5px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>