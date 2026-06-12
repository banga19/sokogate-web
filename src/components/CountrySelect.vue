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
        :label="$t('categorys.' + item.label)"
        :value="item.value"
      >
        <sui-flag :name="item.label" class="country-icon" />
        {{ $t("categorys." + item.label) }}
      </el-option>
    </el-option-group>
  </el-select>
</template>
<script>
import { GetCountryList } from "@/utils/api";
import SuiFlag from "@/components/product/Flag";
export default {
  components: { SuiFlag },
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
              value: v.isoCode,
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
      // console.log(e, "handleChange");
      this.$emit("select", e);
    },
  },
};
</script>

<style lang="scss">
@use "@/style/_responsive.scss" as *;
.el-input--prefix .el-input__prefix {
  margin-left: 5px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.country-icon {
  @include mobile {
    margin-left: 35% !important;
  }
}
</style>